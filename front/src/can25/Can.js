import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Can.css";

const Can = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState({});

  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:5000/api/matches");
        const matchesData = response.data.slice(0, 12);
        setMatches(matchesData);
        
        // Initialiser le compte à rebours pour chaque match
        const initialTimeRemaining = {};
        matchesData.forEach(match => {
          initialTimeRemaining[match._id] = calculateTimeRemaining(match.date);
        });
        setTimeRemaining(initialTimeRemaining);
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des matchs :", error);
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  // Mettre à jour le compte à rebours chaque seconde
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const updated = {};
        Object.keys(prev).forEach(matchId => {
          const match = matches.find(m => m._id === matchId);
          if (match) {
            updated[matchId] = calculateTimeRemaining(match.date);
          }
        });
        return updated;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [matches]);

  // Calculer le temps restant
  const calculateTimeRemaining = (matchDate) => {
    const now = new Date();
    const matchTime = new Date(matchDate);
    const diff = matchTime - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, isPast: false };
  };

  // Formater le compte à rebours
  const formatCountdown = (countdown) => {
    if (countdown.isPast) {
      return <span className="match-stadium">Match terminé</span>;
    }

    return (
      <div className="match-countdown">
        <div className="countdown-item">{countdown.days}j</div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">{countdown.hours}h</div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">{countdown.minutes}m</div>
        <div className="countdown-separator">:</div>
        <div className="countdown-item">{countdown.seconds}s</div>
      </div>
    );
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="can25-container">
      <h1 className="can25-title">Can 25</h1>
      <div className="can25-grid">
        {matches.map((match) => (
          <div className="match-card" key={match._id}>
            <img
              src={`http://localhost:5000/${match.image}`}
              className="match-image"
              alt={match.teams}
            />
            <div className="match-info">
              <div className="match-teams">{match.teams}</div>
              
              {/* Remplacez l'affichage de la date par le compte à rebours */}
              {timeRemaining[match._id] && formatCountdown(timeRemaining[match._id])}
              
              <div className="match-stadium">⏱️ {match.time}</div>
              <div className="match-stadium">📍 {match.location}</div>
              <div className="match-price">
                À partir de <span className="static-price">{match.price} MAD</span>
              </div>
            </div>
            <button className="buy-ticket-btn1">Acheter</button>
          </div>
        ))}
      </div>
      <div className="voir-plus-container">
        <a href="/can-page" className="voir-plus-btn">
          Voir plus
        </a>
      </div>
    </div>
  );
};

export default Can;