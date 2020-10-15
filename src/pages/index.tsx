import React from 'react'
import { NextPage } from 'next'

import { PageWrapper } from 'src/components/layout'
import { CallToAction, Hero } from 'src/components'

const IndexPage: NextPage = () => (
  <PageWrapper>
    <Hero />
    <CallToAction />
  </PageWrapper>
)

export default IndexPage
