# Prashanth Reddy S - Portfolio

Personal portfolio website for Prashanth Reddy S, built with React and Vite. It is based on the Portfolio_series template and shows resume details, projects, certificates, and skills.

# Website
https://prashanth-reddy-s-portfolio.prashanthportfolio.workers.dev/

## Setup

You need Node.js 18 or newer.

```
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```
npm run build
```

This creates the `dist` folder. Upload that folder to any static host such as Vercel, Netlify, or GitHub Pages.

## Editing the content

**Option 1: Studio editor**

1. Click the profile picture in the top right.
2. Click "✎ EDIT" and enter the passcode.
3. Change the details in the form and click "Save & reload".
4. To make the changes permanent, click "Export overrides.json", save the file as `src/data/overrides.json`, and commit it.

The passcode is set by `STUDIO_PASSCODE` in `src/components/StudioEditor.tsx`. Change it before publishing.

**Option 2: Edit the code**

All content is in `src/data/portfolio.ts`.

- Profile, education, and internships: `profile`, `education`, `experience`
- Projects: `projects` (GitHub and website links are optional)
- Certificates and achievements: `certifications`, `achievements`
- Skills: `skillCategories`
- Resume: replace `public/assets/Prashanth_Reddy_Resume.pdf`
- Photo: replace `pic1.jpeg` and `pic.png`, then run `npm run images`

## Project structure

- `src/data/` - content and saved studio edits
- `src/components/` - all page sections
- `public/assets/` - photos and resume PDF
- `scripts/` - image generation script

## Credits

Based on the Portfolio_series template by Sushmitadasari.

## Contact

prashanthreddy9878@gmail.com
