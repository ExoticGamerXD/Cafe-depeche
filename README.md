# Café Depeche — Cork City

An elegant, fully responsive one-page website for **Café Depeche**, a specialty
coffee house and brunch room on Pope's Quay, Cork City. Hand-built with static
HTML, CSS and vanilla JavaScript — no build step, no dependencies, hosts anywhere.

> The café and its content are a tasteful placeholder. Swap in real copy, photos,
> address, hours and links wherever marked.

## Highlights

- **Elegant, performance-minded animations**
  - Scroll-reveal sections (IntersectionObserver, no jank)
  - rAF-throttled parallax on hero & feature images
  - Animated word-by-word hero headline, count-up stats, marquee, page loader
  - Every animation honours `prefers-reduced-motion`
- **Responsive on any device** — mobile-first layout, fluid `clamp()` typography,
  hamburger menu, `100svh` hero (no mobile-viewport jump)
- **Accessible** — skip link, semantic landmarks, keyboard-closable menu,
  ARIA states, visible focus, live-region form status
- **Fast** — system/Google fonts with `preconnect`, lazy-loaded images,
  `fetchpriority` on the hero, zero JS frameworks
- Working sections: Hero · Story (with stats) · Menu · Feature quote ·
  Gallery · Visit (hours, contact form, embedded map) · Footer

## Structure

```
.
├── index.html        # All markup (single page, anchor navigation)
├── css/styles.css    # Design tokens + all styling
├── js/main.js        # Loader, nav, reveal, counters, parallax, form
└── README.md
```

## Run locally

It's a static site — open `index.html` directly, or serve it:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then visit http://localhost:8000.

## Deploy

Drag-and-drop the folder onto **Netlify**, push to **GitHub Pages**, or upload to
any static host (Cloudflare Pages, Vercel, S3). No configuration required.

## Customising

| What | Where |
|------|-------|
| Brand colours / fonts | CSS variables at the top of `css/styles.css` (`:root`) |
| Café name, copy, menu, prices | `index.html` |
| Photos | Replace the Unsplash `src` URLs (e.g. drop files in `assets/` and point to them) |
| Map location | `bbox` / `marker` query params on the `<iframe>` in the Visit section |
| Contact form | Currently a client-side demo. Wire the `submit` handler in `js/main.js` to a backend or a service like Formspree/Netlify Forms |

## License

Code is free to reuse. Placeholder images are from [Unsplash](https://unsplash.com)
under the Unsplash License; replace with your own before going live.
