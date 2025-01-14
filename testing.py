import asyncio
from playwright.async_api import async_playwright, Playwright
from bs4 import BeautifulSoup

async def run(playwright: Playwright):
    chromium = playwright.chromium # or "firefox" or "webkit".
    browser = await chromium.launch(headless=False)
    page = await browser.new_page()
    await page.goto("https://www.nytimes.com/2025/01/14/us/politics/michelle-obama-trump-inauguration.html")
    await page.wait_for_timeout(1000)
    soup = BeautifulSoup(await page.content(), 'lxml')
    # title_element = await page.query_selector("title")
    # title_text = await title_element.inner_text()
    title = soup.title.string
    print(title)
    await browser.close()

async def main():
    async with async_playwright() as playwright:
        await run(playwright)
asyncio.run(main())