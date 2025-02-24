import React, { useState } from "react";
import "./App.css";

function App() {
  const [links, setLinks] = useState(""); // Stores the input links
  const [loading, setLoading] = useState(false); // Loading state for the button

  const handleLinksChange = (event) => {
    setLinks(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!links.trim()) {
      alert("Please provide solicitation links.");
      return;
    }

    setLoading(true); // Set loading state to true while waiting for the response

    try {
      // Send a POST request to the Flask backend
      const response = await fetch(`${process.env.REACT_APP_API_URL}/scrape`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ links: links.split("\n") }), // Split input into an array of links
      });

      if (response.ok) {
        // Create a Blob from the response (Excel file)
        const blob = await response.blob();
        // Create a URL for the Blob and trigger the download
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = "solicitations.xlsx"; // Set the download filename
        a.click();
        // Clean up the object URL after the download is triggered
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        alert("Failed to scrape data. Please try again.");
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false); // Reset loading state after the process is complete
    }
  };

  return (
    <div className="App">
      <h1>Solicitation Scraper</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="5"
          cols="40"
          placeholder="Paste solicitation links here (one per line)"
          value={links}
          onChange={handleLinksChange}
        />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Downloading..." : "Scrape and Download Excel"}
        </button>
      </form>
    </div>
  );
}

export default App;
