/// <reference types="@sveltejs/kit" />

declare global {
	namespace App {
		interface Platform {
			env: {
				URLS_KV: KVNamespace;
			};
		}
	}
}

export {};
