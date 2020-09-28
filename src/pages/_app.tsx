import * as React from 'react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import styled from 'styled-components'

import 'modern-normalize'
import { Theme } from 'src/styles'
import { Navigation } from '~/components/layout/Navigation'

const LayoutRoot = styled.main`
  display: flex;
  flex-direction: column;
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  padding-top: 80px;
`

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Hani Husam</title>
      </Head>
      <Theme>
        <Navigation />
        <LayoutRoot>
          <Component {...pageProps} />
        </LayoutRoot>
      </Theme>
    </>
  )
}
