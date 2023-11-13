import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { IconButton } from '@zeal/uikit/IconButton'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { CloseCross } from '@zeal/uikit/Icon/CloseCross'
import { Skeleton as UISkeleton } from '@zeal/uikit/Skeleton'
import { Screen } from '@zeal/uikit/Screen'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { FeeInputButton } from '@zeal/uikit/FeeInputButton'
import { noop } from '@zeal/toolkit'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'

type Props = {
    onClose: () => void
    account: Account
    keystoreMap: KeyStoreMap
}

export const Skeleton = ({ onClose, account, keystoreMap }: Props) => {
    return (
        <Screen background="light" padding="form">
            <ActionBar
                account={account}
                keystore={getKeyStore({
                    keyStoreMap: keystoreMap,
                    address: account.address,
                })}
                network={null}
                right={
                    <IconButton onClick={onClose}>
                        <CloseCross size={24} />
                    </IconButton>
                }
            />

            <Column spacing={16}>
                <Group variant="default">
                    <Column spacing={16}>
                        <Column spacing={24}>
                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />

                            <Row spacing={4} alignX="stretch">
                                <UISkeleton
                                    variant="default"
                                    width={75}
                                    height={32}
                                />

                                <UISkeleton
                                    variant="default"
                                    width={35}
                                    height={15}
                                />
                            </Row>
                        </Column>
                        <Row spacing={4} alignX="stretch">
                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />

                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />
                        </Row>
                    </Column>
                </Group>

                <Group variant="default">
                    <Column spacing={16}>
                        <Column spacing={24}>
                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />

                            <Row spacing={4} alignX="stretch">
                                <UISkeleton
                                    variant="default"
                                    width={75}
                                    height={32}
                                />

                                <UISkeleton
                                    variant="default"
                                    width={35}
                                    height={15}
                                />
                            </Row>
                        </Column>
                        <Row spacing={4} alignX="stretch">
                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />

                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />
                        </Row>
                    </Column>
                </Group>
            </Column>

            <Spacer />

            <Column spacing={8}>
                <FeeInputButton
                    left={
                        <UISkeleton variant="default" width={35} height={16} />
                    }
                    right={
                        <UISkeleton variant="default" width={55} height={16} />
                    }
                    onClick={noop}
                />

                <UISkeleton variant="default" width="100%" height={42} />
            </Column>
        </Screen>
    )
}
