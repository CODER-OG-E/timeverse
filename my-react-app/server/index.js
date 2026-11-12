
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("TIMEVERSE free history backend is running!");
});

app.post("/api/events", async (req, res) => {
  try {
    const { date, topic } = req.body;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        error: "Please provide a valid date (YYYY-MM-DD).",
      });
    }

    const [, month, day] = date.split("-");

    const response = await fetch(
      `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${month}/${day}`
    );

    if (!response.ok) {
      throw new Error(`Wikimedia returned status ${response.status}`);
    }

    const data = await response.json();

    const events = (data.events || []).map((event) => ({
      title: event.text,
      description: event.pages?.[0]?.extract || event.text,
      category: "World History",
      year: event.year,
      date: `${event.year}-${month}-${day}`,
      time: "Unknown",
      timeAccuracy: "unknown",
      source: event.pages?.[0]?.content_urls?.desktop?.page || "",
    }));

    res.json({
      requestedDate: date,
      topic: topic || "All",
      totalEvents: events.length,
      events,
    });
  } catch (error) {
    console.error("TIMEVERSE error:", error.message);

    res.status(500).json({
      error: "Unable to retrieve historical events.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`TIMEVERSE backend running at http://localhost:${PORT}`);
});
