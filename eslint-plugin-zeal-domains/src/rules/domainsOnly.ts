import { notReachable } from '../notReachable'

import { Context, ImportNode, parseImportDeclaration } from '../types/ESLint'

export const domainsOnly = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow import of legacy stuff into domains',
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
                    case 'local_toolkit':
                        // We don't care how legacy code is importing another legacy code
                        // We don't care how ui-kit stuff, it's taken care by separate rule
                        // We don't care how tool-kit stuff, it's taken care by separate rule
                        return null

                    case 'domain':
                        switch (declaration.from.type) {
                            case 'alias-domains':
                            case 'alias-local-toolkit':
                            case 'alias-local-uikit':
                            case 'relative-domains':
                            case 'unknown':
                                // Unknown imports, alias/relative import within domains are OK
                                return null

                            case 'relative-local-toolkit':
                            case 'relative-local-uikit':
                                return context.report(
                                    node,
                                    `Please import uikit/toolkit stuff using alias import [${declaration.from.importPath}]`
                                )

                            case 'absolute':
                            case 'relative':
                                // We do not allow to import some stuff outside of domains from domain code
                                return context.report(
                                    node,
                                    `Please do not import legacy code [${declaration.from.importPath}]`
                                )

                            case 'alias-non-domains': {
                                // Check for exceptions, if not an exceptions - we just don't allow such import
                                return context.options.find((reg) =>
                                    declaration.from.importPath.match(reg)
                                )
                                    ? null
                                    : context.report(
                                          node,
                                          `Please do not import legacy code [${declaration.from.importPath}]`
                                      )
                            }

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
