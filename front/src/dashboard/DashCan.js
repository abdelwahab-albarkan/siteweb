import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiArrowLeftStartOnRectangle } from "react-icons/hi2";
import "./MatchesTable.css";

const MatchesTable = () => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const goBack = () => navigate("/dashboard");

  useEffect(() => {
    const getMatches = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/matches");
        const data = await response.json();
        setMatches(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getMatches();
  }, []);

  const deleteMatch = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce match ?")) {
      try {
        await fetch(`http://localhost:5000/api/matches/${id}`, {
          method: "DELETE",
        });
        setMatches(matches.filter(match => match._id !== id));
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="matches-loading-screen">
        <div className="matches-loading-spinner"></div>
        <p>Chargement des matchs...</p>
      </div>
    );
  }

  return (
    <section className="matches-management">
      <header className="matches-header">
        <h1 className="matches-title">
          <span className="matches-icon">⚽</span>
          Gestion des Matchs
        </h1>
        
        <div className="matches-actions">
          <Link 
            to="/addmatch" 
            className="matches-add-btn action-btn"
          >
            <span className="action-btn-icon">+</span>
            Ajouter un Match
          </Link>
          
          <button 
            onClick={goBack} 
            className="matches-back-btn action-btn"
          >
            <HiArrowLeftStartOnRectangle className="action-btn-icon" />
            Retour
          </button>
        </div>
      </header>

      <div className="matches-table-container">
        <table className="matches-data-table">
          <thead className="matches-table-header">
            <tr>
              <th className="matches-table-column">ID</th>
              <th className="matches-table-column">Affiche</th>
              <th className="matches-table-column">Équipes</th>
              <th className="matches-table-column">Date</th>
              <th className="matches-table-column">Heure</th>
              <th className="matches-table-column">Stade</th>
              <th className="matches-table-column">Prix</th>
              <th className="matches-table-column">Actions</th>
            </tr>
          </thead>
          
          <tbody className="matches-table-body">
            {matches.map(match => (
              <tr key={match._id} className="matches-table-row">
                <td className="matches-table-data match-id">{match._id}</td>
                
                <td className="matches-table-data match-poster">
                  <img
                    src={`http://localhost:5000/${match.image}`}
                    alt={`Affiche ${match.teams}`}
                    className="match-poster-image"
                    loading="lazy"
                  />
                </td>
                
                <td className="matches-table-data match-teams">{match.teams}</td>
                <td className="matches-table-data match-date">
                  {new Date(match.date).toLocaleDateString()}
                </td>
                <td className="matches-table-data match-time">{match.time}</td>
                <td className="matches-table-data match-location">{match.location}</td>
                <td className="matches-table-data match-price">{match.price} DH</td>
                
                <td className="matches-table-data match-actions">
                  <button
                    onClick={() => deleteMatch(match._id)}
                    className="match-delete-action action-btn danger"
                  >
                    <span className="action-btn-icon">🗑</span>
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MatchesTable;