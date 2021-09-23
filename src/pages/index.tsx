import React from 'react'

import {
  HomepageAboutMe,
  HomepageCTA,
  HomepageHero,
  HomepageProject,
  HomepageServices
} from '../components/home'
import { PageWrapper } from '../components/layout'

import { NextPage } from 'next'

const IndexPage: NextPage = () => (
  <PageWrapper>
    <HomepageHero />
    <HomepageAboutMe />
    <HomepageProject />
    <HomepageServices />
    <HomepageCTA />
  </PageWrapper>
)

export default IndexPage
