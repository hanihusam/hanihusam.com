const sequenceLab = document.querySelector('[data-sequence-lab]')

if (sequenceLab) {
	const links = [...sequenceLab.querySelectorAll('[data-sequence-index]')]
	const activeIndicator = sequenceLab.querySelector(
		'[data-sequence-active-indicator]',
	)
	const routeOutput = sequenceLab.querySelector('[data-route-output]')
	const settledOutput = sequenceLab.querySelector('[data-settled-output]')
	const hoverOutput = sequenceLab.querySelector('[data-hover-output]')
	const phaseOutput = sequenceLab.querySelector('[data-phase-output]')
	const narration = sequenceLab.querySelector('[data-sequence-narration]')
	const modelButtons = [
		...sequenceLab.querySelectorAll('[data-sequence-model]'),
	]
	const motionButton = sequenceLab.querySelector('[data-sequence-motion]')
	const programmaticButton = sequenceLab.querySelector(
		'[data-programmatic-route]',
	)

	const names = ['Home', 'Projects', 'Substack']
	const step = 40
	let activeIndex = 0
	let settledIconIndex = 0
	let hoverIndex = null
	let focusIndex = null
	let model = 'simultaneous'
	let reducedMotion = false
	let phase = 'settled'
	let settleTimer = null
	let finishTimer = null

	function clearTimers() {
		window.clearTimeout(settleTimer)
		window.clearTimeout(finishTimer)
		settleTimer = null
		finishTimer = null
	}

	function effectiveInteractionIndex() {
		return hoverIndex ?? focusIndex
	}

	function iconIsBright(index) {
		return index === effectiveInteractionIndex() || index === settledIconIndex
	}

	function render(reason) {
		activeIndicator.style.setProperty(
			'--sequence-indicator-x',
			`${activeIndex * step}px`,
		)

		links.forEach((link, index) => {
			link.classList.toggle('is-icon-bright', iconIsBright(index))
			link.setAttribute(
				'aria-current',
				index === activeIndex ? 'page' : 'false',
			)
		})

		routeOutput.textContent = `${activeIndex} · ${names[activeIndex]}`
		settledOutput.textContent =
			settledIconIndex === null
				? 'null · waiting for background'
				: `${settledIconIndex} · ${names[settledIconIndex]}`
		hoverOutput.textContent =
			effectiveInteractionIndex() === null
				? 'null · no interaction'
				: `${effectiveInteractionIndex()} · ${names[effectiveInteractionIndex()]}`
		phaseOutput.textContent = phase
		narration.textContent = reason
	}

	function activate(index, source) {
		if (index === 2) {
			render(
				'Substack is external, so it brightens on interaction but never becomes route-active.',
			)
			return
		}

		clearTimers()
		activeIndex = index

		if (model === 'simultaneous' || reducedMotion) {
			settledIconIndex = index
			phase = reducedMotion
				? 'settled · zero duration'
				: 'background + icon together'
			render(
				reducedMotion
					? `${names[index]} becomes active immediately; state survives without motion.`
					: `${names[index]}'s background and icon change together, so there is no sequence.`,
			)
			return
		}

		settledIconIndex = null
		phase = '1 · background moving'
		render(
			source === 'pointer'
				? `The background moves to ${names[index]}. Hover keeps its icon bright, so no dim flash is introduced.`
				: `The background moves to ${names[index]}; its inactive icon remains dim for this phase.`,
		)

		settleTimer = window.setTimeout(() => {
			settledIconIndex = index
			phase = '2 · icon color changing'
			render(
				iconIsBright(index) && effectiveInteractionIndex() === index
					? `The active icon phase begins, but hover already owns the bright color.`
					: `${names[index]}'s icon now transitions to the active color.`,
			)

			finishTimer = window.setTimeout(() => {
				phase = 'settled'
				render(`${names[index]} is now the settled active destination.`)
			}, 150)
		}, 200)
	}

	links.forEach((link) => {
		const index = Number(link.dataset.sequenceIndex)

		link.addEventListener('pointerenter', () => {
			hoverIndex = index
			render(
				`${names[index]} is hovered: only its icon color changes; the active background stays put.`,
			)
		})

		link.addEventListener('focus', () => {
			requestAnimationFrame(() => {
				if (link.matches(':focus-visible')) {
					focusIndex = index
					render(
						`${names[index]} has keyboard-visible focus: only its icon color changes.`,
					)
				}
			})
		})

		link.addEventListener('blur', () => {
			focusIndex = null
			render(`Keyboard focus left ${names[index]}.`)
		})

		link.addEventListener('click', () => activate(index, 'pointer'))
	})

	sequenceLab
		.querySelector('[data-sequence-links]')
		.addEventListener('pointerleave', () => {
			hoverIndex = null
			render(
				`${names[activeIndex]} remains active; non-active icons return to their dim color.`,
			)
		})

	modelButtons.forEach((button) => {
		button.addEventListener('click', () => {
			clearTimers()
			model = button.dataset.sequenceModel
			settledIconIndex = activeIndex
			phase = 'settled'
			modelButtons.forEach((candidate) => {
				candidate.setAttribute('aria-pressed', String(candidate === button))
			})
			render(
				model === 'sequenced'
					? 'Sequenced model: background movement completes before active icon color begins.'
					: 'Simultaneous model: background and icon compete for attention at the same moment.',
			)
		})
	})

	motionButton.addEventListener('click', () => {
		reducedMotion = !reducedMotion
		sequenceLab.classList.toggle('reduce-motion', reducedMotion)
		motionButton.setAttribute('aria-pressed', String(reducedMotion))
		motionButton.textContent = reducedMotion
			? 'Reduced motion: on'
			: 'Reduced motion: off'
		render(
			reducedMotion
				? 'Durations and sequencing collapse to zero; icon and route state remain distinct.'
				: 'The confirmed 200ms background phase and 150ms icon phase are restored.',
		)
	})

	programmaticButton.addEventListener('click', () => {
		hoverIndex = null
		focusIndex = null
		activate(activeIndex === 0 ? 1 : 0, 'programmatic')
	})

	render(
		'Start in simultaneous mode, then activate Projects without hovering it.',
	)
}

const sequenceQuiz = document.querySelector('[data-sequence-quiz]')

if (sequenceQuiz) {
	sequenceQuiz.addEventListener('submit', (event) => {
		event.preventDefault()

		const answers = new FormData(sequenceQuiz)
		const key = { q1: 'c', q2: 'a', q3: 'd' }
		const explanations = {
			q1: 'Hover is temporary interaction feedback, so it brightens only the icon and never moves route state.',
			q2: 'Hover already owns the bright icon color; dimming it to replay active timing would create a flash.',
			q3: 'Reduced motion removes the delay and travel while preserving inactive, interactive, and active meanings.',
		}
		const missing = Object.keys(key).filter((name) => !answers.get(name))
		const feedback = sequenceQuiz.querySelector('[data-sequence-quiz-feedback]')

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
				'All three are correct. You can now implement the sequence without confusing hover with route state.'
			return
		}

		feedback.className = 'quiz-feedback incorrect'
		feedback.textContent = misses
			.map(([name]) => `${name.toUpperCase()}: ${explanations[name]}`)
			.join(' ')
	})
}
