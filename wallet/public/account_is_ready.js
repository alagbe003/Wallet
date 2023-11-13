const fetchIsPinned = () =>
    window.chrome.action
        .getUserSettings()
        .then((settings) => settings.isOnToolbar)

const html = window.document.querySelector('html') || null
const zealLogo = window.document.querySelector('.zeal') || null
const arrow = window.document.querySelector('.arrow') || null
const pinHere = window.document.querySelector('.pin-here') || null
const pinMainCard = window.document.querySelector('.pin-main-card') || null
const walletReady = window.document.querySelector('.wallet-ready') || null
const exploreReal = window.document.querySelector('.explore-zeal') || null

zealLogo.classList.remove('hidden')
arrow.classList.remove('hidden')

const pinScreen = () => {
    html.classList.add('layout')
    html.classList.remove('layout_teal')

    pinHere.classList.remove('hidden')
    pinMainCard.classList.remove('hidden')

    walletReady.classList.add('hidden')
    exploreReal.classList.add('hidden')
}

const walletReadyScreen = () => {
    html.classList.add('layout_teal')
    html.classList.remove('layout')

    pinHere.classList.add('hidden')
    pinMainCard.classList.add('hidden')

    walletReady.classList.remove('hidden')
    exploreReal.classList.remove('hidden')

    try {
        window.confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.4 },
        })
    } catch (error) {}
}

;(async () => {
    const RETRY_TIME_MS = 200

    const timeoutFunction = async () => {
        let result = null
        try {
            result = await fetchIsPinned()
        } catch {}

        if (!result) {
            setTimeout(timeoutFunction, RETRY_TIME_MS)
        } else {
            walletReadyScreen()
        }
    }

    let initiallyPinned = true

    try {
        initiallyPinned = await fetchIsPinned()
    } catch (error) {}

    if (initiallyPinned) {
        walletReadyScreen()
    } else {
        pinScreen()
        setTimeout(timeoutFunction, RETRY_TIME_MS)
    }
})()
