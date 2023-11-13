import { fetchAccounts } from '@zeal/domains/Account/api/fetchAccounts'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'
import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { Image, StyleSheet, Text, View } from 'react-native'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import React from 'react'
import { Avatar } from '@zeal/uikit/Avatar'
import { AccountAvatar1 } from '@zeal/uikit/Icon/AccountAvatar1'
import { SvgImage } from '@zeal/uikit/SvgImage'
import { Animation } from '@zeal/uikit/Animation'

export const App = () => {
    const [loadable] = useLoadableData(fetchAccounts, {
        type: 'loading',
        params: {
            address: '0x61640A8D48Bca205BA91b16B0B7745e7aBc61084',
            customCurrencies: {},
            networkMap: {},
            networkRPCMap: {},
            forceRefresh: false,
        },
    })

    switch (loadable.type) {
        case 'loading':
            return (
                <View style={styles.container}>
                    <Avatar size={32}>
                        <SvgImage
                            size={32}
                            src="https://cryptologos.cc/logos/ethereum-eth-logo.svg"
                        />
                    </Avatar>

                    <Text>Loading...</Text>
                </View>
            )
        case 'loaded':
            const { portfolio } = loadable.data
            const sum = sumPortfolio(portfolio, {})

            return (
                <View style={styles.container}>
                    <Animation
                        animation="success"
                        size={72}
                        loop={false}
                        onAnimationEvent={(event) => {
                            switch (event) {
                                case 'complete':
                                    console.log('complete')
                                    break
                                default:
                                    return notReachable(event)
                            }
                        }}
                    />

                    <Avatar size={32}>
                        <AccountAvatar1 size={32} />
                    </Avatar>

                    <Text>
                        <FormattedTokenBalanceInDefaultCurrency
                            money={sum}
                            knownCurrencies={portfolio.currencies}
                        />
                    </Text>
                </View>
            )
        case 'error':
            return (
                <View style={styles.container}>
                    <Text>Error!</Text>
                </View>
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
})
