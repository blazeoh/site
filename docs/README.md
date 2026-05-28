# Offline Mode & API Keys Safety

This folder supports offline mode via a service worker for GitHub Pages.
**Do not include sensitive API keys anywhere in the source files or frontend code.**

- If public keys (for Algolia, etc.) are needed, use environment variable placeholders and replace them during local builds/deployment.
- For private keys or secrets, always route calls through a secure backend. Never expose them in static files or client-side JavaScript.

For more, see: [GitHub Pages security docs](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages#security).
