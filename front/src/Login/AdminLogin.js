import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminLogin.css";  // Importation du fichier CSS

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/admin/verify", {
        email,
        password,
      });

      // Si l'admin est trouvé, rediriger vers la page dashboard
      if (response.data.message === "Admin found") {
        alert("Login successful!");
        navigate("/dashboard");
      }
    } catch (error) {
      alert("Erreur : " + (error.response?.data?.error || "Problème de connexion"));
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2 className="login-title">Login Admin</h2>
        <form onSubmit={handleLogin} className="login-form">
          <div className="input-container">
            <input
              type="email"
              className="login-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              className="login-input"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
