# AGENTS.md

## Project overview

This repository contains Vivek Singh's static portfolio and CV website. It is deployed as a static site at `vivek.finnotechpulse.com`, as configured by `CNAME`.

The site does not use a package manager, bundler, application framework, or backend. Keep changes compatible with direct static hosting.

## Technology stack

- Semantic HTML5
- Plain JavaScript
- Custom CSS
- Tailwind CSS loaded from its CDN
- AOS (Animate on Scroll) loaded from unpkg
- Font Awesome loaded from cdnjs
- Google Fonts (`Inter`)

Do not introduce a framework, build step, or npm dependency unless the task explicitly requires it.

## Repository layout

All site files are in the repository root:

- `index.html`: Main single-page portfolio, metadata, navigation, and content sections
- `style.css`: Shared custom styles, visual effects, and responsive overrides
- `script.js`: AOS initialization, anchor scrolling, and mobile-menu behavior
- `vivek_singh_cv.html`: Standalone printable/downloadable CV page with inline CV-specific styles
- `image/`: Local profile and company images
- `CNAME`: GitHub Pages custom-domain configuration
- `robots.txt`: Search crawler rules and sitemap location
- `sitemap.xml`: Canonical site URLs and update dates

## Local development

No installation or build is required. From the repository root, run:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000/` and also inspect `http://localhost:8000/vivek_singh_cv.html`.

Opening `index.html` directly is acceptable for simple content checks, but use a local HTTP server for final browser verification.

## Coding conventions

### HTML

- Use four-space indentation.
- Preserve the single-page section structure in `index.html`.
- Give each main section a unique `id`; keep desktop navigation, mobile navigation, and sitemap anchors synchronized when sections change.
- Prefer semantic elements such as `nav`, `main`, `section`, and `footer`.
- Preserve descriptive `alt` text for images and associated `label` elements for form fields.
- Add responsive Tailwind utility classes consistently with neighboring markup.
- Keep custom reusable visual styles in `style.css`; use inline styles only where the existing page already requires one-off behavior.
- When adding an external link that opens with `target="_blank"`, also add `rel="noopener noreferrer"`.

### CSS

- Follow the existing four-space indentation and expanded declaration format.
- Reuse established classes such as `.glass-card`, `.skill-badge`, `.btn-primary`, `.btn-secondary`, and `.nav-link` before adding variants.
- Maintain the dark blue/purple glassmorphism design and responsive behavior.
- Add responsive rules alongside the existing media queries when utilities are insufficient.
- Avoid renaming selectors without updating every HTML reference.

### JavaScript

- Keep JavaScript framework-free and compatible with modern browsers.
- Use `const` by default, arrow functions for callbacks, semicolons, and four-space indentation, matching `script.js`.
- Guard DOM lookups when new elements may not exist on every page.
- Preserve mobile-menu closing and smooth-scrolling behavior when changing navigation.
- Load dependencies before `script.js`; AOS must exist before `AOS.init()` runs.

### Content and assets

- Store local images under `image/` and use relative paths.
- Optimize images before adding them and provide meaningful alternative text.
- Keep personal details, dates, roles, skills, and project descriptions consistent between `index.html` and `vivek_singh_cv.html`.
- When public URLs or section structure change, update `sitemap.xml`, `robots.txt`, and `CNAME` where applicable.
- When portfolio content changes materially, update the footer's “Last Updated” value and relevant `<lastmod>` entries in `sitemap.xml`.
- Never add secrets, API keys, private credentials, or sensitive personal data. This is a fully public static site.

## Validation checklist

There is currently no automated test, lint, or build configuration. Validate changes manually:

1. Serve the repository with `python -m http.server 8000`.
2. Check the browser console for JavaScript, network, and missing-asset errors.
3. Test all desktop and mobile navigation links.
4. Verify the mobile menu opens, closes, and remains usable.
5. Check responsive layouts at narrow, tablet, and desktop widths.
6. Confirm animations degrade gracefully if a CDN resource is unavailable.
7. Verify external links, local images, and the CV link.
8. Inspect both `index.html` and `vivek_singh_cv.html` after shared content changes.
9. Confirm page titles, descriptions, heading order, form labels, and image alt text remain valid.
10. Review `git diff` and ensure `CNAME`, crawler directives, and canonical domain references were not changed unintentionally.

## Scope discipline

- Make focused edits and preserve unrelated portfolio content.
- Do not reformat entire HTML or CSS files for a small change.
- Do not commit generated files, local-server output, editor settings, or temporary assets.
- Treat CDN version changes and custom-domain changes as deployment-sensitive and call them out explicitly.
