import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import About from './components/About'
import Contact from './components/Contact'
import TestPage from './pages/TestPage'
import Uzv from './components/Uzv'
import Events from './components/Events'
import EventsDetail from './components/EventsDetail'
import Gallery from './components/Gallery'
import Blog from './components/Blog'
import BlogDetail from './components/BlogDetail'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/test" element={<TestPage />} />
          <Route path="/" element={
            <>
              <Header showTopImage={false} />
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
              <Footer />
            </>
          } />
          <Route path="/about" element={
            <>
              <Header showTopImage={true} />
              <About />
              <Footer />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Header showTopImage={true} />
              <Contact />
              <Footer />
            </>
          } />
          <Route path="/uzv" element={
            <>
              <Header showTopImage={true} />
              <Uzv />
              <Footer />
            </>
          } />
          <Route path="/events" element={
            <>
              <Header showTopImage={true} />
              <Events />
              <Footer />
            </>
          } />
          <Route path="/event/:id" element={
            <>
              <Header showTopImage={true} />
              <EventsDetail />
              <Footer />
            </>
          } />
          <Route path="/gallery" element={
            <>
              <Header showTopImage={true} />
              <Gallery />
              <Footer />
            </>
          } />
          <Route path="/blog" element={
            <>
              <Header showTopImage={true} />
              <Blog />
              <Footer />
            </>
          } />
          <Route path="/blog/:id" element={
            <>
              <Header showTopImage={true} />
              <BlogDetail />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  )
}

export default App
