
import AnimationSettings from "./AnimationSettings.jsx";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Calendar from "./pages/Calendar";
import "./App.css";

const categories = [
  { icon: "🏢", name: "Companies", description: "Explore the history of companies and brands." },
  { icon: "🎮", name: "Video Games", description: "Discover games, studios and gaming milestones." },
  { icon: "🚗", name: "Cars & Models", description: "Explore automotive history and iconic vehicles." },
  { icon: "💻", name: "Technology", description: "Discover inventions and technological breakthroughs." },
  { icon: "🪐", name: "Space & Planets", description: "Explore planets, stars and the universe." },
  { icon: "🏛️", name: "Civilizations", description: "Travel through ancient civilizations and history." },
];

// Quick shortcuts into Calendar Explorer
const timeCategories = [
  { icon: "🌍", name: "All", description: "Explore everything that happened." },
  { icon: "🏛️", name: "World History", description: "Wars, civilizations and historic events." },
  { icon: "🚀", name: "Science & Space", description: "Discoveries and space missions." },
  { icon: "💻", name: "Technology", description: "Inventions and technological milestones." },
  { icon: "🎮", name: "Gaming", description: "Games, consoles and gaming history." },
  { icon: "🏆", name: "Sports", description: "Matches, tournaments and sporting records." },
  { icon: "🚘", name: "Automobiles", description: "Cars, launches and automotive milestones." },
  { icon: "🎬", name: "Entertainment", description: "Movies, music and television." },
  { icon: "💡", name: "Inventions & Discoveries", description: "Ideas that changed the world." },
  { icon: "🎂", name: "Births", description: "Discover notable people born on this date." },
  { icon: "🕯️", name: "Deaths", description: "Remember notable people who died on this date." },
];

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [question, setQuestion] = useState("");
const [answer, setAnswer] = useState("");
const [aiLoading, setAiLoading] = useState(false);
const [aiError, setAiError] = useState("");


if (location.pathname === "/calendar") {
  return <Calendar />;
}

