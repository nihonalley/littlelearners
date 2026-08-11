# Little Learners

A clean, responsive learning-game website for ages 2–4.

## Local development

Requires Node.js 20 or newer.

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## Production build

```bash
npm run build
```

The deployable static site will be created in:

```text
dist/
```

## Cloudflare Pages

Use:

- Build command: `npm run build`
- Build output directory: `dist`
- Production branch: `main`

Each game lives in its own folder under `games/`.
