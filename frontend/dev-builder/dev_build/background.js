chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        let url = chrome.runtime.getURL('page_entrypoint.html?type=onboarding')
        chrome.tabs.create({ url })
    }
})
