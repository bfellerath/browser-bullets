export async function fetchContent(url: string): Promise<string> {
	const response = await fetch(url, {
		headers: { 'User-Agent': 'BrowserBullets/1.0' }
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch ${url}: ${response.status}`);
	}

	const html = await response.text();

	// Strip script/style tags and their content, then strip remaining HTML tags
	const text = html
		.replace(/<script[\s\S]*?<\/script>/gi, '')
		.replace(/<style[\s\S]*?<\/style>/gi, '')
		.replace(/<[^>]+>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

	return text;
}
