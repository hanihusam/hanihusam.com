import React from 'react'

import { HomepageAboutMe, HomepageCTA, HomepageHero } from '../components/home'
import { PageWrapper } from '../components/layout'

import { NextPage } from 'next'

const IndexPage: NextPage = () => (
  <PageWrapper>
    <HomepageHero />
    <HomepageAboutMe />
    <HomepageCTA />
  </PageWrapper>
)

export default IndexPage
