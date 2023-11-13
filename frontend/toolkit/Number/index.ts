export const generateRandomNumber = (): number => {
    const array = new Uint32Array(1)
    // : check if this works on the web
    crypto.getRandomValues(array)
    return array[0]
}
