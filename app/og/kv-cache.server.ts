// The shared SQLite cache round-trips every value through JSON.stringify (see
// `cache.server.ts`), which cannot hold raw bytes — so the PNG has to travel
// as a base64 string between here and the cache.
export function encodePngForCache(png: Uint8Array) {
	return Buffer.from(png).toString('base64')
}

export function decodePngFromCache(cached: string) {
	return new Uint8Array(Buffer.from(cached, 'base64'))
}
