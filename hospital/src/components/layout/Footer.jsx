import React from 'react'
import './Footer.css'
import footerLeft from '../../assets/footer-left.png'
import footerRight from '../../assets/footer-right.png'
import logoFooter from '../../assets/logo-footer.png'
import facebook from '../../assets/facebook.png'
import instagram from '../../assets/instagram.png'
import linkedin from '../../assets/linkedin.png'
import youtube from '../../assets/youtube.png'
import telegram from '../../assets/telegram.png'

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
                        <a href="/" className="footer-link">Ana səhifə</a>
                        <a href="/about" className="footer-link">Haqqımızda</a>
                        <a href="/events" className="footer-link">Tədbirlər</a>
                        <a href="/members" className="footer-link">Üzv</a>
                        <a href="/gallery" className="footer-link">Qalereya</a>
                        <a href="/blog" className="footer-link">Blog</a>
                        <a href="/contact" className="footer-link">Contact</a>
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
                    <div className="footer-copyright">
                        <div className="footer-copyright-line"></div>
                        <div className="footer-copyright-content">
                            <div className="footer-copyright-left">
                                Veb-sayt Webonly tərəfindən hazırlanıb.
                            </div>
                            <div className="footer-copyright-right">
                                Copywrite @2025. Bütün hüquqlar qorunur. AHBPCA
                            </div>
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
