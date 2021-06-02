import * as React from 'react'
import Head from 'next/head'
import { NextSeo } from 'next-seo'

import { SiteMetadata } from 'src/types/default'

import siteMetadata from 'src/_data/siteMetaData.json'
import { Navigation } from './Navigation'
import LayoutRoot from './LayoutRoot'
import Footer from './Footer'

interface PageWrapperProps {
  pageTitle?: string
}

declare global {
  interface Window {
    GA_INITIALIZED?: boolean
  }
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, pageTitle }) => {
  const { author }: SiteMetadata = siteMetadata

  return (
    <LayoutRoot>
      {pageTitle && <NextSeo title={pageTitle} openGraph={{ title: pageTitle }} />}
      <Head>
        <meta name="twitter:dnt" content="on" />
        {Object.keys(author.url).map(key => (
          <link key={key} rel="me" href={author.url[key]} />
        ))}
        <link rel="alternate" type="application/rss+xml" title="All posts by @hanihusam" href="/posts/rss.xml" />
        {process.env.NODE_ENV === 'production' && <meta name="monetization" content={process.env.NEXT_PUBLIC_ILP_URL} />}
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION} />
        )}
      </Head>
      <Navigation />
      {children}
      <Footer />
    </LayoutRoot>
  )
}

export default PageWrapper
