import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
import re
from bs4 import BeautifulSoup
from transformers import pipeline

app = FastAPI()

class Item(BaseModel):
    name: str
    description: str | None = None
    price: float
    tax: float | None = None

class Request(BaseModel):
    input: str
    type: int = 0


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173","https://eshan-tldr.vercel.app/"],  # React frontend origin (adjust if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.post("/summary/")
async def summarize(request:Request):

    if request.type == 0:
        header = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'}

        response = requests.get(request.input, timeout=10, headers=header)

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


    summarizer = pipeline(task='summarization', model="sshleifer/distilbart-cnn-12-6")
    l = 0
    r = 0
    summary = ""
    while r < len(text):
        r+=3600
        res = summarizer(text[l:r], max_length=130,min_length=30,do_sample=False)
        summary += res[0]['summary_text']
        l = r
        
    return {"summary": summary}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))  # Use PORT environment variable or default to 8000
    uvicorn.run("main:app", host="0.0.0.0", port=port)
