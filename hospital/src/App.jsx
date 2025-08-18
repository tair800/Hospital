import React from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <>
      <Header />
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
  )
}

export default App
