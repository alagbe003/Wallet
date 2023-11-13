export const findRootWindow = (current: Window): Window => {
    if (current.parent === current) {
        return current
    }

    return findRootWindow(current.parent)
}
