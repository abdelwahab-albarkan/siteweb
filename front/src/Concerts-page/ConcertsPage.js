import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../tooter/Footer";
import Navbar from "../nav-bar/Navbar";
import "./ConcertPage.css";
import { FaFilter, FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';

const ConcertPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    date: '',
    location: '',
    priceRange: [0, 5000]
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError("Failed to load events. Please try again later.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceChange = (index, value) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(value);
    setFilters(prev => ({
      ...prev,
      priceRange: newPriceRange
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      date: '',
      location: '',
      priceRange: [0, 5000]
    });
  };

  const filteredEvents = events.filter(event => {
    return (
      event.name.toLowerCase().includes(filters.search.toLowerCase()) &&
      (filters.date === '' || new Date(event.date).toLocaleDateString('fr-FR') === filters.date) &&
      (filters.location === '' || event.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      (event.price >= filters.priceRange[0] && event.price <= filters.priceRange[1])
    );
  });

  const uniqueDates = [...new Set(events.map(event => new Date(event.date).toLocaleDateString('fr-FR')))];
  const uniqueLocations = [...new Set(events.map(event => event.location))];

  if (loading) {
    return (
      <div className="events-loading">
        <div className="spinner"></div>
        <p>Chargement des événements...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="events-error">
        <p>{error}</p>
        <button 
          className="retry-btn"
          onClick={() => window.location.reload()}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="events-page">
      <Navbar />
      
      <main className="events-container">
        <header className="events-header">
          <h1 className="events-title">Nos Événements</h1>
          <p className="events-subtitle">Découvrez des expériences inoubliables</p>
        </header>

        {/* Filtres Section */}
        <div className="filters-section">
         

          <button 
            className="toggle-filters-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter /> {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
          </button>

          {showFilters && (
            <div className="filters-container">
              <div className="filter-group">
                <label><FaCalendarAlt /> Date :</label>
                <select 
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                >
                  <option value="">Toutes les dates</option>
                  {uniqueDates.map((date, index) => (
                    <option key={index} value={date}>{date}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label><FaMapMarkerAlt /> Lieu :</label>
                <select 
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                >
                  <option value="">Tous les lieux</option>
                  {uniqueLocations.map((location, index) => (
                    <option key={index} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group price-filter">
                <label><FaMoneyBillWave /> Prix : {filters.priceRange[0]} MAD - {filters.priceRange[1]} MAD</label>
                <div className="range-inputs">
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={filters.priceRange[0]}
                    onChange={(e) => handlePriceChange(0, e.target.value)}
                  />
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(1, e.target.value)}
                  />
                </div>
              </div>

              <button 
                className="reset-filters-btn"
                onClick={resetFilters}
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>

        {filteredEvents.length > 0 ? (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <article key={event._id} className="event-card">
                <div className="event-image-container">
                  <img
                    src={`http://localhost:5000/${event.image}`}
                    alt={event.name}
                    className="event-image11"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Event+Image';
                    }}
                  />
                  <span className="event-category">CONCERT</span>
                </div>
                
                <div className="event-details">
                  <h2 className="event-name">{event.name}</h2>
                  
                  <div className="event-meta">
                    <div className="meta-item">
                      <span className="meta-icon">📅</span>
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="meta-item">
                      <span className="meta-icon">📍</span>
                      <span>{event.location}</span>
                    </div>
                  </div>
                  
                  <div className="event-price">
                    <span>À partir de </span>
                    <span className="price-value">{event.price} MAD</span>
                  </div>
                  
                  <button className="event-btn">Réserver</button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="no-events">
            <p>Aucun événement ne correspond à vos critères de recherche</p>
            <button 
              className="reset-filters-btn"
              onClick={resetFilters}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ConcertPage;
