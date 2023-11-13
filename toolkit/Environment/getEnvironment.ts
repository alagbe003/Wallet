export const getEnvironment = (): 'local' | 'production' | 'development' => {
    const env = process.env.ZEAL_ENV || process.env.REACT_APP_ZEAL_ENV

    if (env === 'local') {
        return 'local'
    }

    if (env === 'development') {
        return 'development'
    }

    return 'production'
}
