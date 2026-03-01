const KEY = 'urls';

export async function addUrl(kv: KVNamespace, url: string): Promise<void> {
	const urls = await getUrls(kv);
	urls.push(url);
	await kv.put(KEY, JSON.stringify(urls));
}

export async function getUrls(kv: KVNamespace): Promise<string[]> {
	const data = await kv.get(KEY);
	return data ? JSON.parse(data) : [];
}

export async function clearUrls(kv: KVNamespace): Promise<void> {
	await kv.delete(KEY);
}
