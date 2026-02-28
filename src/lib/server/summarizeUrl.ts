import { scrapeUrl } from './scraper';
import { summarize } from './anthropic';

/**
 * Given any public URL, fetches the page, extracts the article text,
 * and returns exactly 3 concise bullet-point strings summarizing the content.
 *
 * @throws if the URL is unreachable, returns no text, or Claude fails
 */
export async function summarizeUrl(url: string): Promise<string[]> {
	const text = await scrapeUrl(url);

	if (!text.trim()) {
		throw new Error('No readable text found at that URL.');
	}

	return summarize(text);
}
