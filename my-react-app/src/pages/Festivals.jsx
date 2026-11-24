
import React, { useState } from 'react';
import './Festivals.css';

function Festivals() {
  const [activeSection, setActiveSection] = useState('discover');

  const sections = [
    { id: 'discover', label: 'Discover' },
    { id: 'explore', label: 'Explore' },
    { id: 'organise', label: 'Organise' },
  ];

  return (
    <main className="festivals-page">
      <header className="festivals-header">
        <div className="festivals-brand">
          TIMEVERSE <span>FESTIVALS</span>
        </div>

        <nav className="festivals-navigation">
          {sections.map((section) => (
            <button
              key={section.id}
              className={
                activeSection === section.id ? 'active' : ''
              }
              onClick={() => setActiveSection(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </header>

      <section className="festivals-hero">
        <p className="festivals-eyebrow">
          CELEBRATIONS CONNECT US
        </p>

        <h1>
          Discover the world's
          <br />
          festivals and traditions.
        </h1>

        <p className="festivals-description">
          Explore celebrations across cultures, discover their
          histories and bring communities together.
        </p>
      </section>

      <section className="festivals-content">
        {activeSection === 'discover' && (
          <div>
            <h2>Discover Festivals</h2>
            <p>
              Find upcoming festivals, celebrations and events
              from around the world.
            </p>
          </div>
        )}

        {activeSection === 'explore' && (
          <div>
            <h2>Explore Traditions</h2>
            <p>
              Discover festival origins, cultural traditions
              and how celebrations have evolved over time.
            </p>
          </div>
        )}

        {activeSection === 'organise' && (
          <div>
            <h2>Organise Your Festival</h2>
            <p>
              Plan celebrations, coordinate your community
              and find local festival services.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Festivals;
