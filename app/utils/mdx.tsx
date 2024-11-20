import * as React from 'react'

import { CloudinaryImg } from '@/components/blog/cloudinary-img'
import { ThemedBlogImage } from '@/components/blog/themed-blog-image'
import { AnchorOrLink } from '@/components/links/anchor-or-link'

import { Themed } from './theme-provider'

import { LRUCache } from 'lru-cache'
import * as mdxBundler from 'mdx-bundler/client/index.js'

const mdxComponents = {
	a: AnchorOrLink,
	Themed,
	ThemedBlogImage,
	CloudinaryImg,
}
/**
 * This should be rendered within a useMemo
 * @param code the code to get the component from
 * @returns the component
 */
function getMdxComponent(code: string) {
	const Component = mdxBundler.getMDXComponent(code)

	function HNHMdxComponent({
		components,
		...rest
	}: Parameters<typeof Component>['0']) {
		return (
			<Component components={{ ...mdxComponents, ...components }} {...rest} />
		)
	}

	return HNHMdxComponent
}

// This exists so we don't have to call new Function for the given code
// for every request for a given blog post/mdx file.
const mdxComponentCache = new LRUCache<
	string,
	ReturnType<typeof getMdxComponent>
>({
	max: 1000,
})

function useMdxComponent(code: string) {
	return React.useMemo(() => {
		if (mdxComponentCache.has(code)) {
			return mdxComponentCache.get(code)!
		}
		const component = getMdxComponent(code)
		mdxComponentCache.set(code, component)
		return component
	}, [code])
}

export { useMdxComponent }
