import { notReachable } from '../notReachable'

import { Context, ImportNode, parseImportDeclaration } from '../types/ESLint'
import { Internal, parsePath, traverseToInternal } from '../types/Node'

const ALLOWED_REG_EXP_INTERNALS = [
    /^constants$/,
    /^components\/[a-zA-Z0-9]+$/,
    /^hooks\/[a-zA-Z0-9]+$/,
    /^helpers\/[a-zA-Z0-9]+$/,
    /^api\/[a-zA-Z0-9]+$/,
    /^parsers\/[a-zA-Z0-9]+$/,
    /^api\/fixtures\/[a-zA-Z0-9]+$/,
]

const allowedListString = ALLOWED_REG_EXP_INTERNALS.map(
    (item) => `"${item}"`
).join(', ')

const getDisallowedDomainInternalsMessage = (
    disallowedInternal: Internal
): string => {
    const standardText = `Domain internal "${disallowedInternal.text}" is not allowed.
Allowed internals: ${allowedListString}`

    if (disallowedInternal.text === 'features') {
        return `${standardText}

Probably you're tring to import all features from domain, which is not allowed.
If you need to use some features import them directly one by one ('app/domains/FooDomain/features/BarFeature').`
    }

    return standardText
}

export const noRestrictedInternals = {
    meta: {
        type: 'problem',
        docs: {
            description: 'disallow direct imports of domain internals',
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

                        const internal = traverseToInternal(ast)

                        if (!internal) {
                            // No internal is OK
                            return null
                        }

                        const matchedInternal = ALLOWED_REG_EXP_INTERNALS.find(
                            (regexp) => !!internal.text.match(regexp)
                        )

                        if (matchedInternal) {
                            // Matched internal is OK
                            return null
                        }

                        return context.report(
                            node,
                            getDisallowedDomainInternalsMessage(internal)
                        )
                    }

                    default:
                        return notReachable(declaration.from.type)
                }
            },
        }
    },
}
