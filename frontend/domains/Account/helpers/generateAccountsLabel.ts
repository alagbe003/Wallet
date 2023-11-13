import { Account } from '@zeal/domains/Account'
import { generateUniqueLabels } from '@zeal/toolkit/String/generateUniqueLabels'

export const generateAccountsLabels = (
    existingAccounts: Account[],
    prefix: string,
    count: number
): string[] => {
    const existingLabels = existingAccounts.map((account) => account.label)
    return generateUniqueLabels(existingLabels, prefix, count)
}
