import React from 'react'
import ReactDOM from 'react-dom'

interface PortalProps {
  key?: string | null
}

const supportsPortal = typeof ReactDOM.createPortal === 'function'

class Portal extends React.Component<PortalProps> {
  container: HTMLDivElement | undefined

  constructor(props: PortalProps) {
    super(props)

    if (typeof window !== 'undefined') {
      this.container = document.createElement('div')
      this.container.setAttribute('data-kcov19-portal', '')
    }
  }

  public componentDidMount() {
    if (this.container) {
      document.body.appendChild(this.container)
    }
  }

  public componentWillUnmount() {
    if (this.container) {
      document.body.removeChild(this.container)
    }
  }

  public render() {
    const { children, key } = this.props

    if (supportsPortal && this.container) {
      return ReactDOM.createPortal(children, this.container, key)
    }

    return null
  }
}

export default Portal
