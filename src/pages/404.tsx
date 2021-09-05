import Link from 'next/link'
import styled from '@emotion/styled'
import { Box, Heading, Text, themeProps, AnchorButton } from '../components/ui'
import { PageWrapper } from '../components/layout'

const Section = Box.withComponent('section')

const Page = styled(Section)`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 64px 0;
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 ${themeProps.space.md}px 64px;
`

const Container = styled.div`
  width: 100%;
  max-width: 36rem;
  margin: 0 auto;
`

const Content = styled.div`
  padding: ${themeProps.space.md}px 64px;

  ${themeProps.mediaQueries.md} {
    padding: 96px ${themeProps.space.lg}px;
    display: grid;
    place-items: center;
  }

  ${themeProps.mediaQueries.lg} {
    padding-left: ${themeProps.space.xl}px;
    padding-right: ${themeProps.space.xl}px;
  }
`

const ContentWrapper = styled.div`
  padding-top: 384px;
  padding-bottom: 384px;
  max-width: max-content;
  margin: 0 auto;

  ${themeProps.mediaQueries.md} {
    padding-top: 64px;
    padding-bottom: 64px;
  }
`

const FirstBox = styled.div`
  ${themeProps.mediaQueries.sm} {
    display: flex;
  }
`

const SecondBox = styled.div`
  ${themeProps.mediaQueries.sm} {
    margin-left: 64px;
  }
`
const Devider = styled.div`
  display: flex;
  flex-direction: column;
  ${themeProps.mediaQueries.sm} {
    border-left-width: 1px;
    --tw-border-opacity: 1;
    border-color: #7e7e7e;
    padding-left: ${themeProps.space.lg}px;
  }
`

const Title = styled(Text)`
  letter-spacing: -0.05em;

  ${themeProps.mediaQueries.sm} {
    font-size: 48px;
    line-height: 1;
  }
`

const CtaWrapper = styled.div`
  margin-top: ${themeProps.space.lg}px;
  display: flex;

  ${themeProps.mediaQueries.sm} {
    margin-top: 0;
    border-left-width: 1px;
    border-color: transparent;
    padding-left: ${themeProps.space.lg}px;
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
`

export default function FourOhFour() {
  return (
    <PageWrapper pageTitle={'Page Not Found'}>
      <Page>
        <Wrapper>
          <Container>
            <Content>
              <ContentWrapper>
                <FirstBox>
                  <Heading color="primary" variant={1000}>
                    404
                  </Heading>
                  <SecondBox>
                    <Devider>
                      <Title color="black" fontWeight="800" variant={1000}>
                        Page not found
                      </Title>
                      <Text color="black" marginTop={themeProps.space.xxs}>
                        Please check the URL in the address bar and try again.
                      </Text>
                    </Devider>
                    <CtaWrapper>
                      <Link href="/" passHref>
                        <Anchor>
                          <span aria-hidden="true"> &larr;</span> Back back home
                        </Anchor>
                      </Link>
                    </CtaWrapper>
                  </SecondBox>
                </FirstBox>
              </ContentWrapper>
            </Content>
          </Container>
        </Wrapper>
      </Page>
    </PageWrapper>
  )
}
