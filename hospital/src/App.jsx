import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Simple page routing based on URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/about') {
      setCurrentPage('about');
    } else {
      setCurrentPage('home');
    }
  }, []);

  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
    // Update URL for better UX
    if (pageId === 'home') {
      window.history.pushState({}, '', '/');
    } else {
      window.history.pushState({}, '', `/${pageId}`);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />;
      default:
        return (
          <main>
            <h2>Welcome to Our Hospital</h2>
            <p>Providing quality healthcare services to our community.</p>
            <div>
              <h3>Our Services</h3>
              <ul>
                <li>Emergency Care</li>
                <li>Surgery</li>
                <li>Pediatrics</li>
                <li>Cardiology</li>
                <li>Neurology</li>
              </ul>
            </div>
          </main>
        );
    }
  };

  return (
    <>
      <Header onPageChange={handlePageChange} showTopImage={currentPage === 'about'} />
      {renderPage()}
      <Footer />
    </>
  )
}

export default App
