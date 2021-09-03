import React from 'react'

import Column from '../layout/Column'
import { Box, Heading, Paragraph, Text, themeProps, AnchorButton, UnstyledAnchor } from '../ui'

import styled from '@emotion/styled'
import Link from 'next/link'
import { FiArrowRight } from 'react-icons/fi'

const Section = Box.withComponent('section')

const ProjectArea = styled(Section)`
  padding: 0px ${themeProps.space.md}px 84px;

  ${themeProps.mediaQueries.md} {
    padding: ${themeProps.space.xxxl}px ${themeProps.space.lg}px;
    margin: 54px 0;
  }
`

const ProjectList = styled(Box)`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-top: ${themeProps.space.xl}px;
  margin-bottom: ${themeProps.space.xl}px;

  ${themeProps.mediaQueries.md} {
    flex-direction: row;
    margin: ${themeProps.space.xxl}px -${themeProps.space.sm}px 0;
  }
`
const Anchor = styled(AnchorButton)`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0;
  height: 0;
  max-width: fit-content;
  color: ${themeProps.colors.secondary};

  & > svg {
    margin: ${themeProps.space.xs}px;
  }
`

const CardBody = styled(Box)`
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: ${themeProps.space.md}px;
  overflow-y: hidden;
  border-radius: 0 0 4px 4px;

  & > ${Paragraph} {
    max-height: 0;
    transition: max-height 0.5s;
  }

  ${themeProps.mediaQueries.md} {
    margin: 0 ${themeProps.space.sm}px;
  }
`

const Card = styled(UnstyledAnchor)`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  margin-bottom: ${themeProps.space.md}px;
  transition: all 0.5s;

  & > img {
    position: relative;
    max-width: 100%;
    height: auto;
    margin-bottom: ${themeProps.space.xxl}px;
    border-radius: 4px 4px 0 0;
  }

  &:hover ${Paragraph} {
    max-height: 300px;
  }

  &:after {
    background-color: #fff;
    display: inline-block;
    content: '';
    height: 16px;
    width: 100%;
    z-index: 1;
    border-radius: 0 0 4px 4px;
  }

  ${themeProps.mediaQueries.md} {
    width: calc(100% / 3);
    padding: 0 ${themeProps.space.sm}px;
    margin-bottom: ${themeProps.space.xxl}px;
  }
`

const Projects: React.FC = () => (
  <ProjectArea>
    <Column>
      <Box display="flex" flexDirection="column">
        <Box display="flex" flexDirection="column">
          <Paragraph color="secondary" paddingBottom={themeProps.space.md}>
            Projects
          </Paragraph>
          <Heading color="primary" paddingBottom={themeProps.space.md}>
            Latest works
          </Heading>
        </Box>
        <ProjectList>
          <Link href="/" passHref>
            <Card>
              <img
                alt="Project Cover"
                src="https://cdn.pixabay.com/photo/2015/05/28/14/53/ux-788002_1280.jpg"
              />
              <CardBody>
                <Text
                  color={themeProps.colors.secondary}
                  paddingBottom={themeProps.space.xs}
                  variant={300}
                >
                  UI Designer
                </Text>
                <Heading
                  color={themeProps.colors.primary}
                  paddingBottom={themeProps.space.xs}
                  variant={500}
                >
                  Currinda V2 Platform
                </Heading>
                <Paragraph color="accent">
                  Redesign Currinda's web platform so it's become more attractive and more efficient
                  user interface and experience.
                </Paragraph>
              </CardBody>
            </Card>
          </Link>
          <Link href="/" passHref>
            <Card>
              <img
                alt="Project Cover"
                src="https://cdn.pixabay.com/photo/2015/05/28/14/53/ux-788002_1280.jpg"
              />
              <CardBody>
                <Text
                  color={themeProps.colors.secondary}
                  paddingBottom={themeProps.space.xs}
                  variant={300}
                >
                  Web Development
                </Text>
                <Heading
                  color={themeProps.colors.primary}
                  paddingBottom={themeProps.space.xs}
                  variant={500}
                >
                  Depa's Infection
                </Heading>
                <Paragraph color="accent">
                  A landing page site project for an event held by Dental Dept. of Gajah Mada
                  University.
                </Paragraph>
              </CardBody>
            </Card>
          </Link>
          <Link href="/" passHref>
            <Card>
              <img
                alt="Project Cover"
                src="https://cdn.pixabay.com/photo/2015/05/28/14/53/ux-788002_1280.jpg"
              />
              <CardBody>
                <Text
                  color={themeProps.colors.secondary}
                  paddingBottom={themeProps.space.xs}
                  variant={300}
                >
                  Web Development
                </Text>
                <Heading
                  color={themeProps.colors.primary}
                  paddingBottom={themeProps.space.xs}
                  variant={500}
                >
                  Renovasri
                </Heading>
                <Paragraph color="accent">
                  Built a corporate website for construction company, Renovasri, using WordPress.
                </Paragraph>
              </CardBody>
            </Card>
          </Link>
          <Link href="/" passHref>
            <Card>
              <img
                alt="Project Cover"
                src="https://cdn.pixabay.com/photo/2015/05/28/14/53/ux-788002_1280.jpg"
              />
              <CardBody>
                <Text
                  color={themeProps.colors.secondary}
                  paddingBottom={themeProps.space.xs}
                  variant={300}
                >
                  UI Design
                </Text>
                <Heading
                  color={themeProps.colors.primary}
                  paddingBottom={themeProps.space.xs}
                  variant={500}
                >
                  Boogie Apparel
                </Heading>
                <Paragraph color="accent">
                  Created a UI design that revealed the character of a professional and credible
                  company for PT. Boogie Apparel Indonesia.
                </Paragraph>
              </CardBody>
            </Card>
          </Link>
          <Link href="/" passHref>
            <Card>
              <img
                alt="Project Cover"
                src="https://cdn.pixabay.com/photo/2015/05/28/14/53/ux-788002_1280.jpg"
              />
              <CardBody>
                <Text
                  color={themeProps.colors.secondary}
                  paddingBottom={themeProps.space.xs}
                  variant={300}
                >
                  UI Design
                </Text>
                <Heading
                  color={themeProps.colors.primary}
                  paddingBottom={themeProps.space.xs}
                  variant={500}
                >
                  Boogie Protective Apparel
                </Heading>
                <Paragraph color="accent">
                  Redesign the website for PT. Boogie Apparel Indonesia's second business so that it
                  can attract more visitors and customers.
                </Paragraph>
              </CardBody>
            </Card>
          </Link>

          <Link href="/" passHref>
            <Card>
              <img
                alt="Project Cover"
                src="https://cdn.pixabay.com/photo/2015/05/28/14/53/ux-788002_1280.jpg"
              />
              <CardBody>
                <Text
                  color={themeProps.colors.secondary}
                  paddingBottom={themeProps.space.xs}
                  variant={300}
                >
                  Frontend Development
                </Text>
                <Heading
                  color={themeProps.colors.primary}
                  paddingBottom={themeProps.space.xs}
                  variant={500}
                >
                  iPiring Back Office
                </Heading>
                <Paragraph color="accent">
                  Assigned as a Frontennd Developer to develop a system admin / back office
                  dashboard that replace the old admin system.
                </Paragraph>
              </CardBody>
            </Card>
          </Link>
        </ProjectList>
        <Link href="/projects" passHref>
          <Anchor>
            See More Projects <FiArrowRight />
          </Anchor>
        </Link>
      </Box>
    </Column>
  </ProjectArea>
)

export default Projects
