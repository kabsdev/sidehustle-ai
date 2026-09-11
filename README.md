# SideHustle AI

A mobile-first quiz app that recommends realistic side hustles based on skills, time, budget, and goals. Built with React + Vite, styled with Tailwind, icons from lucide-react.

## Publish it for free (no coding required)

**Option A — GitHub + Vercel (recommended, auto-updates when you edit files later)**

1. Create a free account at [github.com](https://github.com) if you don't have one.
2. Create a new repository (e.g. `sidehustle-ai`) and use the "uploading an existing file" link on the repo page to drag in every file from this folder — keep the `src` folder structure intact.
3. Create a free account at [vercel.com](https://vercel.com) (you can sign up with your GitHub login).
4. Click **Add New → Project**, select your `sidehustle-ai` repo, and click **Deploy**. Vercel auto-detects the Vite setup — no configuration needed.
5. In about a minute you'll get a live link like `sidehustle-ai.vercel.app`. Every time you update files on GitHub, it redeploys automatically.

[Netlify](https://netlify.com) works the same way: **Add new site → Import an existing project → connect GitHub**.

**Option B — If you have Node.js installed and are comfortable with a terminal**

```
npm install
npm run build
```

This creates a `dist` folder. Go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag that `dist` folder in — you'll get an instant live URL, no account needed (though making a free account lets you keep the site and pick your own subdomain).

## Local development

```
npm install
npm run dev
```

Opens the app locally so you can preview changes before publishing.

## Notes

- Tailwind is loaded via CDN script in `index.html` (zero-config, fine for a project this size). If you outgrow it, swap in a proper Tailwind build later.
- All 24 side hustle listings and their pricing/income figures live in `src/SideHustleAI.jsx` inside the `HUSTLES` array — edit them directly there.
