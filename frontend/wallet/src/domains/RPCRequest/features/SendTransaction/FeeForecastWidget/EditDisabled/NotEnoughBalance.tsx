import { Skeleton } from './Skeleton'
import { Time } from './Time'

import { FeeInputButton } from 'src/uikit/Button/FeeInputButton'
import { NetworkFeeLabel, NotEnoughBalanceLabel } from '../components/Labels'
import { NotEnoughBalance as NotEnoughBalanceType } from 'src/domains/TransactionRequest/helpers/validateNotEnoughBalance'
import { getEstimatedFee } from 'src/domains/Transactions/domains/SimulatedTransaction/helpers/getEstimatedFee'
import { FormattedFee } from 'src/domains/Transactions/domains/SimulatedTransaction/components/FormattedFee'
import { Text2 } from 'src/uikit/Text2'
import { ProgressSpinner } from 'src/uikit/ProgressSpinner'

type Props = {
    pollingInterval: number
    pollingStartedAt: number
    error: NotEnoughBalanceType
}

export const NotEnoughBalance = ({
    error,
    pollingInterval,
    pollingStartedAt,
}: Props) => {
    const preset = getEstimatedFee(error.pollable)

    return preset ? (
        <FeeInputButton
            disabled
            errored
            left={
                <>
                    <NetworkFeeLabel />
                    <ProgressSpinner
                        key={pollingStartedAt}
                        size={20}
                        durationMs={pollingInterval}
                    />
                </>
            }
            right={
                <>
                    <Time errored forecastDuration={preset.forecastDuration} />
                    <Text2
                        variant="paragraph"
                        weight="regular"
                        color="textPrimary"
                    >
                        <FormattedFee
                            knownCurrencies={error.pollable.data.currencies}
                            fee={preset}
                        />
                    </Text2>
                </>
            }
            message={<NotEnoughBalanceLabel error={error} />}
        />
    ) : (
        <Skeleton />
    )
}
