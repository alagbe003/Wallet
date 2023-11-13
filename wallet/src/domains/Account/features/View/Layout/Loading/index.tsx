import { Account } from '@zeal/domains/Account'
import { CurrentNetwork } from '@zeal/domains/Network'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Group, Section } from '@zeal/uikit/Group'
import { WidgetSkeleton } from 'src/domains/Account/components/Widget'
import { KeyStore } from '@zeal/domains/KeyStore'
import { HeaderBox, Screen, ContentBox } from '@zeal/uikit/Screen'
import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { getLayoutBackground } from '@zeal/domains/Network/helpers/getLayoutBackground'
import { MsgOf } from '@zeal/toolkit/MsgOf'

type Props = {
    account: Account
    currentNetwork: CurrentNetwork
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof WidgetSkeleton>

export const Loading = ({
    account,
    currentNetwork,
    keystore,
    onMsg,
}: Props) => {
    return (
        <Screen padding="main" background={getLayoutBackground(currentNetwork)}>
            <HeaderBox>
                <WidgetSkeleton
                    keystore={keystore}
                    currentNetwork={currentNetwork}
                    currentAccount={account}
                    onMsg={onMsg}
                />
            </HeaderBox>
            <ContentBox>
                <Column spacing={16}>
                    {new Array(3).fill(1).map((_, index) => (
                        <Section key={`s-${index}`}>
                            <Row spacing={0}>
                                <Skeleton
                                    variant="default"
                                    width={75}
                                    height={18}
                                />
                                <Spacer />
                                <Skeleton
                                    variant="default"
                                    width={35}
                                    height={18}
                                />
                            </Row>

                            <Group variant="default">
                                <Column spacing={24}>
                                    {new Array(3).fill(1).map((_, index) => (
                                        <Skeleton
                                            key={`sk-${index}`}
                                            variant="default"
                                            width="100%"
                                            height={12}
                                        />
                                    ))}
                                </Column>
                            </Group>
                        </Section>
                    ))}
                </Column>
            </ContentBox>
        </Screen>
    )
}
