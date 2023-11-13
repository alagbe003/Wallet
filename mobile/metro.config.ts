const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const monorepoPackages = {
    '@zeal/api': path.resolve(workspaceRoot, 'frontend/api'),
    '@zeal/domains': path.resolve(workspaceRoot, 'frontend/domains'),
    '@zeal/toolkit': path.resolve(workspaceRoot, 'frontend/toolkit'),
    '@zeal/uikit': path.resolve(workspaceRoot, 'frontend/uikit'),
}

const config = getDefaultConfig(projectRoot)

config.resolver.extraNodeModules = monorepoPackages

config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
]
config.resolver.disableHierarchicalLookup = true

module.exports = config
