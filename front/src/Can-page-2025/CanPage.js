import React, { useState, useRef, useEffect } from "react";
import './CanPage.css';
import { FaFilter } from 'react-icons/fa';
import Footer from "../tooter/Footer";
import Navbar from "../nav-bar/Navbar";

export default function CanPage() {
  const [showFilters, setShowFilters] = useState(false); // State for toggling filters visibility
  const [selectedDate, setSelectedDate] = useState(''); // Filter by date
  const [selectedLocation, setSelectedLocation] = useState(''); // Filter by location
  const [priceRange, setPriceRange] = useState([0, 5000]); // Filter by price
  const [uniqueDates, setUniqueDates] = useState([]); // Store unique dates
  const [uniqueLocations, setUniqueLocations] = useState([]); // Store unique locations
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the matches data
  useEffect(() => {
    fetch("http://localhost:5000/api/matches")
      .then((res) => res.json())
      .then((data) => {
        setMatches(data);
        setLoading(false);

        // Extract unique dates and locations for the filters
        const dates = [...new Set(data.map((match) => new Date(match.date).toLocaleDateString()))];
        const locations = [...new Set(data.map((match) => match.location))];

        setUniqueDates(dates);
        setUniqueLocations(locations);
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des matchs :", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <Navbar />

      {/* Section vidéo */}
      <div className="video-container">
        <video
          className="video-player"
          controls
          autoPlay
          preload="metadata"
          poster="/images/video-poster.jpg"
        >
          <source src="/video/can25.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Section Filtres */}
      <div className="filters-section">
        <button
          className="toggle-filters-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FaFilter /> {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        </button>

        {showFilters && (
          <div className="filters-container">
            {/* Filtre par date */}
            <div className="filter-group">
              <label htmlFor="date-filter">Date :</label>
              <select
                id="date-filter"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              >
                <option value="">Toutes les dates</option>
                {uniqueDates.map((date, index) => (
                  <option key={index} value={date}>
                    {date}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par lieu */}
            <div className="filter-group">
              <label htmlFor="location-filter">Lieu :</label>
              <select
                id="location-filter"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Tous les stades</option>
                {uniqueLocations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Filtre par prix */}
            <div className="filter-group">
              <label>
                Prix : {priceRange[0]} MAD - {priceRange[1]} MAD
              </label>
              <div className="price-range-slider">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                />
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                />
              </div>
            </div>

            <button
              className="reset-filters-btn"
              onClick={() => {
                setSelectedDate('');
                setSelectedLocation('');
                setPriceRange([0, 5000]);
              }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Section des matchs */}
      <div className="can25-container">
        <h1 className="can25-title">Can 25</h1>
        <div className="can25-grid">
          {matches
            .filter((match) => {
              const matchDate = new Date(match.date).toLocaleDateString();
              const matchLocation = match.location;
              const matchPrice = match.price;

              // Apply date filter
              const isDateValid = selectedDate ? matchDate === selectedDate : true;
              // Apply location filter
              const isLocationValid = selectedLocation ? matchLocation === selectedLocation : true;
              // Apply price filter
              const isPriceValid =
                matchPrice >= priceRange[0] && matchPrice <= priceRange[1];

              return isDateValid && isLocationValid && isPriceValid;
            })
            .map((match) => {
              return (
                <div className="match-card" key={match._id}>
                  <img src={`http://localhost:5000/${match.image}`} className="match-image" />
                  <div className="match-info">
                    <div className="match-teams">{match.teams}</div>
                    <div className="match-stadium">📆 {new Date(match.date).toLocaleDateString()}</div>
                    <div className="match-teams">⏱️ {match.time}</div>
                    <div className="match-stadium">📍 {match.location}</div>
                    <div className="match-price">
                      À partir de <span className="static-price">{match.price} MAD</span>
                    </div>
                  </div>
                  <button className="buy-ticket-btn1">Acheter</button>
                </div>
              );
            })}
        </div>
        <div className="voir-plus-container">
          <a href="/can-page" className="voir-plus-btn">
            Voir plus
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}
