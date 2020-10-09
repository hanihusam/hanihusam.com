import * as React from 'react'

import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

interface IProps {
  styleTags: Array<React.ReactElement<{}>>
}

export default class MyDocument extends Document<IProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />

          <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />

          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="theme-color" content="#333333" />
          <meta name="msapplication-TileColor" content="#333333" />

          <link rel="manifest" href="/manifest.json" />

          <meta content="/icons/ms-icon-70x70.png" name="msapplication-square70x70" />
          <meta content="/icons/ms-icon-144x144.png" name="msapplication-square144x144" />
          <meta content="/icons/ms-icon-150x150.png" name="msapplication-square150x150" />
          <meta content="/icons/ms-icon-310x150.png" name="msapplication-wide310x150" />
          <meta content="/icons/ms-icon-310x310.png" name="msapplication-square310x310" />
          <link href="/icons/apple-icon-57x57.png" rel="apple-touch-icon" sizes="57x57" />
          <link href="/icons/apple-icon-60x60.png" rel="apple-touch-icon" sizes="60x60" />
          <link href="/icons/apple-icon-72x72.png" rel="apple-touch-icon" sizes="72x72" />
          <link href="/icons/apple-icon-76x76.png" rel="apple-touch-icon" sizes="76x76" />
          <link href="/icons/apple-icon-114x114.png" rel="apple-touch-icon" sizes="114x114" />
          <link href="/icons/apple-icon-120x120.png" rel="apple-touch-icon" sizes="120x120" />
          <link href="/icons/apple-icon-144x144.png" rel="apple-touch-icon" sizes="144x144" />
          <link href="/icons/apple-icon-152x152.png" rel="apple-touch-icon" sizes="152x152" />
          <link href="/icons/apple-icon-167x167.png" rel="apple-touch-icon" sizes="167x167" />
          <link href="/icons/apple-icon-180x180.png" rel="icon" sizes="180x180" type="image/png" />
          <link href="/icons/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
          <link href="/icons/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />

          <link
            href="https://fonts.googleapis.com/css2?family=Jost:wght@700&family=Ubuntu:wght@300;400;700&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
