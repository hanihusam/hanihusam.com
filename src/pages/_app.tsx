import * as React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'

import { Theme } from 'src/styles'
import siteMetadata from 'src/_data/siteMetaData.json'

import 'modern-normalize'

export default function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>

      <DefaultSeo
        title="Home"
        titleTemplate={`%s · ${siteMetadata.title}`}
        description={siteMetadata.description}
        canonical={siteMetadata.siteUrl + (router.asPath || '')}
      />

      <Theme>
        <Component {...pageProps} />
      </Theme>
    </>
  )
}
