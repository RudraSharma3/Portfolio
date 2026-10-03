# Portfolio

Structure
- index.html            -> the site (root, no redirect)
- code/style.css, code/script.js
- assets/portrait.jpg    -> replace with your full-quality photo (same name)
- assets/Rudra_Sharma_Resume.pdf -> replace when your resume changes
- assets/og-image.png    -> link-preview image (1200x630)
- assets/certificates/   -> all certificates and badges (see README.txt there)

Edit points (code/script.js)
- PR array: each project `link` (null shows "Repository coming soon")
- CERTS array: add certificates

Before publishing
- In index.html, og:image uses https://rudrasharma3.github.io/Portfolio/assets/og-image.png. Change it to your real final URL.
- Preview locally: python3 -m http.server, open http://localhost:8000/
- GitHub Pages / Netlify / Vercel: deploy this folder as the root.
