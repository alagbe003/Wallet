import { BridgeSubmitted } from '@zeal/domains/Currency/domains/Bridge'

export const openExplorerLink = (bridgeSubmitted: BridgeSubmitted) =>
    window.open(
        `https://socketscan.io/tx/${bridgeSubmitted.sourceTransactionHash}`
    )
