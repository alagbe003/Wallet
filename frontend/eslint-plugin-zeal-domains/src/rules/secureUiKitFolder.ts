import { notReachable } from '../notReachable'

import { Context, ImportNode, parseImportDeclaration } from '../types/ESLint'

export const secureUiKitFolder = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow wrong imports in ui-kit folder',
            category: 'Possible Errors',
        },
    },
    create(context: Context) {
        return {
            ImportDeclaration(node: ImportNode) {
                const declaration = parseImportDeclaration(node, context)

                switch (declaration.current.type) {
                    case 'unknown':
                    case 'local_toolkit':
                    case 'domain':
                        // We don't care how legacy code is importing another legacy code
                        // We don't care about domains stuff, it's taken care by separate rule
                        // We don't care about tool-kit stuff, it's taken care by separate rule
                        return null

                    case 'local_uikit':
                        switch (declaration.from.type) {
                            case 'unknown':
                            case 'alias-local-uikit':
                            case 'alias-local-toolkit':
                            case 'relative-local-uikit':
                                // Unknown imports, and imports within uikit are OK
                                return null

                            case 'relative-local-toolkit':
                                return context.report(
                                    node,
                                    `Please use alias import to get toolkit stuff [${declaration.from.importPath}]`
                                )

                            case 'relative-domains':
                            case 'alias-domains':
                                return context.report(
                                    node,
                                    `Please do not import domains in uikit [${declaration.from.importPath}]`
                                )

                            case 'absolute':
                            case 'relative':
                            case 'alias-non-domains':
                                // We do not allow to import some stuff outside of uikit
                                return context.report(
                                    node,
                                    `Please do not import legacy code [${declaration.from.importPath}]`
                                )

                            default:
                                return notReachable(declaration.from.type)
                        }

                    default:
                        return notReachable(declaration.current)
                }
            },
        }
    },
}
