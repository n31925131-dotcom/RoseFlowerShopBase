# Rose Flower Shop

## Overview
A static website for Rose Flower Shop, a floral business based in Rethymno, Crete. The site showcases floral arrangements for weddings, baptisms, and events. It supports both Greek (EL) and English (EN) languages.

## Project Architecture
- **Type**: Static website served by a Node.js HTTP server
- **Server**: `server.js` — a simple static file server using Node.js built-in `http`, `fs`, and `path` modules
- **Port**: 5000 (bound to 0.0.0.0)
- **No npm dependencies** — uses only Node.js built-in modules

### Pages
- `index.html` — Homepage
- `about.html` — About page
- `services.html` — Services page
- `gallery.html` — Gallery page
- `contact.html` — Contact page

### Key Directories
- `css/` — Stylesheets (`main.css`)
- `js/` — Client-side JavaScript (gallery, contact form, language toggle, main)
- `images/` — Image assets organized by section (about, background, gallery, hero, icons, shop)
- `lang/` — Language JSON files (`el.json`, `en.json`) for i18n support

### Styling
- Tailwind CSS via CDN
- Custom CSS in `css/main.css`
- Google Fonts: Inter and Playfair Display

## Recent Changes
- 2026-02-06: Initial setup in Replit environment
