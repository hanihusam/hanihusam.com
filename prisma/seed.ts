import { readdirSync } from 'node:fs'
import path from 'node:path'

import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Seed view/like counts for the actual project content so local dev mirrors the
// real site. Production never runs this (start.sh only migrates); ContentMeta
// rows are created lazily at runtime by incrementViews/incrementLikes.
function getProjectSlugs() {
	const projectsDir = path.join(process.cwd(), 'contents/projects')
	return readdirSync(projectsDir)
		.filter((file) => file.endsWith('.mdx'))
		.map((file) => file.replace(/\.mdx$/, ''))
}

async function seed() {
	const slugs = getProjectSlugs()

	for (const slug of slugs) {
		const viewsCount = faker.number.int({ min: 50, max: 2000 })
		const likesCount = faker.number.int({ min: 0, max: 80 })

		await prisma.contentMeta.upsert({
			where: { slug },
			update: {},
			create: {
				slug,
				views: {
					create: Array.from({ length: viewsCount }, () => ({
						sessionId: faker.string.uuid(),
					})),
				},
				likes: {
					create: Array.from({ length: likesCount }, () => ({
						sessionId: faker.string.uuid(),
					})),
				},
			},
		})
	}
}

seed()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
