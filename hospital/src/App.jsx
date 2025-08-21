import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Contact from './components/Contact'
import TestPage from './pages/TestPage'
import Uzv from './components/Uzv'
import Events from './components/Events'
import Gallery from './components/Gallery'
import Blog from './components/Blog'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Simple page routing based on URL
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/about') {
      setCurrentPage('about');
    } else if (path === '/contact') {
      setCurrentPage('contact');
    } else if (path === '/test') {
      setCurrentPage('test');
    } else if (path === '/uzv') {
      setCurrentPage('uzv');
    } else if (path === '/events') {
      setCurrentPage('events');
    } else if (path === '/gallery') {
      setCurrentPage('gallery');
    } else if (path === '/blog') {
      setCurrentPage('blog');
    } else {
      setCurrentPage('home');
    }
  }, []);

  const handlePageChange = (pageId) => {
    setCurrentPage(pageId);
    // Update URL for better UX
    if (pageId === 'home') {
      window.history.pushState({}, '', '/');
    } else if (pageId === 'events') {
      window.history.pushState({}, '', '/events');
    } else if (pageId === 'gallery') {
      window.history.pushState({}, '', '/gallery');
    } else if (pageId === 'blog') {
      window.history.pushState({}, '', '/blog');
    } else {
      window.history.pushState({}, '', `/${pageId}`);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'uzv':
        return <Uzv />;
      case 'events':
        return <Events />;
      case 'gallery':
        return <Gallery />;
      case 'blog':
        return <Blog />;
      case 'test':
        return <TestPage />;
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
      {currentPage === 'test' ? (
        <TestPage />
      ) : (
        <>
          <Header onPageChange={handlePageChange} showTopImage={currentPage === 'about' || currentPage === 'contact' || currentPage === 'uzv' || currentPage === 'events' || currentPage === 'gallery' || currentPage === 'blog'} />
          {renderPage()}
          <Footer />
        </>
      )}
    </>
  )
}

export default App
