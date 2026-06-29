import { prisma } from './db.server'

const getUserLikeCount = async ({
	sessionId,
	slug,
}: {
	sessionId: string
	slug: string
}) =>
	await prisma.like.count({
		where: {
			sessionId,
			ContentMeta: {
				slug,
			},
		},
	})

async function getContentViews({
	sessionId,
	slug,
}: {
	sessionId: string
	slug: string
}) {
	const content = await prisma.contentMeta.findFirst({
		where: {
			slug,
		},
		include: {
			_count: {
				select: {
					views: true,
					likes: true,
				},
			},
		},
	})

	return {
		contentViews: content?._count.views ?? 0,
		contentLikes: content?._count.likes ?? 0,
		likesByUser: await getUserLikeCount({ sessionId, slug }),
	}
}

async function incrementViews({
	sessionId,
	slug,
}: {
	sessionId: string
	slug: string
}) {
	const content = await prisma.contentMeta.upsert({
		where: {
			slug: slug,
		},
		create: {
			slug,
			views: {
				create: {
					sessionId,
				},
			},
		},
		update: {
			views: {
				create: {
					sessionId,
				},
			},
		},
		include: {
			_count: {
				select: {
					views: true,
					likes: true,
				},
			},
		},
	})

	return {
		contentViews: content?._count.views ?? 0,
		contentLikes: content?._count.likes ?? 0,
		likesByUser: await getUserLikeCount({ sessionId, slug }),
	}
}

async function incrementLikes({
	sessionId,
	slug,
}: {
	sessionId: string
	slug: string
}) {
	const likeCount = await getUserLikeCount({ sessionId, slug })

	if (likeCount >= 5) throw new Error('Max like count is 5')

	const content = await prisma.contentMeta.upsert({
		where: {
			slug: slug,
		},
		create: {
			slug,
			likes: {
				create: {
					sessionId,
				},
			},
		},
		update: {
			likes: {
				create: {
					sessionId,
				},
			},
		},
		include: {
			_count: {
				select: {
					views: true,
					likes: true,
				},
			},
		},
	})

	return {
		contentViews: content?._count.views ?? 0,
		contentLikes: content?._count.likes ?? 0,
		likesByUser: likeCount + 1,
	}
}

export { getContentViews, getUserLikeCount, incrementLikes, incrementViews }
