# Browser Bullets

3-bullet article summary in the browser — Claude-powered hackathon demo.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env and paste your Anthropic API key
```

## Run

```bash
npm start
# Server starts at http://localhost:3000
```

For auto-reload during development:

```bash
npm run dev
```

## Smoke test

```bash
curl -s -X POST http://localhost:3000/summarize \
  -H "Content-Type: application/json" \
  -d '{"text":"Artificial intelligence is transforming industries worldwide. Companies are investing billions in AI research and development. The technology promises to automate repetitive tasks, improve decision-making, and create new economic opportunities, though it also raises concerns about job displacement and ethical governance."}' \
  | jq .
```

Expected response:

```json
{
  "bullets": [
    "...",
    "...",
    "..."
  ]
}
```

## Bookmarklet

1. Create a new browser bookmark.
2. Set the **URL** to the single line below (copy the entire thing):

```
javascript:(function(){const S="http://localhost:3000/summarize";const e=document.getElementById("__bb_overlay");if(e){e.remove();return;}const a=document.querySelector("article");const t=(a?a:document.body).innerText;const o=document.createElement("div");o.id="__bb_overlay";o.style.cssText="position:fixed;top:20px;right:20px;z-index:2147483647;background:#1a1a2e;color:#e0e0e0;font-family:system-ui,sans-serif;font-size:14px;line-height:1.5;border-radius:12px;padding:18px 20px;max-width:380px;width:calc(100vw - 48px);box-shadow:0 8px 32px rgba(0,0,0,.55);border:1px solid #333";const h=document.createElement("div");h.style.cssText="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px";const ti=document.createElement("strong");ti.textContent="\u26A1 Browser Bullets";ti.style.cssText="font-size:15px;color:#a78bfa";const cb=document.createElement("button");cb.textContent="\u2715";cb.style.cssText="background:none;border:none;color:#aaa;cursor:pointer;font-size:16px;line-height:1;padding:0";cb.onclick=function(){o.remove();};h.appendChild(ti);h.appendChild(cb);const b=document.createElement("div");b.id="__bb_body";b.textContent="Summarizing\u2026";b.style.cssText="color:#a0a0b0";o.appendChild(h);o.appendChild(b);document.body.appendChild(o);fetch(S,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:t})}).then(function(r){return r.json();}).then(function(d){if(d.error){b.textContent="Error: "+d.error;b.style.color="#f87171";return;}b.innerHTML="";b.style.color="";const ul=document.createElement("ul");ul.style.cssText="margin:0;padding-left:18px";d.bullets.forEach(function(x){const li=document.createElement("li");li.textContent=x;li.style.marginBottom="6px";ul.appendChild(li);});b.appendChild(ul);}).catch(function(){b.textContent="Could not reach server. Is it running?";b.style.color="#f87171";});})();
```

3. Navigate to any article page and click the bookmark.
4. Click it again (or the ✕ button) to dismiss.

> **Note:** The server must be running locally. Clicking the bookmarklet on an `https://` page while the server runs on `http://` requires your browser to allow mixed content — in Chrome, click the shield icon in the address bar and allow it, or use Firefox which is more permissive by default.

## Files

| File | Purpose |
|------|---------|
| `server.js` | Express API server |
| `bookmarklet.js` | Human-readable bookmarklet source |
| `.env.example` | Environment variable template |
