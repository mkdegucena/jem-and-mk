# Jem & MK - Wedding Website

A lightweight, static web application built for our wedding. It uses plain HTML, CSS, Vanilla JavaScript, and the Pico CSS framework.

The core philosophy of this site is that **all content is managed via a single JSON file**. You do not need to edit the HTML or JavaScript to change dates, texts, colors, or images.

## How It Works

When the website loads, `script.js` fetches the `config.json` file and dynamically injects all the data into the HTML.

Because it uses the `fetch()` API to load the JSON file, **you cannot just double-click `index.html` to view it locally**. You must serve it through a local web server (like VS Code's "Live Server" extension, or by running `python -m http.server` in your terminal).

## Core Features

- **Data-Driven Content:** Everything from the couple's names to the venue map links is pulled from `config.json`.
- **Access Code Protection:** A simple client-side gate keeps the site private. Visitors enter a predefined password to view the RSVP link and wedding details.
- **Preview Mode:** Allows guests (or yourself) to bypass the password to view the site _without_ the RSVP links.
- **Automatic RSVP Cutoff:** If the current date passes the `rsvpDeadlineDate` set in the config, the RSVP buttons automatically disappear, and the site reverts to "Preview Mode" for everyone.
- **Dynamic Gallery:** A 4x4 grid that pulls from an array of `sampleImages`. The JavaScript automatically randomizes the images and swaps them out on an interval to create a living parallax effect.
- **Hidden Interactions:** Clicking the main hero image opens a secret "Our Story" modal.
- **Gift Modal:** A minimalistic "A Note on Gifts" link opens a popup, keeping the mobile view clean.
- **Color Palette:** The 5-color palette at the top of the screen and on the final RSVP card is generated dynamically from the config file.

## Updating the Website

To update the website, simply edit the `config.json` file. Here is a breakdown of the key customizable sections:

- `security.password`: The access code guests use to enter.
- `couple`: Names, hero images, and portrait images (including hover states).
- `ourStory`: The text and image for the secret modal. Text is formatted as an array of paragraphs.
- `countdown.targetDate`: The exact date and time the timer counts down to.
- `ceremony` & `reception`: Details, times, and Google Maps embed links.
- `links`: The external RSVP form URL, Livestream URL, and the strict deadline date.
- `gallery`: Enable/disable the gallery grid, set the grid size, and list the image URLs.
- `palette`: The 5 hex codes that define the site's colors.
- `gifts`: Enable/disable the gift text and update the message.
- `analytics`: Your Google Analytics (GA4) measurement ID.

## Hosting

This is a static site (frontend only). It can be hosted for free on platforms like:

- GitHub Pages
- Vercel
- Netlify

Simply connect the repository to your host of choice, and it will deploy automatically whenever you push changes to the `main` branch.