if (location.pathname === "/ai") {
  return (
    <main key={location.pathname} className="ai-page">
     <nav className="navbar">
  <h1>
    TIME<span>VERSE</span>
  </h1>


<div className="page-nav-links">
  <button onClick={() => navigate("/")}>
    Home
  </button>

  <button className="active-page" onClick={() => navigate("/ai")}>
    TIMEVERSE AI
  </button>

  <button onClick={() => navigate("/calendar")}>
    Calendar Explorer
  </button>
</div>

<AnimationSettings />
</nav>


      <section className="ai-container">
        <p className="tagline">YOUR HISTORICAL DISCOVERY ASSISTANT</p>

        <h2>
          Ask the <span>Universe.</span>
        </h2>

        <p>
          Explore history, gaming, technology, science,
          space and everything in between.
        </p>

        {/* FIRST ROW — THREE CARDS */}

        <div className="ai-suggestions">

         <button onClick={() => setQuestion("Explain the evolution of video games and GTA VI.")}>
  <span className="suggestion-label">Gaming</span>
  <strong>Gaming History</strong>
  <p>Explore games, consoles and gaming milestones.</p>
  <span className="suggestion-arrow">→</span>
</button>

          <button onClick={() => setQuestion("Explain the history of space exploration.")}>
            <span className="suggestion-label">Science & Space</span>
            <strong>Explore the Universe</strong>
            <p>Discover planets, missions and breakthroughs.</p>
            <span className="suggestion-arrow">→</span>
          </button>

          <button onClick={() => setQuestion("Explain the evolution of technology.")}>
            <span className="suggestion-label">Technology</span>
            <strong>Technology Through Time</strong>
            <p>Explore inventions and innovations.</p>
            <span className="suggestion-arrow">→</span>
          </button>

        </div>

        {/* QUESTION BOX */}

        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What would you like to discover?"
        />
          {/* SECOND ROW — THREE CARDS */}

        <div className="ai-suggestions">

          <button onClick={() => setQuestion("Explain the most important events in world history.")}>
            <span className="suggestion-label">World History</span>
            <strong>Explore Civilizations</strong>
            <p>Discover empires, revolutions and historic events.</p>
            <span className="suggestion-arrow">→</span>
          </button>

          <button onClick={() => setQuestion("Tell me about notable births and deaths throughout history.")}>
            <span className="suggestion-label">People</span>
            <strong>Births & Deaths</strong>
            <p>Discover influential people throughout history.</p>
            <span className="suggestion-arrow">→</span>
          </button>

          <button onClick={() => setQuestion("Explain important inventions and discoveries throughout history.")}>
            <span className="suggestion-label">Discoveries</span>
            <strong>Inventions & Discoveries</strong>
            <p>Explore breakthroughs that shaped humanity.</p>
            <span className="suggestion-arrow">→</span>
          </button>

                </div>

        {/* ASK BUTTON — BELOW ALL SIX CARDS */}

        <button
          className="ai-submit-button"
          onClick={askAI}
          disabled={aiLoading}
        >
          {aiLoading ? "Thinking..." : "Ask TIMEVERSE AI →"}
        </button>

        {aiLoading && <p>TIMEVERSE AI is thinking...</p>}
        {aiError && <p>{aiError}</p>}

        {answer && (
          <div className="ai-answer">
            <h3>TIMEVERSE AI says:</h3>
            <p>{answer}</p>
          </div>
        )}

      </section>
    </main>
  );
}

   function explore() {
    if (!search.trim()) {
      alert("Please enter something to explore!");
      return;
    }

    alert(`TIMEVERSE search: ${search}`);
  }
  async function askAI() {
  if (!question.trim()) {
    return;
  }

  setAiLoading(true);
  setAnswer("");
  setAiError("");

  try {
    const response = await fetch("http://localhost:3001/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong.");
    }

    setAnswer(data.answer);
  } catch (error) {
    setAiError(error.message);
  } finally {
    setAiLoading(false);
  }
}

  function openTimeCategory(category) {
    navigate(`/calendar?category=${encodeURIComponent(category)}`);
  }

  return (
    <main key={location.pathname}>
      <nav className="navbar">
        <h1>TIME<span>VERSE</span></h1>
        
<div className="page-nav-links">
  <button className="active-page" onClick={() => navigate("/")}>
    Home
  </button>

  <button onClick={() => navigate("/ai")}>
    TIMEVERSE AI
  </button>

  <button onClick={() => navigate("/calendar")}>
    Calendar Explorer
  </button>
</div>
<AnimationSettings />
      </nav>

      <section className="hero">
        <p className="tagline">YOUR UNIVERSE OF DISCOVERY</p>

        <h2>
          Explore Everything.
          <br />
          <span>Discover When.</span>
        </h2>

        <p className="subtitle">
          Explore the history of anything.
          Travel through billions of years.
        </p>

        <div className="search-box">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && explore()}
            placeholder="Search Tesla, Minecraft, Earth..."
          />
          <button onClick={explore}>Explore →</button>
        </div>
      </section>

      {/* QUICK TIME MACHINE SHORTCUTS */}

      <section className="quick-time">
        <h2>Explore History by Interest</h2>
        <p className="section-subtitle">
          Interested in one subject? Jump straight into its history.
        </p>

        <div className="grid">
          {timeCategories.map((category) => (
            <button
              className="category"
              key={category.name}
              onClick={() => openTimeCategory(category.name)}
            >
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name === "All" ? "Everything" : category.name}</h3>
              <p>{category.description}</p>
              <span>Explore history →</span>
            </button>
          ))}
        </div>
      </section>

      {/* EXPLORE ENTITIES */}

      <section className="categories">
        <h2>Explore the Universe</h2>
        <p className="section-subtitle">
          Explore the history of companies, games, cars and more.
        </p>

        <div className="grid">
          {categories.map((category) => (
            <button
              className="category"
              key={category.name}
              onClick={() => setSearch(category.name)}
            >
              <span className="category-icon">{category.icon}</span>
              <h3>{category.name}</h3>
              <p>{category.description}</p>
            </button>
          ))}
        </div>
      </section>

      {/* CALENDAR PROMOTION */}

      <section className="calendar" id="calendar">
        <p className="tagline">TRAVEL THROUGH TIME</p>
        <h2>What happened on your date?</h2>
        <p>
          Explore historical events, discoveries and milestones
          from any date in history.
        </p>

        <button onClick={() => navigate("/calendar")}>
          Open Calendar Explorer →
        </button>
      </section>

      <footer>
        TIMEVERSE © 2026 — Explore the history of everything.
      </footer>
    </main>
  );
}

export default App;

