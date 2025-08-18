import React from 'react'
import './Footer.css'
import footerLeft from '../assets/footer-left.png'
import footerRight from '../assets/footer-right.png'
import logoFooter from '../assets/logo-footer.png'
import facebook from '../assets/facebook.png'
import instagram from '../assets/instagram.png'
import linkedin from '../assets/linkedin.png'
import youtube from '../assets/youtube.png'
import telegram from '../assets/telegram.png'

function Footer() {
    return (
        <footer>
            <div className="footer-content">
                <div className="footer-left">
                    <img src={footerLeft} alt="Footer Left Image" />
                </div>
                <div className="footer-center">
                    <div className="footer-logo">
                        <img src={logoFooter} alt="Footer Logo" />
                    </div>
                    <div className="footer-navigation">
                        <span>Ana səhifə</span>
                        <span>Tədbirlər</span>
                        <span>Üzv</span>
                        <span>Qalereya</span>
                        <span>Blog</span>
                        <span>Contact</span>
                    </div>
                    <div className="social-media-icons">
                        <div className="social-icon">
                            <img src={facebook} alt="Facebook" />
                        </div>
                        <div className="social-icon">
                            <img src={instagram} alt="Instagram" />
                        </div>
                        <div className="social-icon">
                            <img src={linkedin} alt="LinkedIn" />
                        </div>
                        <div className="social-icon">
                            <img src={youtube} alt="YouTube" />
                        </div>
                        <div className="social-icon">
                            <img src={telegram} alt="Telegram" />
                        </div>
                    </div>
                </div>
                <div className="footer-right">
                    <img src={footerRight} alt="Footer Right Image" />
                </div>
            </div>
        </footer>
    )
}

export default Footer
