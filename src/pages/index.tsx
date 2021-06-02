import React from 'react'
import { NextPage } from 'next'

import { PageWrapper } from '~/components/layout'
import { AboutMe, CallToAction, Hero } from '../components'

const IndexPage: NextPage = () => (
  <PageWrapper>
    <Hero />
    <AboutMe />
    <CallToAction />
  </PageWrapper>
)

export default IndexPage
