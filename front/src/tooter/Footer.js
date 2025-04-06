import { Link } from "react-router-dom";
import "./Footer.css";
import { 
  FaFacebookF, 
  FaTwitter, 
  FaWhatsapp, 
  FaInstagram, 
  FaEnvelope, 
  FaPhone,
  FaApple,
  FaGooglePlay 
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-main">
          <div className="footer-brand">
            <h2 className="footer-logo-text">Wri<span>9a</span></h2>
            <p className="footer-description">
              Une plateforme de billetterie nouvelle génération pour des expériences événementielles mémorables.
            </p>
            
            <div className="app-download">
              <h4>Téléchargez notre application</h4>
              <div className="download-buttons">
                <a href="#" className="app-button ios-button">
                  <FaApple className="app-icon" />
                  <div className="button-text">
                    <span>Disponible sur</span>
                    <strong>App Store</strong>
                  </div>
                </a>
                <a href="#" className="app-button android-button">
                  <FaGooglePlay className="app-icon" />
                  <div className="button-text">
                    <span>Disponible sur</span>
                    <strong>Google Play</strong>
                  </div>
                </a>
              </div>
            </div>

            <div className="footer-social">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FaFacebookF />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <FaTwitter />
              </a>
              <a href="https://wa.me/212600000000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <FaWhatsapp />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FaInstagram />
              </a>
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3 className="footer-title">Navigation</h3>
              <ul className="footer-list">
                <li><Link to="/">Accueil</Link></li>
                <li><Link to="/concerts-page">Concerts</Link></li>
                <li><Link to="/can-page">CAN 2025</Link></li>
                <li><Link to="/about">À propos</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Légal</h3>
              <ul className="footer-list">
                <li><Link to="/privacy">Politique de confidentialité</Link></li>
                <li><Link to="/terms">Conditions générales</Link></li>
                <li><Link to="/cookies">Préférences cookies</Link></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">Contact</h3>
              <ul className="footer-list">
                <li>
                  <FaEnvelope className="contact-icon" />
                  <a href="mailto:support@billetterie.com">support@Wri9a.com</a>
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <a href="tel:+212600000000">+212 6 00 00 00 00</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            © {new Date().getFullYear()} Wri9a. Tous droits réservés.
          </p>
          <div className="payment-methods">
            <span>Paiements sécurisés:</span>
            <div className="payment-icons">
              <span className="payment-icon visa">Visa</span>
              <span className="payment-icon mastercard">Mastercard</span>
              <span className="payment-icon paypal">PayPal</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}