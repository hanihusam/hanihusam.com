import React from 'react'
import { NextPage } from 'next'

import { PageWrapper } from 'src/components/layout'
import { AboutMe, CallToAction, Hero } from 'src/components'

const IndexPage: NextPage = () => (
  <PageWrapper>
    <Hero />
    <AboutMe />
    <CallToAction />
  </PageWrapper>
)

export default IndexPage
