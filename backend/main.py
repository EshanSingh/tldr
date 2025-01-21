import asyncio
import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import re
from bs4 import BeautifulSoup
from transformers import pipeline
import httpx
from dotenv import load_dotenv

load_dotenv()
app = FastAPI()

class Request(BaseModel):
    input: str
    type: int = 0


app.add_middleware(
    CORSMiddleware,
   allow_origins=[
        "http://localhost:5173",  # Local development
        "https://tldr-eshan.vercel.app",  # Primary production URL
        "https://tldr-eshan-eshans-projects-26b5c58e.vercel.app",  # Vercel environment-specific URL
        "https://tldr-eshan-git-main-eshans-projects-26b5c58e.vercel.app",  # Vercel branch-specific URL
        "https://beautiful-education-production.up.railway.app",  # Backend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
API_KEY = os.getenv("HF_API_KEY")

headers = {
    "Authorization": f"Bearer {API_KEY}"
}

async def summarize_text_async(text):
    async with httpx.AsyncClient(timeout=100.0) as client:
        payload = {
            "inputs": text,
            "parameters": {
                "max_length": 130,
                "min_length": 30,
                "do_sample": False
            }
        }
        try:
            response = await client.post(API_URL, headers=headers, json=payload)
            response.raise_for_status()  # Raises an HTTPError if response code is 4xx or 5xx
            
            json_response = response.json()
            if isinstance(json_response, list) and 'summary_text' in json_response[0]:
                return json_response[0]['summary_text']
            else:
                return "[Invalid response format]"
        
        except httpx.TimeoutException:
            print("Request timed out. Retrying...")
            await asyncio.sleep(10)  # Wait before retrying
            return await summarize_text_async(text)
        
        except httpx.HTTPStatusError as e:
            print(f"HTTP error: {e.response.status_code}")
            return "[HTTP error encountered]"
        
        except Exception as e:
            print(f"Unexpected error: {str(e)}")
            return "[Unexpected error]"

async def summarize_text_with_retry(text, max_retries=3):
    for attempt in range(max_retries):
        result = await summarize_text_async(text)
        if result and "[Summary Error]" not in result:
            return result
        print(f"Retrying... ({attempt + 1}/{max_retries})")
        await asyncio.sleep(10)  # Wait before retrying
    return "[Failed after multiple retries]"


@app.post("/summary/")
async def summarize(request:Request):

    if request.type == 0:
        header = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'}

        # response = requests.get(request.input, timeout=10, headers=header)
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(request.input, timeout=10, headers=header)
                response.raise_for_status()
            except httpx.HTTPError as e:
                raise HTTPException(status_code=400, detail=f"Error fetching URL: {str(e)}")
        html = response.text

        soup = BeautifulSoup(html, "lxml")
        for a in soup.find_all("a", href=True):
            a.extract()

        def clean_text(text):
            cleantext = re.sub(r"[\r\n\t]", " ", text)
            cleantext = re.sub(r"[^\x00-\x7F]+", " ", cleantext)  # Remove non-ASCII characters
            return  re.sub(r"\s+", " ", cleantext).strip() 
        
        text = clean_text(soup.text)

    elif request.type == 1:
        text = request.input


    l = 0
    r = 0
    summary = ""
    while r < len(text):
        r+=3600

        res = await summarize_text_with_retry(text[l:r])
        
        if res is not None:
            summary += res + " "
        else:
            summary += " [Summary Error] "
        
        l = r
        
    return {"summary": summary}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))  # Use PORT environment variable or default to 8000
    uvicorn.run("main:app", host="0.0.0.0", port=port)
