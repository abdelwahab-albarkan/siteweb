import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Concert.css";

const Can = () => {
  const [events, setEvents] = useState([]); // Liste des événements
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true); // Afficher le loading
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data.slice(0, 4)); // Limiter à 4 événements seulement
        setLoading(false); // Fin du loading
      } catch (error) {
        console.error("Erreur lors de la récupération des événements :", error);
        setLoading(false); // Fin du loading en cas d'erreur
      }
    };

    fetchEvents(); // Charger les événements au premier rendu
  }, []); // Se lance une seule fois lors du premier rendu

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="concert-container1">
      <h1 className="concert-title1">Les nouveauté </h1>
      <div className="concert-grid">
        {events.map((event) => (
          <div className="concert-card" key={event._id}>
            <img
              src={`http://localhost:5000/${event.image}`} // Assure-toi que les images existent sur le serveur
              className="concert-image"
              alt={event.name}
            />
            <div className="concert-info">
              <div className="concert-title-small">{event.name}</div>
              <div className="concert-lieu">📆 {event.date}</div>
              <div className="concert-lieu">📍 {event.location}</div>
              
              <div className="concert-price">
                À partir de <span className="static-price">{event.price} MAD</span>
              </div>
            </div>
            <button className="buy-ticket-btn1">Acheter</button>
          </div>
        ))}
      </div>
      <div className="voir-plus-container">
        <a href="/concerts-page" className="voir-plus-btn">
          Voir plus
        </a>
      </div>
    </div>
  );
};

export default Can;
