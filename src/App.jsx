import React, { useState, useEffect } from "react";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    body: "",
  });
  const [importantEntries, setImportantEntries] = useState(new Set());

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Failed to fetch entries");
        }
        const data = await response.json();
        setEntries(data);
      } catch (error) {
        console.error("Error fetching entries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          body: formData.body,
          userId: 1, 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create entry");
      }

      const newEntry = await response.json();
      setEntries((prev) => [newEntry, ...prev]);
      setFormData({ title: "", body: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating entry:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleImportant = (id) => {
    const newImportantEntries = new Set(importantEntries);
    if (newImportantEntries.has(id)) {
      newImportantEntries.delete(id);
    } else {
      newImportantEntries.add(id);
    }
    setImportantEntries(newImportantEntries);
  };

  return (
    <div className="journal-app">
      <h1>My Journal</h1>

      <button
        onClick={() => setShowForm(!showForm)}
        className="toggle-form-btn"
      >
        {showForm ? "Hide Form" : "Create New Entry"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="entry-form">
          <div>
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="body">Content:</label>
            <textarea
              id="body"
              name="body"
              value={formData.body}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}

      {loading && entries.length === 0 ? (
        <div className="loading">Loading entries...</div>
      ) : (
        <div className="entries-list">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`entry ${
                importantEntries.has(entry.id) ? "important" : ""
              }`}
            >
              <h3>{entry.title}</h3>
              <p>{entry.body}</p>
              <button
                onClick={() => toggleImportant(entry.id)}
                className="important-btn"
              >
                {importantEntries.has(entry.id)
                  ? "★ Important"
                  : "☆ Mark as Important"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;