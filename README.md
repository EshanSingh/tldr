# TLDR (Too Long Didn't Read)

tldr: summarizes websites or any text you want, youtube in development

---

Tired of having to read huge articles to only note a few key takeaways?

No need to worry, simply enter the URL or text of what you want to summarize and tldr will handle the rest

Currently Supports

- URLs (all domains)
- Text
- Youtube (IN DEVELOPMENT)

## What was used

The frontend hosts a minmalist UI for easier usage and shorter load-times

Build with:

- React
- Vite
- TypeScript
- MaterialUI

Hosted on:

- Vercel

The backend scrapes the designated website and gathers the text, chunks the text into smaller contexts to enable faster load-times and generate more accurate summaries

Built with:

- FastAPI
- BeautifulSoup
- HuggingFace
- Python

Hosted on:

- Railways
