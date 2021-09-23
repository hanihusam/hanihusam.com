import React from 'react'
import styled from '@emotion/styled'
import { Box, Heading, Paragraph, themeProps } from '../ui'
import { Column } from '../layout'
import { HiOutlineDesktopComputer, HiOutlinePuzzle } from 'react-icons/hi'

const Section = Box.withComponent('section')

const SectionArea = styled(Section)`
  padding: 0px ${themeProps.space.md}px 84px;

  ${themeProps.mediaQueries.md} {
    padding: ${themeProps.space.xxxl}px ${themeProps.space.lg}px;
    margin: 54px 0;
  }
`

const ServicesContent = styled(Box)`
  display: flex;
  flex-direction: column;

  ${themeProps.mediaQueries.md} {
    flex-direction: row;
    justify-content: space-between;
  }
`

const CardWrapper = styled(Box)`
  width: fit-content;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding: 0;

  ${themeProps.mediaQueries.md} {
    flex-direction: row;
    padding: 72px 0;
    margin: 0 0 0 ${themeProps.space.xxxl}px;
  }
`

const Card = styled(Box)`
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0;
  margin-bottom: ${themeProps.space.md}px;

  ${themeProps.mediaQueries.md} {
    width: calc(100% / 2);
    padding: 0 ${themeProps.space.sm}px;
    margin-left: 40px;
  }
`

const CardBody = styled(Box)`
  padding: ${themeProps.space.xl}px ${themeProps.space.md}px;
`

const Icon = styled(Box)`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  & > svg {
    width: ${props => props.size}px;
    color: ${themeProps.colors.primary};
    height: auto;
  }
`

const Services: React.FC = () => {
  return (
    <SectionArea>
      <Column>
        <ServicesContent>
          <Box display="flex" flexDirection="column" maxWidth={512}>
            <Paragraph color="secondary" paddingBottom={themeProps.space.md}>
              Services
            </Paragraph>
            <Heading color="primary" paddingBottom={themeProps.space.md}>
              Best solutions to boost your creative project.
            </Heading>
            <Paragraph color="black" paddingBottom={themeProps.space.xxl}>
              Are you a professional who needs an attractive website for your business or service?
              Does your current website looks like it "old-fashioned"? Is it not mobile responsive?
              It doesn't have a modern look and optimal user experience across various devices, and
              browsers? <strong>You're in the right place!</strong>
            </Paragraph>
          </Box>
          <CardWrapper>
            <Card>
              <CardBody>
                <Box alignItems="start" display="flex" flexDirection="column">
                  <Icon marginBottom={themeProps.space.sm} size="40">
                    <HiOutlineDesktopComputer />
                  </Icon>
                  <Heading
                    color={themeProps.colors.primary}
                    paddingBottom={themeProps.space.md}
                    variant={500}
                  >
                    Frontend Developer
                  </Heading>
                </Box>
                <Paragraph color={themeProps.colors.black}>
                  Good communication, details in the code and verbose documentation. I guaranteed
                  free session until you can run my code on your system.
                </Paragraph>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <Box alignItems="start" display="flex" flexDirection="column">
                  <Icon marginBottom={themeProps.space.sm} size="40">
                    <HiOutlinePuzzle />
                  </Icon>
                  <Heading
                    color={themeProps.colors.primary}
                    paddingBottom={themeProps.space.md}
                    variant={500}
                  >
                    User Interface Designer
                  </Heading>
                </Box>
                <Paragraph color={themeProps.colors.black}>
                  I look at every UI design project as a process in solving a problem. I am
                  considering all the aspects until the UI design is “work”.
                </Paragraph>
              </CardBody>
            </Card>
          </CardWrapper>
        </ServicesContent>
      </Column>
    </SectionArea>
  )
}

export default Services
