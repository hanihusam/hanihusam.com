import * as React from 'react'

import emotionCache from '../utils/emotionCache'

import createEmotionServer from '@emotion/server/create-instance'
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'

interface ExtendedDocumentProps {
  ids: string[]
  css: string
}

const { extractCritical } = createEmotionServer(emotionCache)

export default class MyDocument extends Document<ExtendedDocumentProps> {
  static async getInitialProps(ctx: DocumentContext) {
    const { html, ...renderPageResult } = await ctx.renderPage()
    const { ids, css, ...props } = extractCritical(html)

    const initialProps = await Document.getInitialProps(ctx)

    return {
      ...initialProps,
      ...renderPageResult,
      ...props,
      styles: (
        <>
          {initialProps.styles}
          <style dangerouslySetInnerHTML={{ __html: css }} data-emotion-css={ids.join(' ')} />
        </>
      )
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="UTF-8" />

          <meta content="ie=edge" httpEquiv="X-UA-Compatible" />
          <link href="/favicon.ico" rel="shortcut icon" type="image/x-icon" />

          <meta content="yes" name="apple-mobile-web-app-capable" />
          <meta content="black-translucent" name="apple-mobile-web-app-status-bar-style" />
          <meta content="#333333" name="theme-color" />
          <meta content="#333333" name="msapplication-TileColor" />

          <link href="/manifest.json" rel="manifest" />

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
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
