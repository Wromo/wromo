import fetch from 'node-fetch';
const WROMO_TELEMETRY_ENDPOINT = `https://telemetry.wromo.build/api/v1/record`;
const noop = () => {};

export function post(body: Record<string, any>) {
	return fetch(WROMO_TELEMETRY_ENDPOINT, {
		method: 'POST',
		body: JSON.stringify(body),
		headers: { 'content-type': 'application/json' },
	})
		.catch(noop)
		.then(noop, noop);
}
