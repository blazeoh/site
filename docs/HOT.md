# 🟠 Interactive Data-Driven Site

**Difficulty:** Hot

**Deployment:** GitHub Pages (see [GITHUB_PAGES.md](GITHUB_PAGES.md))

**API required:** Yes, at least one public API

---

## Overview

Build a website that **fetches and displays data** from a public API. The site should respond to user input (searches, filters, clicks) and update the page without reloading.

This level focuses on JavaScript, `fetch()`, and DOM manipulation. When you are done, publish it using GitHub Pages. Since your JavaScript calls external APIs from the browser, no additional configuration is needed.

---

## Requirements

### Functionality
- [ ] Fetches data from at least **one public API** using `fetch()` or `async/await`
- [ ] Data is displayed dynamically in the DOM (not hardcoded)
- [ ] At least **one user interaction** triggers a new fetch or updates displayed data (e.g., search bar, dropdown, button)
- [ ] Loading state is shown while data is being fetched
- [ ] Errors are handled (show a message if the fetch fails, no silent failures)

### Pages / Structure
- [ ] At least **2 distinct views or sections** (e.g., search results + detail view, or a dashboard with multiple data panels)
- [ ] Clear navigation or UI controls

### HTML & CSS
- [ ] Semantic HTML structure
- [ ] Custom CSS styling (should not look like unstyled HTML)
- [ ] Responsive design (works on mobile and desktop)

### JavaScript
- [ ] All data fetching in `app.js` (or equivalent)
- [ ] No inline JavaScript in HTML
- [ ] Functions are named and organized (avoid one giant block of code)

### API & Attribution
- [ ] API is free and does not require a paid key (or key is safely handled)
- [ ] API is credited in your project README

### Deployment
- [ ] Site is published via GitHub Pages
- [ ] Live URL is included in your project README

---

## Note on API Keys and GitHub Pages

If your API requires a key, **do not hardcode it in your JavaScript files.** Those files are public on GitHub. Use only APIs that work without a key, or store the key in a backend (that moves you toward SPICY territory).

---

## Public API Ideas

- [Open-Meteo](https://open-meteo.com/): weather data, no key required
- [PokeAPI](https://pokeapi.co/): Pokemon data
- [Open Library](https://openlibrary.org/developers/api): books
- [NASA APIs](https://api.nasa.gov/): astronomy, Mars rover photos, APOD
- [REST Countries](https://restcountries.com/): country data
- [TheMealDB](https://www.themealdb.com/api.php): recipes
- [JokeAPI](https://jokeapi.dev/): jokes (keep it appropriate)
- [Open Trivia DB](https://opentdb.com/api_config.php): trivia questions

---

## Stretch Goals

- Add client-side filtering or sorting of fetched results
- Save user favorites to `localStorage`
- Fetch from two different APIs and combine the data

---

## Submission Checklist

- [ ] Site fetches and displays real data from a public API
- [ ] At least one interactive element updates the page dynamically
- [ ] Errors and loading states are handled
- [ ] Code is pushed to a public GitHub repo
- [ ] Site is live on GitHub Pages
- [ ] Project README includes the live URL, names the API(s) used, and explains what the site does
