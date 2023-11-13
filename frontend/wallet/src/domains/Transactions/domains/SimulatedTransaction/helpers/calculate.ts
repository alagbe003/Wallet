import {
    Eip1559Fee,
    EstimatedFee,
    LegacyFee,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { components } from '@zeal/api/portfolio'
import { Big } from 'big.js'
import { notReachable } from '@zeal/toolkit'
import Web3 from 'web3'
import { Money } from '@zeal/domains/Money'
import { ImperativeError } from '@zeal/domains/Error'

const MUL = Big('1.11') //at least 10%

export const calculate = (
    old: EstimatedFee | components['schemas']['CustomPresetRequestFee'],
    newFee: EstimatedFee
): EstimatedFee => {
    switch (old.type) {
        case 'LegacyCustomPresetRequestFee':
        case 'LegacyFee':
            switch (newFee.type) {
                case 'LegacyFee':
                    return calculateLegacyFee(old, newFee)
                case 'Eip1559Fee':
                    throw new ImperativeError(
                        'cannot mix legacy and Eip1559Fee fees'
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(newFee)
            }
        case 'Eip1559Fee':
        case 'Eip1559CustomPresetRequestFee':
            switch (newFee.type) {
                case 'LegacyFee':
                    throw new ImperativeError(
                        'cannot mix Eip1559Fee and legacy fees'
                    )
                case 'Eip1559Fee':
                    return calculateEip1559Fee(old, newFee)
                /* istanbul ignore next */
                default:
                    return notReachable(newFee)
            }
        /* istanbul ignore next */
        default:
            return notReachable(old)
    }
}

const calculateEip1559Fee = (
    old: Eip1559Fee | components['schemas']['Eip1559CustomPresetRequestFee'],
    newFee: Eip1559Fee
): Eip1559Fee => {
    switch (old.type) {
        case 'Eip1559CustomPresetRequestFee':
            return newFee
        case 'Eip1559Fee':
            const { base: oldBase, priority: oldPriority } = splitFee(old)
            const { base: newBase, priority: newPriority } = splitFee(newFee)
            const calculatedBase = compare(oldBase, newBase, MUL)
            const calculatedPriority = compare(oldPriority, newPriority, MUL)
            const calculatedFee = calculatedBase.add(calculatedPriority)
            const rate = calculatedFee.div(toBig(newFee.maxFeePerGas))

            return {
                type: 'Eip1559Fee',
                maxPriorityFeePerGas: bigToHex(calculatedPriority),
                forecastDuration: newFee.forecastDuration,
                maxFeePerGas: bigToHex(calculatedFee),
                priceInNativeCurrency: mulMoney(
                    newFee.priceInNativeCurrency,
                    rate
                ),
                maxPriceInDefaultCurrency: newFee.maxPriceInDefaultCurrency
                    ? mulMoney(newFee.maxPriceInDefaultCurrency, rate)
                    : null,
                priceInDefaultCurrency: newFee.priceInDefaultCurrency
                    ? mulMoney(newFee.priceInDefaultCurrency, rate)
                    : null,
            }

        /* istanbul ignore next */
        default:
            return notReachable(old)
    }
}

const calculateLegacyFee = (
    old: LegacyFee | components['schemas']['LegacyCustomPresetRequestFee'],
    newFee: LegacyFee
): LegacyFee => {
    switch (old.type) {
        case 'LegacyCustomPresetRequestFee':
            return newFee
        case 'LegacyFee':
            const oldgasPriceWithMultiplier = toBig(old.gasPrice).mul(MUL)
            const newPrice = toBig(newFee.gasPrice)
            if (oldgasPriceWithMultiplier.gte(newPrice)) {
                return {
                    type: 'LegacyFee',
                    gasPrice: bigToHex(oldgasPriceWithMultiplier),
                    forecastDuration: newFee.forecastDuration,
                    priceInDefaultCurrency: old.priceInDefaultCurrency
                        ? mulMoney(old.priceInDefaultCurrency, MUL)
                        : null,
                    priceInNativeCurrency: mulMoney(
                        old.priceInNativeCurrency,
                        MUL
                    ),
                }
            }

            return newFee

        /* istanbul ignore next */
        default:
            return notReachable(old)
    }
}

const mulMoney = (money: Money, mul: Big): Money => {
    return {
        amount: BigInt(
            Big(money.amount.toString(10))
                .mul(mul)
                .toFixed(0, Big.roundUp)
                .toString()
        ),
        currencyId: money.currencyId,
    }
}

const bigToHex = (big: Big): string => {
    return Web3.utils.toHex(
        BigInt(big.toFixed(0, Big.roundUp).toString()).toString(10)
    )
}

const toBig = (hex: string): Big => {
    return Big(BigInt(hex).toString(10))
}

const splitFee = (fee: Eip1559Fee): { base: Big; priority: Big } => {
    const base = toBig(fee.maxFeePerGas).sub(toBig(fee.maxPriorityFeePerGas))
    return {
        base,
        priority: toBig(fee.maxPriorityFeePerGas),
    }
}

const compare = (oldFee: Big, newFee: Big, mul: Big): Big => {
    const oldWithM = oldFee.mul(mul)
    return oldWithM.gte(newFee) ? oldWithM : newFee
}
