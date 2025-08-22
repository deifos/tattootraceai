"use client"

import React, { Component, ReactNode } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Card, CardBody, CardHeader } from "@heroui/card"
import { Button } from "@heroui/button"

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardHeader className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              Something went wrong
            </CardHeader>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-red-600">
              An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="bg-red-100 p-3 rounded text-sm">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 text-xs overflow-auto">
                  {this.state.error.stack}
                </pre>
              </details>
            )}
            <Button onClick={this.handleReset} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </CardBody>
        </Card>
      )
    }

    return this.props.children
  }
}

// Convenience wrapper for common use cases
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
}