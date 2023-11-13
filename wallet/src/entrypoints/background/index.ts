chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        const url = chrome.runtime.getURL(
            'page_entrypoint.html?type=onboarding'
        )
        chrome.tabs.create({ url })
    }
})
