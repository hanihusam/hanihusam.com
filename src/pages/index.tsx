import React from 'react'

import { HomepageAboutMe, HomepageCTA, HomepageHero, HomepageProject } from '../components/home'
import { PageWrapper } from '../components/layout'

import { NextPage } from 'next'

const IndexPage: NextPage = () => (
  <PageWrapper>
    <HomepageHero />
    <HomepageAboutMe />
    <HomepageProject />
    <HomepageCTA />
  </PageWrapper>
)

export default IndexPage
