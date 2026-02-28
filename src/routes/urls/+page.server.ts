import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { addUrl, getUrls } from '$lib/server/urls';
import { fetchContent } from '$lib/server/fetch-content';
import { summarize } from '$lib/server/anthropic';

export const load: PageServerLoad = () => {
	return { urls: getUrls() };
};

export const actions: Actions = {
	add: async ({ request }) => {
		const formData = await request.formData();
		const url = formData.get('url');

		if (!url || typeof url !== 'string' || url.trim().length === 0) {
			return fail(400, { error: 'Please enter a URL.' });
		}

		try {
			new URL(url);
		} catch {
			return fail(400, { error: 'Please enter a valid URL.' });
		}

		addUrl(url.trim());
	},

	generate: async () => {
		const urls = getUrls();

		if (urls.length === 0) {
			return fail(400, { error: 'Add some URLs first.' });
		}

		const results: Array<{ url: string; bullets?: string[]; error?: string }> = [];

		for (const url of urls) {
			try {
				const content = await fetchContent(url);
				const bullets = await summarize(content);
				results.push({ url, bullets });
			} catch (err) {
				results.push({
					url,
					error: err instanceof Error ? err.message : 'Unknown error'
				});
			}
		}

		return { results };
	}
};
