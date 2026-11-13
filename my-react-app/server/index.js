
import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Automatically identify the most likely category
function categorizeEvent(text) {
  const value = text.toLowerCase();

  if (
    /video game|gaming|nintendo|playstation|xbox|game boy|arcade game|sega/.test(value)
  ) {
    return "Gaming";
  }

  if (
    /automobile|car manufacturer|motor vehicle|ford motor|ferrari|volkswagen|toyota|tesla motors|car company/.test(value)
  ) {
    return "Automobiles";
  }

  if (
    /nasa|moon landing|spacecraft|astronaut|satellite|mars|apollo|planet|telescope|astronomy|space station/.test(value)
  ) {
    return "Science & Space";
  }

  if (
    /computer|internet|software|artificial intelligence|technology|robot|microprocessor|world wide web|smartphone/.test(value)
  ) {
    return "Technology";
  }

  if (
    /film|movie|cinema|television|music|album|singer|actor|actress|hollywood|animation/.test(value)
  ) {
    return "Entertainment";
  }

  return "World History";
}

// Test the backend
app.get("/", (req, res) => {
  res.send("TIMEVERSE free history backend is running!");
});

// Retrieve historical events, births and deaths
app.post("/api/events", async (req, res) => {
  try {
    const { date } = req.body;

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        error: "Please provide a date in YYYY-MM-DD format."
      });
    }

    const [, month, day] = date.split("-");

    const baseUrl =
      "https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday";

    const recordTypes = ["events", "births", "deaths"];

    const results = await Promise.all(
      recordTypes.map(async (type) => {
        const response = await fetch(
          `${baseUrl}/${type}/${month}/${day}`
        );

        if (!response.ok) {
          throw new Error(`Wikimedia ${type} request failed`);
        }

        return {
          type,
          data: await response.json()
        };
      })
    );

    const events = [];

    for (const result of results) {
      const records = result.data[result.type] || [];

      for (const event of records) {
        const description =
          event.pages?.[0]?.extract || event.text;

        const category = categorizeEvent(
          `${event.text} ${description}`
        );

        let title = event.text;

        if (result.type === "births") {
          title = `Birth: ${event.text}`;
        } else if (result.type === "deaths") {
          title = `Death: ${event.text}`;
        }

        events.push({
          id: `${result.type}-${event.year}-${events.length}`,
          title,
          description,
          category,
          type: result.type,
          year: event.year,
          date: `${event.year}-${month}-${day}`,
          time: "Unknown",
          timeAccuracy: "unknown",
          source:
            event.pages?.[0]?.content_urls?.desktop?.page || ""
        });
      }
    }

    // Sort newest to oldest
    events.sort((a, b) => b.year - a.year);

    res.json({
      requestedDate: date,
      totalEvents: events.length,
      events
    });

  } catch (error) {
    console.error("TIMEVERSE error:", error.message);

    res.status(500).json({
      error: "Unable to retrieve historical events."
    });
  }
});


// TIMEVERSE AI — Connect to local Ollama / Qwen
app.post("/api/ai", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "Please provide a question."
      });
    }

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
       model: "qwen2.5:3b",
stream: false,
options: {
  num_predict: 512
},
messages: [
          {
            role: "system",
            content: `You are TIMEVERSE AI, a historical discovery assistant.

Help users explore world history, science, space, technology, gaming, sports, automobiles and important people.

Be clear and informative.
Never invent dates, events or facts.
If you are uncertain, say so.
Distinguish confirmed historical events from planned future events.
Do not pretend that an answer has been verified by a source.`
          },
          {
            role: "user",
            content: question.trim()
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error("Ollama could not generate a response.");
    }

    const data = await response.json();

    res.json({
      answer: data.message?.content || "I couldn't generate an answer."
    });

  } catch (error) {
    console.error("TIMEVERSE AI error:", error.message);

    res.status(500).json({
      error: "TIMEVERSE AI is currently unavailable. Check that Ollama is running."
    });
  }
});

app.listen(PORT, () => {
  console.log(
    `TIMEVERSE backend running at http://localhost:${PORT}`
  );
});
