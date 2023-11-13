import '../../polyfill'

import * as Sentry from '@sentry/react'
import { BrowserTracing } from '@sentry/tracing'
import ReactDOM from 'react-dom/client'

import { getManifest } from 'src/domains/Manifest/helpers/getManifest'
import { getEnvironment } from '@zeal/toolkit/Environment/getEnvironment'
import { isLocal } from '@zeal/toolkit/Environment/isLocal'
import { RootComponent } from './RootComponent'

const manifest = getManifest()

if (!isLocal()) {
    Sentry.init({
        dsn: 'https://078a7d9162734227bf31d89617887291@o1301891.ingest.sentry.io/6776280',
        release: manifest.version,
        environment: getEnvironment(),

        integrations: [new BrowserTracing()],

        tracesSampleRate: 0.5, // Should be set to loer value after public release
    })
}
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(<RootComponent manifest={manifest} />)
