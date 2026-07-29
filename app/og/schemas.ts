import { z } from 'zod'

const title = z.string().trim().min(1).max(200)
const displayUrl = z.string().trim().min(1).max(300)

// Cloudinary public ids only — never a full URL. This is what keeps the render
// path SSRF-free: no attacker-chosen host is representable in a signed payload,
// because the renderer builds the delivery URL from this id itself. The leading
// character is constrained and `..` rejected so the id cannot climb out of the
// account's namespace.
const cloudinaryPublicId = z
	.string()
	.trim()
	.min(1)
	.max(300)
	.regex(/^[a-zA-Z0-9][a-zA-Z0-9._\-/]*$/, 'Invalid Cloudinary public id')
	.refine((id) => !id.includes('..'), 'Invalid Cloudinary public id')

export const pageParamsSchema = z.object({
	title,
	url: displayUrl,
})

export const projectParamsSchema = z.object({
	title,
	url: displayUrl,
	featuredImage: cloudinaryPublicId,
})

export type PageParams = z.infer<typeof pageParamsSchema>
export type ProjectParams = z.infer<typeof projectParamsSchema>
export type OgTemplateParams = PageParams | ProjectParams
