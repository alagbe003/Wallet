import { notReachable } from '../notReachable'

import { Context, ImportNode, parseImportDeclaration } from '../types/ESLint'

export const secureToolKitFolder = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow wrong imports in tool-kit folder',
            category: 'Possible Errors',
        },
    },
    create(context: Context<RegExp[]>) {
        return {
            ImportDeclaration(node: ImportNode) {
                const declaration = parseImportDeclaration(node, context)

                switch (declaration.current.type) {
                    case 'unknown':
                    case 'local_uikit':
                    case 'domain':
                        // We don't care how legacy code is importing another legacy code
                        // We don't care about domains stuff, it's taken care by separate rule
                        // We don't care about ui-kit stuff, it's taken care by separate rule
                        return null

                    case 'local_toolkit':
                        switch (declaration.from.type) {
                            case 'unknown':
                            case 'alias-local-toolkit':
                            case 'relative-local-toolkit':
                                // Unknown imports, and imports within toolkit are OK
                                return null

                            case 'alias-local-uikit':
                            case 'relative-local-uikit':
                                return context.report(
                                    node,
                                    `We're not expecting toolkit stuff to import UIKit. Rise a case if required [${declaration.from.importPath}]`
                                )

                            case 'relative-domains':
                            case 'alias-domains':
                                return context.report(
                                    node,
                                    `Please do not import domains in toolkit [${declaration.from.importPath}]`
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
