import { useState } from "react";
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
  "Automobiles",
  "Entertainment"
];

// Our first curated historical event.
// We will connect a larger historical dataset later.
const historicalEvents = [
  {
    date: "1969-07-20",
    title: "Apollo 11 lands on the Moon",
    category: "Science & Space",
    year: "1969",
    description:
      "Neil Armstrong and Buzz Aldrin became the first humans to walk on the Moon during NASA's Apollo 11 mission.",
    icon: "🌕",
    source: "NASA"
  }
];

function getDaysInMonth(month, year) {
  const leapYear =
    year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0);

  if (month === 2) return leapYear ? 29 : 28;

  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function Calendar() {
  const [day, setDay] = useState(20);
  const [month, setMonth] = useState(7);
  const [year, setYear] = useState(1969);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searched, setSearched] = useState(false);

  const daysInMonth = getDaysInMonth(month, year);

  const dateKey = [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0")
  ].join("-");

  const selectedDate = `${day} ${months[month - 1]} ${year}`;

  const matchingEvents = historicalEvents.filter((event) => {
    const matchesDate = event.date === dateKey;

    const matchesCategory =
      selectedCategory === "All" ||
      event.category === selectedCategory;

    return matchesDate && matchesCategory;
  });

  function travelThroughTime() {
    setSearched(true);
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
    <main className="calendar-page">

      {/* NAVIGATION */}

      <nav className="calendar-nav">
        <a href="/" className="calendar-logo">
          TIME<span>VERSE</span>
        </a>

        <div className="calendar-nav-links">
          <a href="/">Home</a>
          <span className="active-link">Calendar Explorer</span>
        </div>
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
        >
          ✦ TRAVEL THROUGH TIME →
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
            <p>Here's what TIMEVERSE currently knows about this date.</p>
          </div>

          <div className="category-filters">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category ? "filter-active" : ""
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {matchingEvents.length > 0 ? (
            <div className="timeline-list">

              {matchingEvents.map((event) => (
                <article className="event-card" key={event.date}>
                  <div className="event-icon">{event.icon}</div>

                  <div className="event-content">
                    <span className="event-category">
                      {event.category}
                    </span>

                    <h3>{event.title}</h3>

                    <p>{event.description}</p>

                    <span className="event-source">
                      Source: {event.source}
                    </span>
                  </div>

                  <span className="event-year">{event.year}</span>
                </article>
              ))}

            </div>
          ) : (
            <div className="empty-results">
              <span>🔭</span>
              <h3>No curated events found yet.</h3>
              <p>
                Our historical collection is still growing.
                Try 20 July 1969 to explore our first historical event.
              </p>
            </div>
          )}

          <p className="data-disclaimer">
            This is an early demonstration dataset, not a complete
            historical record.
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