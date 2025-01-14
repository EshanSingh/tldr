import React, { useState } from "react";

const App: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const response = await fetch("http://127.0.0.1:8000/summarize", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ url }),
  //     });
  //     console.log(response);
  //     const data = await response.json();
  //     console.log(data);
  //     setSummary(data.summary);
  //   } catch (error) {
  //     console.error("Error fetching summary:", error);
  //     setSummary("An error occurred.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummary(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>Website Summarizer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
          required
        />
        <button type="submit">Summarize</button>
      </form>
      {loading && <p>Loading...</p>}
      {summary && <div className="summary">{summary}</div>}
    </div>
  );
};

export default App;
