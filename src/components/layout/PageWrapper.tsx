import * as React from 'react'

import Footer from './Footer'
import LayoutRoot from './LayoutRoot'
import { Navigation } from './Navigation'

import Head from 'next/head'
import { NextSeo } from 'next-seo'
import siteMetadata from 'src/_data/siteMetaData.json'
import { SiteMetadata } from 'src/types/default'

interface PageWrapperProps {
  pageTitle?: string
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, pageTitle }) => {
  const { author }: SiteMetadata = siteMetadata

  return (
    <LayoutRoot>
      {pageTitle && <NextSeo openGraph={{ title: pageTitle }} title={pageTitle} />}
      <Head>
        <meta content="on" name="twitter:dnt" />
        {Object.keys(author.url).map(key => (
          <link key={key} href={author.url[key]} rel="me" />
        ))}
        <link
          href="/posts/rss.xml"
          rel="alternate"
          title="All posts by @hanihusam"
          type="application/rss+xml"
        />
        {/* {process.env.NODE_ENV === 'production' && (
          <meta content={process.env.NEXT_PUBLIC_ILP_URL} name="monetization" />
        )}
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
            name="google-site-verification"
          />
        )} */}
      </Head>
      <Navigation />
      {children}
      <Footer />
    </LayoutRoot>
  )
}

export default PageWrapper
