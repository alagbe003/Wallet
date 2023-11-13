import { Account } from '@zeal/domains/Account'
import { ActionBar } from 'src/domains/Account/components/ActionBar'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { IconButton } from 'src/uikit'
import { Column2 } from 'src/uikit/Column2'
import { Group } from 'src/uikit/Group'
import { CloseCross } from 'src/uikit/Icon/Actions/CloseCross'
import { Skeleton as UISkeleton } from 'src/uikit/Skeleton'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Row } from '@zeal/uikit/Row'
import { Spacer2 } from 'src/uikit/Spacer2'
import { FeeInputButton } from 'src/uikit/Button/FeeInputButton'
import { noop } from '@zeal/toolkit'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'

type Props = {
    onClose: () => void
    account: Account
    keystoreMap: KeyStoreMap
}

export const Skeleton = ({ onClose, account, keystoreMap }: Props) => {
    return (
        <Layout2 background="light" padding="form">
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

            <Column2 spacing={16}>
                <Group variant="default">
                    <Column2 spacing={16}>
                        <Column2 spacing={24}>
                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />

                            <Row spacing={4}>
                                <UISkeleton
                                    variant="default"
                                    width={75}
                                    height={32}
                                />
                                <Spacer2 />
                                <UISkeleton
                                    variant="default"
                                    width={35}
                                    height={15}
                                />
                            </Row>
                        </Column2>
                        <Row spacing={4}>
                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />
                            <Spacer2 />
                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />
                        </Row>
                    </Column2>
                </Group>

                <Group variant="default">
                    <Column2 spacing={16}>
                        <Column2 spacing={24}>
                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />

                            <Row spacing={4}>
                                <UISkeleton
                                    variant="default"
                                    width={75}
                                    height={32}
                                />
                                <Spacer2 />
                                <UISkeleton
                                    variant="default"
                                    width={35}
                                    height={15}
                                />
                            </Row>
                        </Column2>
                        <Row spacing={4}>
                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />
                            <Spacer2 />
                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />
                        </Row>
                    </Column2>
                </Group>
            </Column2>

            <Spacer2 />

            <Column2 spacing={8}>
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
            </Column2>
        </Layout2>
    )
}
