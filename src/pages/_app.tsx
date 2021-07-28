import 'modern-normalize'
import '../styles/fonts'

import * as React from 'react'

import { ThemeWrapper } from '../components/layout'
import emotionCache from '../utils/emotionCache'

import { CacheProvider } from '@emotion/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { DefaultSeo } from 'next-seo'
import siteMetadata from 'src/_data/siteMetaData.json'

export default function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <link href="/icons/apple-touch-icon.png" rel="apple-touch-icon" sizes="180x180" />
        <link href="/icons/favicon-32x32.png" rel="icon" sizes="32x32" type="image/png" />
        <link href="/icons/favicon-16x16.png" rel="icon" sizes="16x16" type="image/png" />
        <link href="/favicon.ico" rel="shortcut icon" />
        <link href="/manifest.json" rel="manifest" />
      </Head>

      <DefaultSeo
        canonical={siteMetadata.siteUrl + (router.asPath || '')}
        description={siteMetadata.description}
        title="Home"
        titleTemplate={`%s · ${siteMetadata.title}`}
      />

      <ThemeWrapper>
        <Component {...pageProps} />
      </ThemeWrapper>
    </CacheProvider>
  )
}
