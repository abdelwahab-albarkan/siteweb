import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiArrowLeftStartOnRectangle } from "react-icons/hi2";
import "./EventsTable.css";

const EventsTable = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleBack = () => navigate("/dashboard");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/events");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Erreur:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Confirmez la suppression de cet événement ?")) {
      try {
        await fetch(`http://localhost:5000/api/events/${id}`, {
          method: "DELETE",
        });
        setEvents(events.filter((event) => event._id !== id));
      } catch (err) {
        console.error("Erreur:", err);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="events-loading">
        <div className="events-spinner"></div>
        <p>Chargement des événements...</p>
      </div>
    );
  }

  return (
    <div className="events-admin">
      <header className="events-admin-header">
        <h1 className="events-admin-title">
          <span className="events-icon">🎤</span>
          Gestion des Événements
        </h1>
        
        <div className="events-admin-actions">
          <Link to="/addmusic" className="events-add-button action-button primary">
            <span className="button-icon">+</span>
            Nouvel Événement
          </Link>
          <button 
            className="events-back-button action-button secondary"
            onClick={handleBack}
          >
            <HiArrowLeftStartOnRectangle className="button-icon" />
            Retour
          </button>
        </div>
      </header>

      <div className="events-table-container">
        <table className="events-data-table">
          <thead className="events-table-head">
            <tr>
              <th className="events-table-header">ID</th>
              <th className="events-table-header">Image</th>
              <th className="events-table-header">Nom</th>
              <th className="events-table-header">Lieu</th>
              <th className="events-table-header">Date</th>
              <th className="events-table-header">Prix</th>
              <th className="events-table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="events-table-body">
            {events.map((event) => (
              <tr key={event._id} className="events-table-row">
                <td className="events-table-data event-id">{event._id}</td>
                <td className="events-table-data event-image-cell">
                  <img
                    src={`http://localhost:5000/${event.image}`}
                    alt={event.name}
                    className="event-image"
                    loading="lazy"
                  />
                </td>
                <td className="events-table-data event-name">{event.name}</td>
                <td className="events-table-data event-location">{event.location}</td>
                <td className="events-table-data event-date">
                  {new Date(event.date).toLocaleDateString()}
                </td>
                <td className="events-table-data event-price">{event.price} DH</td>
                <td className="events-table-data event-actions">
                  <button
                    className="event-delete-button action-button danger"
                    onClick={() => handleDelete(event._id)}
                  >
                    <span className="button-icon">🗑</span>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventsTable;