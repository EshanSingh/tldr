# from fastapi import FastAPI, HTTPException
# from pydantic import BaseModel
# import requests
# from bs4 import BeautifulSoup
# from sumy.parsers.html import HtmlParser
# from sumy.nlp.tokenizers import Tokenizer
# from sumy.summarizers.lsa import LsaSummarizer
# import nltk

# # Ensure 'punkt' tokenizer is available
# nltk.download("punkt")

# app = FastAPI()

# class SummarizeRequest(BaseModel):
#     url: str

# @app.post("/summarize")
# async def summarize(request: SummarizeRequest):
#     try:
#         # Fetch and parse the webpage
#         response = requests.get(request.url, timeout=10)
#         response.raise_for_status()
#         html_content = response.text

#         # Extract content and summarize
#         parser = HtmlParser.from_string(html_content, request.url, Tokenizer("english"))
#         summarizer = LsaSummarizer()
#         summary = summarizer(parser.document, 5)  # Generate a 5-sentence summary
#         return {"summary": " ".join(str(sentence) for sentence in summary)}

#     except requests.exceptions.RequestException as e:
#         raise HTTPException(status_code=400, detail=f"Error fetching URL: {str(e)}")
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Server Error: {str(e)}")
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

class URLRequest(BaseModel):
    url: str
    length: int = 5


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React frontend origin (adjust if needed)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


@app.post("/summary/")
async def summarize(request:URLRequest):
    header = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'}

    response = requests.get(request.url, timeout=10, headers=header)
    print(response)

    html = response.text
    summarizer = pipeline(task='summarization', model="sshleifer/distilbart-cnn-12-6")

    soup = BeautifulSoup(html, "lxml")
    for a in soup.find_all("a", href=True):
        a.extract()

    def clean_text(text):
        cleantext = re.sub(r"[\r\n\t]", " ", text)
        cleantext = re.sub(r"[^\x00-\x7F]+", " ", cleantext)  # Remove non-ASCII characters
        return  re.sub(r"\s+", " ", cleantext).strip() 
    
    cleaned_text = clean_text(soup.text)
    l = 0
    r = 0
    summary = ""
    while r < len(cleaned_text):
        r+=3600
        res = summarizer(cleaned_text[l:r], max_length=130,min_length=30,do_sample=False)
        summary += res[0]['summary_text']
        l = r
    
    return {"summary": summary}

