const lab = document.querySelector('[data-indicator-lab]')

if (lab) {
	const links = [...lab.querySelectorAll('[data-nav-index]')]
	const activeIndicator = lab.querySelector('[data-active-indicator]')
	const previewIndicator = lab.querySelector('[data-preview-indicator]')
	const activeOutput = lab.querySelector('[data-active-output]')
	const previewOutput = lab.querySelector('[data-preview-output]')
	const activePositionOutput = lab.querySelector(
		'[data-active-position-output]',
	)
	const previewPositionOutput = lab.querySelector(
		'[data-preview-position-output]',
	)
	const narration = lab.querySelector('[data-lab-narration]')
	const modelButtons = [...lab.querySelectorAll('[data-model]')]
	const motionButton = lab.querySelector('[data-motion-toggle]')
	const scrubButton = lab.querySelector('[data-scrub]')

	const names = ['Home', 'Projects', 'Substack']
	const step = 40
	let activeIndex = 0
	let pointerIndex = null
	let focusIndex = null
	let twoLayerModel = false
	let reducedMotion = false
	let scrubTimer = null

	const previewIndex = () => pointerIndex ?? focusIndex

	function setIndicatorPosition(element, index) {
		element.style.setProperty('--indicator-x', `${index * step}px`)
	}

	function render(reason = 'State updated.') {
		const preview = previewIndex()
		const previewIsDistinct = preview !== null && preview !== activeIndex
		const displayedActive =
			twoLayerModel && previewIsDistinct
				? activeIndex
				: (preview ?? activeIndex)

		setIndicatorPosition(activeIndicator, displayedActive)
		setIndicatorPosition(previewIndicator, preview ?? activeIndex)
		previewIndicator.style.setProperty(
			'--preview-opacity',
			twoLayerModel && previewIsDistinct ? '0.55' : '0',
		)

		activeOutput.textContent = `${activeIndex} · ${names[activeIndex]}`
		previewOutput.textContent =
			preview === null ? 'null · no preview' : `${preview} · ${names[preview]}`
		activePositionOutput.textContent = `${displayedActive * step}px`
		previewPositionOutput.textContent = previewIsDistinct
			? `${preview * step}px at ${twoLayerModel ? '55%' : '0%'} opacity`
			: 'hidden'
		narration.textContent = reason

		links.forEach((link, index) => {
			link.setAttribute(
				'aria-current',
				index === activeIndex ? 'page' : 'false',
			)
		})
	}

	links.forEach((link) => {
		const index = Number(link.dataset.navIndex)

		link.addEventListener('pointerenter', () => {
			pointerIndex = index
			render(
				twoLayerModel
					? `${names[activeIndex]} remains active while ${names[index]} is previewed.`
					: `The single indicator left ${names[activeIndex]}, so the current page is no longer visible.`,
			)
		})

		link.addEventListener('focus', () => {
			requestAnimationFrame(() => {
				if (link.matches(':focus-visible')) {
					focusIndex = index
					render(`Keyboard focus previews ${names[index]}.`)
				}
			})
		})

		link.addEventListener('blur', () => {
			focusIndex = null
			render(`Keyboard focus left ${names[index]}.`)
		})

		link.addEventListener('click', () => {
			if (index === 2) {
				render('Substack is external, so it never becomes the active route.')
				return
			}

			activeIndex = index
			render(`${names[index]} is now the persistent active route.`)
		})
	})

	lab.querySelector('[data-lab-links]').addEventListener('pointerleave', () => {
		pointerIndex = null
		render(`Pointer preview ended. ${names[activeIndex]} remains active.`)
	})

	modelButtons.forEach((button) => {
		button.addEventListener('click', () => {
			twoLayerModel = button.dataset.model === 'two'
			modelButtons.forEach((candidate) => {
				candidate.setAttribute('aria-pressed', String(candidate === button))
			})
			render(
				twoLayerModel
					? 'Two layers: persistent route truth plus temporary interaction preview.'
					: 'One layer: hover replaces route truth and creates ambiguity.',
			)
		})
	})

	motionButton.addEventListener('click', () => {
		reducedMotion = !reducedMotion
		lab.classList.toggle('reduce-motion', reducedMotion)
		motionButton.setAttribute('aria-pressed', String(reducedMotion))
		motionButton.textContent = reducedMotion
			? 'Reduced motion: on'
			: 'Reduced motion: off'
		render(
			reducedMotion
				? 'Durations are now zero; state indicators still survive.'
				: 'Motion restored with the confirmed project timing tokens.',
		)
	})

	scrubButton.addEventListener('click', () => {
		if (scrubTimer !== null) {
			window.clearInterval(scrubTimer)
		}

		let cursor = 0
		scrubTimer = window.setInterval(
			() => {
				pointerIndex = cursor % links.length
				render(
					`Retargeting toward ${names[pointerIndex]} from the indicator's current visual position.`,
				)
				cursor += 1

				if (cursor === 7) {
					window.clearInterval(scrubTimer)
					scrubTimer = null
					pointerIndex = null
					render('Scrub finished; the preview clears and route truth remains.')
				}
			},
			reducedMotion ? 250 : 90,
		)
	})

	render('Start with the one-layer model, then hover Projects or Substack.')
}

const quiz = document.querySelector('[data-quiz]')

if (quiz) {
	quiz.addEventListener('submit', (event) => {
		event.preventDefault()

		const answers = new FormData(quiz)
		const key = { q1: 'b', q2: 'd', q3: 'a' }
		const explanations = {
			q1: 'The active layer is route truth; it must remain visible while another destination is only being previewed.',
			q2: 'CSS transitions retarget from the currently rendered value, which matches rapid pointer and focus changes.',
			q3: 'Reduced motion removes interpolation, not the active and preview state information.',
		}
		const missing = Object.keys(key).filter((name) => !answers.get(name))
		const feedback = quiz.querySelector('[data-quiz-feedback]')

		if (missing.length > 0) {
			feedback.className = 'quiz-feedback incorrect'
			feedback.textContent = 'Answer every question before checking your model.'
			return
		}

		const misses = Object.entries(key).filter(
			([name, expected]) => answers.get(name) !== expected,
		)

		if (misses.length === 0) {
			feedback.className = 'quiz-feedback correct'
			feedback.textContent =
				'All three are correct. You are ready for the fresh chat quiz and the real component.'
			return
		}

		feedback.className = 'quiz-feedback incorrect'
		feedback.textContent = misses
			.map(([name]) => `${name.toUpperCase()}: ${explanations[name]}`)
			.join(' ')
	})
}
