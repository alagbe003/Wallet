import { notReachable } from '../notReachable'

import { Context, ImportNode, parseImportDeclaration } from '../types/ESLint'
import { parsePath, traverseToFeature, traverseToInternal } from '../types/Node'

export const noFeatureDeepImport = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow direct imports of feature internals',
            category: 'Possible Errors',
        },
    },
    create(context: Context) {
        return {
            ImportDeclaration(node: ImportNode) {
                const declaration = parseImportDeclaration(node, context)

                switch (declaration.from.type) {
                    case 'unknown':
                    case 'absolute':
                    case 'alias-non-domains':
                    case 'relative':
                    case 'relative-domains':
                    case 'alias-local-uikit':
                    case 'relative-local-uikit':
                    case 'relative-local-toolkit':
                    case 'alias-local-toolkit':
                        return null

                    case 'alias-domains': {
                        const ast = parsePath(declaration.from.importPath)

                        if (!ast) {
                            return context.report(
                                node,
                                `Path [${declaration.from.import}] pretends to be domains, but I'm not able to understand it`
                            )
                        }

                        const feature = traverseToFeature(ast)

                        if (!feature) {
                            // Not a feature, we don't care
                            return null
                        }

                        const internal = traverseToInternal(feature)

                        if (!internal) {
                            // Import of index file which is OK
                            return null
                        }

                        return context.report(
                            node,
                            `Please do not deep import feature internals [/${internal.text}]`
                        )
                    }

                    default:
                        return notReachable(declaration.from.type)
                }
            },
        }
    },
}
