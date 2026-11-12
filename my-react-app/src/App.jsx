
import { useState } from "react";
import "./App.css";

const categories = [
  { icon: "🏢", name: "Companies", description: "Explore the history of companies and brands." },
  { icon: "🎮", name: "Video Games", description: "Discover games, studios and gaming milestones." },
  { icon: "🚗", name: "Cars & Models", description: "Explore automotive history and iconic vehicles." },
  { icon: "💻", name: "Technology", description: "Discover inventions and technological breakthroughs." },
  { icon: "🪐", name: "Space & Planets", description: "Explore planets, stars and the universe." },
  { icon: "🏛️", name: "Civilizations", description: "Travel through ancient civilizations and history." },
];

function App() {
  const [search, setSearch] = useState("");

  function explore() {
    if (!search.trim()) {
      alert("Please enter something to explore!");
      return;
    }

    alert(`TIMEVERSE search: ${search}`);
  }

  return (
    <main>
      <nav className="navbar">
        <h1>TIME<span>VERSE</span></h1>
        <a href="#calendar">Calendar Explorer ↗</a>
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

      <section className="categories">
        <h2>Explore the Universe</h2>
        <p className="section-subtitle">
          Choose something that interests you.
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

      <section className="calendar" id="calendar">
        <p className="tagline">TRAVEL THROUGH TIME</p>
        <h2>What happened on your date?</h2>
        <p>
          Explore historical events, discoveries and milestones
          from any date in history.
        </p>

        <button onClick={() => alert("Calendar Explorer coming next!")}>
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
