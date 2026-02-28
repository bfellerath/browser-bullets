import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { summarizeUrl } from '$lib/server/summarizeUrl';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const { url } = body;

	if (!url || typeof url !== 'string') {
		error(400, 'Missing "url" field.');
	}

	try {
		const bullets = await summarizeUrl(url);
		return json({ bullets });
	} catch (err) {
		console.error('Summarize error:', err instanceof Error ? err.message : err);
		error(502, err instanceof Error ? err.message : 'Failed to summarize.');
	}
};
