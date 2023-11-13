import { notReachable } from '../notReachable'

import { Context, ImportNode, parseImportDeclaration } from '../types/ESLint'
import { parsePath, traverse } from '../types/Node'

export const noInvalidRelativeImports = {
    meta: {
        type: 'problem',
        docs: {
            description:
                'disallow relative imports out of current feature or domain',
            category: 'Possible Errors',
        },
    },
    create(context: Context) {
        return {
            ImportDeclaration(node: ImportNode) {
                const declaration = parseImportDeclaration(node, context)

                switch (declaration.current.type) {
                    case 'domain':
                        // domain->domain
                        switch (declaration.from.type) {
                            case 'unknown':
                            case 'absolute':
                            case 'alias-domains':
                            case 'alias-non-domains':
                            case 'relative':
                            case 'relative-local-uikit':
                            case 'alias-local-uikit':
                            case 'relative-local-toolkit':
                            case 'alias-local-toolkit':
                                return null

                            case 'relative-domains':
                                const astCurrent = parsePath(
                                    declaration.current.path
                                )
                                const astFrom = parsePath(
                                    declaration.from.importPath
                                )

                                if (!astCurrent || !astFrom) {
                                    // Not a valid path, but we don't care
                                    return null
                                }

                                const trCurrent = traverse(astCurrent, []).join(
                                    ','
                                )
                                const trFrom = traverse(astFrom, []).join(',')

                                if (trFrom === trCurrent) {
                                    // If we're in same area we're good
                                    return null
                                }

                                return context.report(
                                    node,
                                    `Please import other domains or features using alias import (you're trying to import relatively [${trFrom}] in [${trCurrent}])`
                                )

                            default:
                                return notReachable(declaration.from.type)
                        }

                    case 'unknown':
                        switch (declaration.from.type) {
                            case 'unknown':
                            case 'absolute':
                            case 'alias-domains':
                            case 'alias-non-domains':
                            case 'relative':
                            case 'relative-local-uikit':
                            case 'alias-local-uikit':
                            case 'relative-local-toolkit':
                            case 'alias-local-toolkit':
                                return null

                            case 'relative-domains':
                                return context.report(
                                    node,
                                    `Please import domains or features from non-domain code using alias imports`
                                )

                            default:
                                return notReachable(declaration.from.type)
                        }
                }
            },
        }
    },
}
