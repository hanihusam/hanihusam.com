// !STARTERCONF You can delete this page
import clsx from 'clsx'
import * as React from 'react'

import Button from '@/components/buttons/Button'
import Layout from '@/components/layout/Layout'
import ArrowLink from '@/components/links/ArrowLink'
import ButtonLink from '@/components/links/ButtonLink'
import PrimaryLink from '@/components/links/PrimaryLink'
import UnderlineLink from '@/components/links/UnderlineLink'
import UnstyledLink from '@/components/links/UnstyledLink'
import NextImage from '@/components/NextImage'
import Seo from '@/components/Seo'
import Skeleton from '@/components/Skeleton'

type Color = typeof colorList[number]

export default function ComponentsPage() {
  const [mode, setMode] = React.useState<'dark' | 'light'>('light')
  const [color, setColor] = React.useState<Color>('sky')
  function toggleMode() {
    return mode === 'dark' ? setMode('light') : setMode('dark')
  }

  const textColor = mode === 'dark' ? 'text-gray-300' : 'text-gray-600'

  return (
    <Layout>
      <Seo description="Pre-built components with awesome default" templateTitle="Components" />

      <main>
        <section className={clsx(mode === 'dark' ? 'bg-dark' : 'bg-gray-50', color)}>
          <div
            className={clsx(
              'layout min-h-screen py-20',
              mode === 'dark' ? 'text-white' : 'text-black'
            )}
          >
            <h1>Built-in Components</h1>
            <ArrowLink className="mt-2" direction="left" href="/">
              Back to Home
            </ArrowLink>

            <div className="mt-8 flex flex-wrap gap-2">
              <Button onClick={toggleMode} variant={mode === 'dark' ? 'light' : 'dark'}>
                Set to {mode === 'dark' ? 'light' : 'dark'}
              </Button>
              {/* <Button onClick={randomize}>Randomize CSS Variable</Button> */}
            </div>

            <ol className="mt-8 space-y-6">
              <li className="space-y-2">
                <h2 className="text-lg md:text-xl">Customize Colors</h2>
                <p className={clsx('!mt-1 text-sm', textColor)}>
                  You can change primary color to any Tailwind CSS colors. See globals.css to change
                  your color.
                </p>
                <div className="flex flex-wrap gap-2">
                  <select
                    className={clsx(
                      'block max-w-xs rounded',
                      mode === 'dark'
                        ? 'border border-gray-600 bg-dark'
                        : 'border-gray-300 bg-white',
                      'focus:border-primary-400 focus:outline-none focus:ring focus:ring-primary-400'
                    )}
                    id="color"
                    name="color"
                    onChange={e => setColor(e.target.value as Color)}
                    value={color}
                  >
                    {colorList.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ButtonLink href="https://github.com/theodorusclarence/ts-nextjs-tailwind-starter/blob/main/src/styles/colors.css">
                    Check list of colors
                  </ButtonLink>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-50 text-black">
                    50
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-100 text-black">
                    100
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-200 text-black">
                    200
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-300 text-black">
                    300
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-400 text-black">
                    400
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-500 text-black">
                    500
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-600 text-white">
                    600
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-700 text-white">
                    700
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-800 text-white">
                    800
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-900 text-white">
                    900
                  </div>
                </div>
              </li>
              <li className="space-y-2">
                <h2 className="text-lg md:text-xl">UnstyledLink</h2>
                <p className={clsx('!mt-1 text-sm', textColor)}>
                  No style applied, differentiate internal and outside links, give custom cursor for
                  outside links.
                </p>
                <div className="space-x-2">
                  <UnstyledLink href="/">Internal Links</UnstyledLink>
                  <UnstyledLink href="https://theodorusclarence.com">Outside Links</UnstyledLink>
                </div>
              </li>
              <li className="space-y-2">
                <h2 className="text-lg md:text-xl">PrimaryLink</h2>
                <p className={clsx('!mt-1 text-sm', textColor)}>
                  Add styling on top of UnstyledLink, giving a primary color to the link.
                </p>
                <div className="space-x-2">
                  <PrimaryLink href="/">Internal Links</PrimaryLink>
                  <PrimaryLink href="https://theodorusclarence.com">Outside Links</PrimaryLink>
                </div>
              </li>
              <li className="space-y-2">
                <h2 className="text-lg md:text-xl">UnderlineLink</h2>
                <p className={clsx('!mt-1 text-sm', textColor)}>
                  Add styling on top of UnstyledLink, giving a dotted and animated underline.
                </p>
                <div className="space-x-2">
                  <UnderlineLink href="/">Internal Links</UnderlineLink>
                  <UnderlineLink href="https://theodorusclarence.com">Outside Links</UnderlineLink>
                </div>
              </li>
              <li className="space-y-2">
                <h2 className="text-lg md:text-xl">ArrowLink</h2>
                <p className={clsx('!mt-1 text-sm', textColor)}>
                  Useful for indicating navigation, I use this quite a lot, so why not build a
                  component with some whimsy touch?
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <ArrowLink direction="left" href="/">
                    Direction Left
                  </ArrowLink>
                  <ArrowLink href="/">Direction Right</ArrowLink>
                  <ArrowLink as={UnstyledLink} className="inline-flex items-center" href="/">
                    Polymorphic
                  </ArrowLink>
                  <ArrowLink
                    as={ButtonLink}
                    className="inline-flex items-center"
                    href="/"
                    variant="light"
                  >
                    Polymorphic
                  </ArrowLink>
                </div>
              </li>
              <li className="space-y-2">
                <h2 className="text-lg md:text-xl">ButtonLink</h2>
                <p className={clsx('!mt-1 text-sm', textColor)}>
                  Button styled link with 3 variants.
                </p>
                <div className="flex flex-wrap gap-2">
                  <ButtonLink href="https://theodorusclarence.com" variant="primary">
                    Primary Variant
                  </ButtonLink>
                  <ButtonLink
                    href="https://theodorusclarence.com"
                    isDarkBg={mode === 'dark'}
                    variant="outline"
                  >
                    Outline Variant
                  </ButtonLink>
                  <ButtonLink
                    href="https://theodorusclarence.com"
                    isDarkBg={mode === 'dark'}
                    variant="ghost"
                  >
                    Ghost Variant
                  </ButtonLink>
                  <ButtonLink href="https://theodorusclarence.com" variant="dark">
                    Dark Variant
                  </ButtonLink>
                  <ButtonLink href="https://theodorusclarence.com" variant="light">
                    Light Variant
                  </ButtonLink>
                </div>
              </li>
              <li className="space-y-2">
                <h2 className="text-lg md:text-xl">Button</h2>
                <p className={clsx('!mt-1 text-sm', textColor)}>Ordinary button with style.</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="primary">Primary Variant</Button>
                  <Button isDarkBg={mode === 'dark'} variant="outline">
                    Outline Variant
                  </Button>
                  <Button isDarkBg={mode === 'dark'} variant="ghost">
                    Ghost Variant
                  </Button>
                  <Button variant="dark">Dark Variant</Button>
                  <Button variant="light">Light Variant</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button disabled variant="primary">
                    Disabled
                  </Button>
                  <Button disabled isDarkBg={mode === 'dark'} variant="outline">
                    Disabled
                  </Button>
                  <Button disabled isDarkBg={mode === 'dark'} variant="ghost">
                    Disabled
                  </Button>
                  <Button disabled variant="dark">
                    Disabled
                  </Button>
                  <Button disabled variant="light">
                    Disabled
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button isLoading variant="primary">
                    Disabled
                  </Button>
                  <Button isDarkBg={mode === 'dark'} isLoading variant="outline">
                    Disabled
                  </Button>
                  <Button isDarkBg={mode === 'dark'} isLoading variant="ghost">
                    Disabled
                  </Button>
                  <Button isLoading variant="dark">
                    Disabled
                  </Button>
                  <Button isLoading variant="light">
                    Disabled
                  </Button>
                </div>
              </li>
              <li className="space-y-2">
                <h2 className="text-lg md:text-xl">Custom 404 Page</h2>
                <p className={clsx('!mt-1 text-sm', textColor)}>
                  Styled 404 page with some animation.
                </p>
                <div className="flex flex-wrap gap-2">
                  <ButtonLink href="/404">Visit the 404 page</ButtonLink>
                </div>
              </li>
              <li className="space-y-2">
                <h2 className="text-lg md:text-xl">Next Image</h2>
                <p className={clsx('!mt-1 text-sm', textColor)}>
                  Next Image with default props and skeleton animation
                </p>
                <NextImage
                  alt="Icon"
                  className="mt-8"
                  height="180"
                  src="/favicon/apple-icon-180x180.png"
                  width="180"
                />
              </li>
              <li className="space-y-2">
                <h2 className="text-lg md:text-xl">Skeleton</h2>
                <p className={clsx('!mt-1 text-sm', textColor)}>Skeleton with shimmer effect</p>
                <Skeleton className="h-72 w-72" />
              </li>
            </ol>
          </div>
        </section>
      </main>
    </Layout>
  )
}

const colorList = [
  'rose',
  'pink',
  'fuchsia',
  'purple',
  'violet',
  'indigo',
  'blue',
  'sky',
  'cyan',
  'teal',
  'emerald',
  'green',
  'lime',
  'yellow',
  'amber',
  'orange',
  'red',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone'
] as const
