export const safetyChecksPassed: unknown = {
    dAppInfo: {
        hostname: 'app.example.com',
        avatar: 'https://app.uniswap.org/images/192x192_App_Icon.png',
        title: 'Example app',
    },
    checks: [
        {
            type: 'BlacklistCheck',
            severity: 'Danger',
            state: 'Passed',
        },
        {
            type: 'SuspiciousCharactersCheck',
            severity: 'Danger',
            state: 'Passed',
        },
    ],
}
