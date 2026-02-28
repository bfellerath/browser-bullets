const urls: string[] = [];

export function addUrl(url: string): void {
	urls.push(url);
}

export function getUrls(): string[] {
	return urls;
}

export function clearUrls(): void {
	urls.length = 0;
}
