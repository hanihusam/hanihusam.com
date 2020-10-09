import * as React from 'react'
import Head from 'next/head'

import { Navigation } from './Navigation'
import { LayoutRoot } from 'src/styles'
import Footer from './Footer'

interface PageWrapperProps {
  title?: string
  pageTitle?: string
  author?: string
  description?: string
}

declare global {
  interface Window {
    GA_INITIALIZED?: boolean
  }
}

const defaultTitle = 'Hani Husam'
const defaultAuthor = 'Hani Husamuddin'
const defaultDescription = "Hani Husamuddin's personal portfolio website."
const defaultKeywords = 'hanihusam, hani husamuddin, web developer, frontend developer, freelancer, indonesia'

const PageWrapper: React.FC<PageWrapperProps> = ({
  author = defaultAuthor,
  children,
  title = defaultTitle,
  description = defaultDescription
}) => {
  const noHTMLTagDescription = description.replace(/<\/?[^>]+(>|$)/g, ``)
  const metaAttributes = [
    {
      name: `description`,
      content: noHTMLTagDescription
    },
    {
      name: 'keywords',
      content: defaultKeywords
    },
    {
      property: `og:title`,
      content: title
    },
    {
      property: `og:description`,
      content: noHTMLTagDescription
    },
    {
      property: `og:image`,
      content: `/images/logo.png`
    },
    {
      property: `og:image:width`,
      content: `192`
    },
    {
      property: `og:image:height`,
      content: `192`
    },
    {
      property: `og:type`,
      content: `website`
    },
    {
      name: `twitter:card`,
      content: `summary`
    },
    {
      name: `twitter:creator`,
      content: author
    },
    {
      name: `twitter:title`,
      content: title
    },
    {
      name: `twitter:description`,
      content: noHTMLTagDescription
    }
  ]

  return (
    <LayoutRoot>
      <Head>
        <title>{title}</title>
        {metaAttributes.map(attributes => (
          <meta key={attributes.name || attributes.property} {...attributes} />
        ))}
      </Head>
      <Navigation />
      {children}
      <Footer />
    </LayoutRoot>
  )
}

export default PageWrapper
