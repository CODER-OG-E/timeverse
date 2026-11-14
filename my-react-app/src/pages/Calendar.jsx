
import AnimationSettings from "../AnimationSettings.jsx";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import "./Calendar.css";

const months = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

const categories = [
  "All",
  "World History",
  "Science & Space",
  "Technology",
  "Gaming",
  "Sports",
  "Automobiles",
  "Entertainment",
  "Inventions & Discoveries",
  "Births",
  "Deaths"
];

function getDaysInMonth(month, year) {
  const leapYear =
    year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);

  if (month === 2) return leapYear ? 29 : 28;

  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function Calendar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [day, setDay] = useState(20);
  const [month, setMonth] = useState(7);
  const [year, setYear] = useState(1969);

  const [searchParams, setSearchParams] = useSearchParams();

const requestedCategory = searchParams.get("category") || "All";

const [selectedCategory, setSelectedCategory] =
  useState(requestedCategory);

useEffect(() => {
  const validCategory = categories.includes(requestedCategory)
    ? requestedCategory
    : "All";

  setSelectedCategory(validCategory);
}, [requestedCategory]);
  const [searched, setSearched] = useState(false);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const daysInMonth = getDaysInMonth(month, year);

  const dateKey = [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0")
  ].join("-");

  const selectedDate = `${day} ${months[month - 1]} ${year}`;

 const matchingEvents = events.filter((event) => {
  if (selectedCategory === "All") {
    return true;
  }

  if (selectedCategory === "Births") {
    return event.type === "births";
  }

  if (selectedCategory === "Deaths") {
    return event.type === "deaths";
  }

  return event.category === selectedCategory;
});

 

async function travelThroughTime() {
  setSearched(true);
  setLoading(true);
  setError("");
  setEvents([]);

  try {
    const response = await fetch("http://localhost:3001/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        date: dateKey
      })
    });

    if (!response.ok) {
      throw new Error("The history service could not retrieve events.");
    }

    const data = await response.json();
    setEvents(data.events || []);

  } catch (err) {
    console.error("TIMEVERSE error:", err);
    setError(
      "We couldn't retrieve historical events. Please check that the backend is running and try again."
    );
  } finally {
    setLoading(false);
  }
}

  function handleMonthChange(value) {
    setMonth(value);
    setDay((currentDay) =>
      Math.min(currentDay, getDaysInMonth(value, year))
    );
    setSearched(false);
  }

  function handleYearChange(value) {
    setYear(value);
    setDay((currentDay) =>
      Math.min(currentDay, getDaysInMonth(month, value))
    );
    setSearched(false);
  }

  function handleDayChange(value) {
    setDay(value);
    setSearched(false);
  }

  return (
    <main key={location.pathname} className="calendar-page">

      {/* NAVIGATION */}

      <nav className="calendar-nav">
  <a href="/" className="calendar-logo">
    TIME<span>VERSE</span>
  </a>

  <div className="calendar-nav-links">
  <button onClick={() => navigate("/")}>
    Home
  </button>

  <button onClick={() => navigate("/ai")}>
    TIMEVERSE AI
  </button>

  <button
    className="active-page"
    onClick={() => navigate("/calendar")}
  >
    Calendar Explorer
  </button>
</div>

<AnimationSettings />
</nav>

      {/* HERO */}

      <section className="time-hero">
        <div className="time-badge">
          ✦ YOUR JOURNEY THROUGH TIME
        </div>

        <h1>
          Every moment has
          <br />
          <span>a story to tell.</span>
        </h1>

        <p>
          Choose a date. Discover its history.
          Explore the moments that shaped our world.
        </p>
      </section>

      {/* DATE SELECTOR */}

      <section className="time-machine">
        <div className="machine-heading">
          <span>01 / SELECT YOUR DESTINATION</span>
          <h2>Where in time do you want to go?</h2>
          <p>Select a date to begin your journey.</p>
        </div>

        <div className="date-selectors">

          <div className="date-field">
            <label htmlFor="day">DAY</label>
            <select
              id="day"
              value={day}
              onChange={(e) => handleDayChange(Number(e.target.value))}
            >
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                (number) => (
                  <option key={number} value={number}>
                    {String(number).padStart(2, "0")}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="date-field month-field">
            <label htmlFor="month">MONTH</label>
            <select
              id="month"
              value={month}
              onChange={(e) => handleMonthChange(Number(e.target.value))}
            >
              {months.map((name, index) => (
                <option key={name} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div className="date-field">
            <label htmlFor="year">YEAR</label>
            <select
              id="year"
              value={year}
              onChange={(e) => handleYearChange(Number(e.target.value))}
            >
              {Array.from({ length: 2028 }, (_, i) => 2028 - i).map(
                (number) => (
                  <option key={number} value={number}>
                    {number}
                  </option>
                )
              )}
            </select>
          </div>

        </div>

        <button
          className="travel-button"
          onClick={travelThroughTime}
          disabled={loading}
        >
          {loading ? "✦ EXPLORING HISTORY..." : "✦ TRAVEL THROUGH TIME →"}
        </button>

        <p className="machine-note">
          Currently exploring recorded calendar history.
          Deep Time exploration will be a separate experience.
        </p>
      </section>

      {/* RESULTS */}

      {searched && (
        <section className="timeline-section">

          <div className="timeline-heading">
            <span>02 / YOUR DESTINATION</span>
            <h2>{selectedDate}</h2>
            <p>Here's what TIMEVERSE discovered on this date.</p>
          </div>

          {loading && (
            <div className="empty-results">
              <h3>Travelling through time...</h3>
              <p>Searching historical records. This may take a moment.</p>
            </div>
          )}

          {error && (
            <div className="empty-results">
              <h3>Something went wrong</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && events.length > 0 && (
            <>
              <div className="category-filters">
  {categories.map((category) => (
    <button
      key={category}
      className={
        selectedCategory === category ? "filter-active" : ""
      }
      onClick={() => {
        setSelectedCategory(category);
        setSearchParams({ category });
      }}
    >
      {category}
    </button>
  ))}
</div>

              <p>
                Found <strong>{matchingEvents.length}</strong> historical
                events.
              </p>

              <div className="timeline-list">
                {matchingEvents.map((event, index) => (
                  <article
                    className="event-card"
                    key={`${event.year}-${index}`}
                  >
                    <div className="event-icon">🌍</div>

                    <div className="event-content">
                      <span className="event-category">
                        {event.category}
                      </span>

                      <h3>{event.title}</h3>

                      <p>{event.description}</p>

                      {event.source && (
                        <a
                          className="event-source"
                          href={event.source}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Read source ↗
                        </a>
                      )}
                    </div>

                    <span className="event-year">{event.year}</span>
                  </article>
                ))}
              </div>
            </>
          )}

          {!loading && !error && events.length === 0 && (
            <div className="empty-results">
              <span>🔭</span>
              <h3>No historical events found.</h3>
              <p>
                We couldn't find events for this date in our current
                historical source. Try another date.
              </p>
            </div>
          )}

          <p className="data-disclaimer">
            Historical information is provided by Wikimedia.
            This collection may be incomplete.
          </p>

        </section>
      )}

      {/* FOOTER */}

      <footer className="calendar-footer">
        TIMEVERSE © 2026 — Every moment has a story.
      </footer>

    </main>
  );
}

export default Calendar;
