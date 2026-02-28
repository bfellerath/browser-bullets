# Browser Bullets

A hackathon monorepo with two independent tools, both Claude-powered.

---

## Tool 1: Article Summarizer (SvelteKit)

Scrapes any public URL and returns exactly **3 concise bullet points** summarizing the content.

### Core function

```ts
import { summarizeUrl } from '$lib/server/summarizeUrl';

const bullets = await summarizeUrl('https://example.com/article');
// → ['bullet one', 'bullet two', 'bullet three']
```

### Setup

```bash
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run dev
# → http://localhost:5173
```

### API endpoint

```
POST /api/summarize
Content-Type: application/json

{ "url": "https://example.com/article" }
```

Response:

```json
{ "bullets": ["...", "...", "..."] }
```

Smoke test:

```bash
curl -s -X POST http://localhost:5173/api/summarize \
  -H "Content-Type: application/json" \
  -d '{"url":"https://en.wikipedia.org/wiki/Artificial_intelligence"}' \
  | jq .
```

### Bookmarklet

Create a browser bookmark with this URL to summarize any page in a floating overlay:

```
javascript:(function(){const S="http://localhost:5173/api/summarize";const e=document.getElementById("__bb_overlay");if(e){e.remove();return;}const o=document.createElement("div");o.id="__bb_overlay";o.style.cssText="position:fixed;top:20px;right:20px;z-index:2147483647;background:#1a1a2e;color:#e0e0e0;font-family:system-ui,sans-serif;font-size:14px;line-height:1.5;border-radius:12px;padding:18px 20px;max-width:420px;width:calc(100vw - 48px);box-shadow:0 8px 32px rgba(0,0,0,.55);border:1px solid #333";const h=document.createElement("div");h.style.cssText="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px";const ti=document.createElement("strong");ti.textContent="\u26A1 Browser Bullets";ti.style.cssText="font-size:15px;color:#a78bfa";const cb=document.createElement("button");cb.textContent="\u2715";cb.style.cssText="background:none;border:none;color:#aaa;cursor:pointer;font-size:16px;line-height:1;padding:0";cb.onclick=function(){o.remove();};h.appendChild(ti);h.appendChild(cb);const ur=document.createElement("div");ur.style.cssText="display:flex;gap:6px;margin-bottom:12px";const ui=document.createElement("input");ui.type="text";ui.value=window.location.href;ui.style.cssText="flex:1;background:#0d0d1a;border:1px solid #444;border-radius:6px;color:#e0e0e0;font-size:12px;padding:6px 8px;outline:none;min-width:0";const gb=document.createElement("button");gb.textContent="\u2192";gb.style.cssText="background:#a78bfa;border:none;border-radius:6px;color:#1a1a2e;cursor:pointer;font-size:16px;font-weight:bold;padding:6px 10px";ur.appendChild(ui);ur.appendChild(gb);const b=document.createElement("div");b.id="__bb_body";b.style.cssText="color:#a0a0b0;font-size:13px";b.textContent="Enter a URL above and click \u2192";o.appendChild(h);o.appendChild(ur);o.appendChild(b);document.body.appendChild(o);function summarize(){const url=ui.value.trim();if(!url)return;b.innerHTML="Fetching and summarizing\u2026";b.style.color="#a0a0b0";fetch(S,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({url:url})}).then(function(r){return r.json();}).then(function(d){if(d.error){b.textContent="Error: "+d.error;b.style.color="#f87171";return;}b.innerHTML="";b.style.color="";const ul=document.createElement("ul");ul.style.cssText="margin:0;padding-left:18px";d.bullets.forEach(function(x){const li=document.createElement("li");li.textContent=x;li.style.marginBottom="6px";ul.appendChild(li);});b.appendChild(ul);}).catch(function(){b.textContent="Could not reach server. Is it running?";b.style.color="#f87171";});}gb.onclick=summarize;ui.addEventListener("keydown",function(ev){if(ev.key==="Enter")summarize();});})();
```

Click the bookmark on any page. The overlay pre-fills the current URL — change it if needed, then press **→** or **Enter**. Click **✕** or the bookmark again to dismiss.

### Key files

| File | Purpose |
|------|---------|
| `src/lib/server/summarizeUrl.ts` | **Main function** — `summarizeUrl(url) → string[]` |
| `src/lib/server/scraper.ts` | Fetches a URL and extracts article text via cheerio |
| `src/lib/server/anthropic.ts` | Sends text to Claude, returns 3 bullet strings |
| `src/routes/api/summarize/+server.ts` | `POST /api/summarize` — HTTP wrapper around `summarizeUrl` |
| `src/hooks.server.ts` | CORS headers so the bookmarklet can reach the API |
| `bookmarklet.js` | Human-readable bookmarklet source |

---

## Tool 2: Reddit Saved Posts Scraper

Exports your Reddit saved posts and comments to local JSON and Markdown files.

### Setup

```bash
cd reddit-saver
npm install
cp .env.example .env
# Fill in your Reddit credentials (see below)
```

### Environment variables

```
REDDIT_CLIENT_ID=...
REDDIT_CLIENT_SECRET=...
REDDIT_USERNAME=...
REDDIT_PASSWORD=...
OUTPUT_DIR=./reddit_saved   # optional, default shown
```

Create a Reddit "script" app at **https://www.reddit.com/prefs/apps** to get a client ID and secret.

### Run

```bash
# Export saved posts and comments
npm start

# Also download full comment threads for each saved post
npm start -- --with-threads
```

### Output

```
reddit_saved/
  index.json          ← all items list
  posts/
    2024-01-15_abc123_Post Title.json
    2024-01-15_abc123_Post Title.md
  comments/
    ...
  threads/            ← only with --with-threads
    ...
```

Each `.md` file contains human-readable metadata + content. Each `.json` is the raw Reddit API response.

### Key files

| File | Purpose |
|------|---------|
| `reddit-saver/reddit-saved.ts` | Main script — auth, fetch, write to disk |
| `reddit-saver/.env.example` | Credential template |
