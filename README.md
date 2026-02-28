# JEM & MK | Wedding Celebration Website 🌿

A beautifully designed, minimalist, one-page wedding website featuring a luxury full-screen snap-scrolling architecture.

Built with modern, responsive Vanilla web technologies, the content is entirely decoupled from the codebase using a `config.json` file. This means the bride and groom can update dates, locations, RSVP links, and passwords without ever touching the HTML or CSS.

## ✨ Key Features

- **Modular Architecture:** HTML, CSS, JS, and Data (JSON) are strictly separated for clean, maintainable code.
- **Full-Screen Snap Scrolling:** App-like scrolling experience with native `IntersectionObserver` animations.
- **Password Gated:** A sleek, animated overlay protects the site from uninvited guests.
- **Interactive Portraits:** Desktop users experience a cross-fade to a candid photo on mouse-hover; mobile users get a smooth, automated animation loop.
- **Dynamic Countdown:** A live countdown timer that calculates down to the second.
- **Blended UI Design:** Elegant CSS filtering makes standard Google Maps embeds and background collages blend perfectly into the Ivory and Sage Green color palette.
- **SEO & Social Ready:** Fully configured Open Graph and Twitter meta tags for beautiful link previews on WhatsApp, iMessage, and social media.

## 📂 File Structure

\`\`\`text
jem-and-mk/
├── index.html # The structural layout and meta tags
├── style.css # All styling, responsive queries, and animations
├── script.js # Logic for fetching data, animations, auth, and countdown
├── config.json # ALL WEBSITE DATA (Edit this to change site content!)
├── .gitignore # Git ignore rules
└── assets/ # Folder for your images
├── town-hall-sketch.png
├── jem.jpg
├── jem-fun.jpg
└── ...
\`\`\`

## 🛠️ How to Edit the Website

You do **not** need to edit the code to update the website. Simply open `config.json` and update the text inside the quotation marks.

For example, to update the Reception venue later, simply change:
\`\`\`json
"reception": {
"locationName": "The Grand Hotel",
"address": "123 Main Street",
"time": "05:00 PM"
}
\`\`\`
_Note: Ensure you do not leave any trailing commas at the end of a JSON block, as this will break the data fetch!_

## 💻 How to Run Locally for Development

Because this site uses the JavaScript `fetch()` API to read `config.json`, simply double-clicking the `index.html` file on your computer will result in a **CORS (Cross-Origin Resource Sharing) error**.

To test the site locally, you must run a local server:

**Option 1: Using Mac Terminal (Python)**

1. Open Terminal and navigate to this folder: `cd path/to/jem-and-mk`
2. Start the server: `python3 -m http.server 8000`
3. Open your browser and go to `http://localhost:8000`

**Option 2: Using VS Code**

1. Install the **"Live Server"** extension by Ritwick Dey.
2. Open `index.html`.
3. Click "Go Live" in the bottom right corner of VS Code.

## 🚀 Deployment

This site is fully static and optimized for deployment on platforms like **GitHub Pages**, Vercel, or Netlify. When hosted online, the CORS security restrictions are handled automatically, and the JSON fetching works seamlessly.
