import { domainsOnly } from './rules/domainsOnly'
import { noFeatureDeepImport } from './rules/noFeatureDeepImport'
import { noInvalidRelativeImports } from './rules/noInvalidRelativeImports'
import { noRestrictedInternals } from './rules/noRestrictedInternals'
import { secureToolKitFolder } from './rules/secureToolKitFolder'
import { secureUiKitFolder } from './rules/secureUiKitFolder'

module.exports = {
    rules: {
        'domains-only': domainsOnly,
        'no-feature-deep-import': noFeatureDeepImport,
        'no-invalid-relative-imports': noInvalidRelativeImports,
        'no-restricted-internals': noRestrictedInternals,
        'secure-toolkit-folder': secureToolKitFolder,
        'secure-uikit-folder': secureUiKitFolder,
    },
}
