;(() => {
    const isMac =
        navigator.userAgentData.platform.toUpperCase().indexOf('MAC') >= 0

    const element = document.querySelector(
        isMac ? '.mac_pro_tip' : '.pc_pro_tip'
    )

    setTimeout(() => {
        element.style.opacity = 1
    }, 800)
})()
