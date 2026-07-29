import { type ReactNode } from 'react'
import { type z } from 'zod'

import { OG_CANVAS } from '@/og/constants'
import { pageParamsSchema, projectParamsSchema } from '@/og/schemas'
import { PageCard } from '@/og/templates/page'
import { ProjectCard } from '@/og/templates/project'

export type OgTemplateName = 'page' | 'project'

// Assets are resolved to data URIs by the renderer and merged into the params
// before the component is called, so components see both.
type OgTemplateComponentProps = Record<string, unknown>

type OgTemplateDefinition = {
	schema: z.ZodType
	/**
	 * Baked into the signed payload *and* the cache key. Bump on any visual or
	 * param change: every previously signed URL then fails verification and
	 * every cache entry misses, so there is no stale-card purge step.
	 */
	version: number
	size: { width: number; height: number }
	component: (params: OgTemplateComponentProps) => ReactNode
}

export const ogTemplateRegistry = {
	page: {
		schema: pageParamsSchema,
		version: 1,
		size: OG_CANVAS,
		component: (params) => (
			<PageCard {...(params as Parameters<typeof PageCard>[0])} />
		),
	},
	project: {
		schema: projectParamsSchema,
		version: 1,
		size: OG_CANVAS,
		component: (params) => (
			<ProjectCard {...(params as Parameters<typeof ProjectCard>[0])} />
		),
	},
} satisfies Record<OgTemplateName, OgTemplateDefinition>

export function isOgTemplateName(value: string): value is OgTemplateName {
	return Object.hasOwn(ogTemplateRegistry, value)
}

export function getOgTemplate(name: OgTemplateName) {
	return ogTemplateRegistry[name]
}
