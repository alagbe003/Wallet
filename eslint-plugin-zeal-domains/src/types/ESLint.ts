import * as path from 'path'

export type ImportNode = { source: { value: string } }

export type Context<T = unknown> = {
    report: (node: ImportNode, message: string) => void
    getCwd: () => string
    getFilename: () => string
    options: T
}

export type ImportDeclaration = {
    from: {
        type:
            | 'absolute'
            | 'alias-domains'
            | 'alias-local-toolkit'
            | 'alias-local-uikit'
            | 'alias-non-domains'
            | 'relative'
            | 'relative-domains'
            | 'relative-local-toolkit'
            | 'relative-local-uikit'
            | 'unknown'
        import: string
        importPath: string
    }

    current:
        | { type: 'unknown'; path: string }
        | { type: 'domain'; path: string }
        | { type: 'local_uikit'; path: string }
        | { type: 'local_toolkit'; path: string }
}

export const parseImportDeclaration = (
    node: ImportNode,
    context: Context<unknown>
): ImportDeclaration => ({
    from: parseFrom(node, context),
    current: parseCurrent(context),
})

const DOMAINS_ALIAS = 'src/domains'
const DOMAINS_ALIAS_REGEXP = /^src\/domains/
const DOMAINS_PATH = '/src/domains'
const DOMAINS_PATH_REGEXP = /^\/src\/domains/
const UIKIT_ALIAS = 'src/uikit'
const UIKIT_ALIAS_REGEXP = /^src\/uikit/
const UIKIT_PATH = '/src/uikit'
const UIKIT_PATH_REGEXP = /^\/src\/uikit/
const TOOLKIT_ALIAS = 'src/toolkit'
const TOOLKIT_ALIAS_REGEXP = /^src\/toolkit/
const TOOLKIT_PATH = '/src/toolkit'
const TOOLKIT_PATH_REGEXP = /^\/src\/toolkit/

const parseCurrent = (
    context: Context<unknown>
): ImportDeclaration['current'] => {
    const cwd = context.getCwd()
    const currentPath = context.getFilename()

    const sanitizedPath = currentPath.replace(cwd, '')

    if (sanitizedPath.match(DOMAINS_PATH_REGEXP)) {
        return {
            type: 'domain',
            path: sanitizedPath,
        }
    }

    if (sanitizedPath.match(UIKIT_PATH_REGEXP)) {
        return {
            type: 'local_uikit',
            path: sanitizedPath,
        }
    }

    if (sanitizedPath.match(TOOLKIT_PATH_REGEXP)) {
        return {
            type: 'local_toolkit',
            path: sanitizedPath,
        }
    }

    return { type: 'unknown', path: sanitizedPath }
}

const parseFrom = (
    node: ImportNode,
    context: Context<unknown>
): ImportDeclaration['from'] => {
    const importSource = node.source.value
    const cwd = context.getCwd()
    const currentPath = context.getFilename()

    const sanitizedPath = path
        .join(path.dirname(currentPath), importSource)
        .replace(cwd, '')

    if (path.isAbsolute(importSource)) {
        return {
            type: 'absolute',
            import: importSource,
            importPath: sanitizedPath,
        }
    }

    if (importSource.match(/^\./)) {
        if (sanitizedPath.match(DOMAINS_PATH_REGEXP)) {
            return {
                type: 'relative-domains',
                import: importSource,
                importPath: sanitizedPath,
            }
        }

        if (sanitizedPath.match(UIKIT_PATH_REGEXP)) {
            return {
                type: 'relative-local-uikit',
                import: importSource,
                importPath: sanitizedPath,
            }
        }

        if (sanitizedPath.match(TOOLKIT_PATH_REGEXP)) {
            return {
                type: 'relative-local-toolkit',
                import: importSource,
                importPath: sanitizedPath,
            }
        }

        return {
            type: 'relative',
            import: importSource,
            importPath: sanitizedPath,
        }
    }

    if (importSource.match(DOMAINS_ALIAS_REGEXP)) {
        return {
            type: 'alias-domains',
            import: importSource,
            importPath: importSource.replace(DOMAINS_ALIAS, DOMAINS_PATH),
        }
    }

    if (importSource.match(UIKIT_ALIAS_REGEXP)) {
        return {
            type: 'alias-local-uikit',
            import: importSource,
            importPath: importSource.replace(UIKIT_ALIAS, UIKIT_PATH),
        }
    }

    if (importSource.match(TOOLKIT_ALIAS_REGEXP)) {
        return {
            type: 'alias-local-toolkit',
            import: importSource,
            importPath: importSource.replace(TOOLKIT_ALIAS, TOOLKIT_PATH),
        }
    }

    if (importSource.match(/app\//g)) {
        return {
            type: 'alias-non-domains',
            import: importSource,
            importPath: importSource,
        }
    }

    return { type: 'unknown', import: importSource, importPath: sanitizedPath }
}
