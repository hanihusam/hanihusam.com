import React from 'react'

import { AboutMe, CallToAction, Hero } from '../components'
import { PageWrapper } from '../components/layout'

import { NextPage } from 'next'

const IndexPage: NextPage = () => (
  <PageWrapper>
    <Hero />
    <AboutMe />
    <CallToAction />
  </PageWrapper>
)

export default IndexPage
