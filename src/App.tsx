import React, { useState } from "react";
import "./App.css";
import FixedBottomNavigation from "./components/test";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

const App: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState(false);
  const [type, setType] = useState(0);

  const theme = createTheme({
    palette: {
      mode: mode ? "dark" : "light",
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(e.target);
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:8000/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: url, type: type }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error fetching summary:", error);
      setSummary(`Error: ${error.message}`); //("Error: Enter a Valid URL or try the Text version");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
        <h1>TLDR</h1>
        <form onSubmit={handleSubmit}>
          {type == 0 ? (
            <TextField
              id="outlined-basic"
              label="Enter a URL"
              variant="standard"
              placeholder="Enter website URL"
              onChange={(e) => setUrl(e.target.value)}
              sx={{
                width: "30vh",
              }}
            />
          ) : type == 1 ? (
            <TextField
              id="standard-textarea"
              label="Enter some Text"
              placeholder="Text"
              multiline
              variant="standard"
              onChange={(e) => setUrl(e.target.value)}
              sx={{
                width: "50vw",
              }}
            />
          ) : (
            <p>Youtube coming soon</p>
          )}
          <Button
            loading={loading}
            type="submit"
            variant="text"
            sx={{
              color: mode ? "white" : "black",
              borderColor: mode ? "white" : "black",
              "&:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          >
            Summarize
          </Button>
        </form>
        <FixedBottomNavigation
          mode={mode}
          setMode={setMode}
          type={type}
          setType={setType}
        />
        {loading && <p>Loading...</p>}
        {summary && <div className="summary">{summary}</div>}
      </div>
    </ThemeProvider>
  );
};

export default App;
