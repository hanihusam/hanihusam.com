import { useId, useSyncExternalStore } from 'react'

import { useNonce } from '@/utils/nonce-provider'

import { resumeOverlapHours } from './content'
import { formatLocalOverlapHours, type LocalOverlap } from './overlap-hours'
import { ResumeFact } from './resume-fact'

// Neither the time zone nor "has React taken over" changes during a visit, so
// there's nothing to subscribe to, and the result is computed once: the
// snapshot must be the same object on every call.
const subscribe = () => () => {}
let localOverlap: LocalOverlap | null | undefined
const getLocalOverlap = () => {
	if (localOverlap === undefined) localOverlap = formatLocalOverlapHours()
	return localOverlap
}
const onServer = () => null
const hydratedOnClient = () => true
const notHydratedOnServer = () => false

/**
 * "Overlap hours": the hours Han's day overlaps the visitor's own working
 * day, in their time. The server sends the fixed text (no-JS visitors and
 * search engines keep it); an inline script right after the column swaps in
 * the local text before first paint, so nothing moves later. Hydration keeps
 * that text (suppressHydrationWarning), then React renders the same text. A
 * client-side navigation renders the local text straight away.
 */
export function OverlapFact() {
	const id = useId()
	const nonce = useNonce()
	const overlap = useSyncExternalStore(subscribe, getLocalOverlap, onServer)
	const hydrated = useSyncExternalStore(
		subscribe,
		hydratedOnClient,
		notHydratedOnServer,
	)

	const { fixed, local } = resumeOverlapHours
	const fact = overlap
		? {
				label: local.label,
				value: overlap.value,
				note: local.notes[overlap.kind],
			}
		: fixed

	return (
		<>
			<ResumeFact id={id} dynamic {...fact} />
			{hydrated ? null : (
				<script
					nonce={nonce}
					suppressHydrationWarning
					dangerouslySetInnerHTML={{ __html: prePaintScript(id) }}
				/>
			)}
		</>
	)
}

function prePaintScript(id: string) {
	const { label, notes } = resumeOverlapHours.local
	return `(function(){try{var r=(${formatLocalOverlapHours.toString()})();var f=document.getElementById(${JSON.stringify(id)});if(!r||!f)return;var n=${JSON.stringify(notes)};var c=f.children;c[0].textContent=${JSON.stringify(label)};c[1].textContent=r.value;c[2].textContent=n[r.kind]}catch(e){}})()`
}
