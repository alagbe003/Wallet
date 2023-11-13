import React from 'react'
import { Button } from 'src/uikit'
import { Header } from 'src/uikit/Header'
import { Layout2 } from 'src/uikit/Layout/Layout2'
import { Spacer2 } from 'src/uikit/Spacer2'

import { captureAppError } from '@zeal/domains/Error/helpers/captureAppError'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'

type Props = {
    children: React.ReactNode
}

type State = {
    hasError: boolean
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
        captureAppError(parseAppError(error), {
            source: 'error_boundary',
            extra: { ...errorInfo },
        })
    }

    onRetry() {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <Layout2 background="default" padding="form">
                    <Header title="Something went wrong" />

                    <Spacer2 />

                    <Button
                        size="regular"
                        variant="primary"
                        onClick={this.onRetry}
                    >
                        Reload extension
                    </Button>
                </Layout2>
            )
        }

        return this.props.children
    }
}
