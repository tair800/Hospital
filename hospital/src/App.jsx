import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import TestPage from './pages/TestPage'
import Employee from './components/Employee'
import EmployeeDetail from './components/EmployeeDetail'
import Events from './components/Events'
import EventsDetail from './components/EventsDetail'
import Gallery from './components/Gallery'
import Blog from './components/Blog'
import BlogDetail from './components/BlogDetail'
import Dashboard from './pages/admin/Dashboard'
import AdminHome from './pages/admin/AdminHome'
import AdminAbout from './pages/admin/AdminAbout'
import AdminContact from './pages/admin/AdminContact'
import AdminBlog from './pages/admin/AdminBlog'
import AdminEvents from './pages/admin/AdminEvents'
import AdminSponsors from './pages/admin/AdminSponsors'
import AdminGallery from './pages/admin/AdminGallery'
import AdminLayout from './pages/admin/AdminLayout'
import employeeDetailBg from './assets/employee-detail-bg.png'
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
              <Home />
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
          <Route path="/employee" element={
            <>
              <Header showTopImage={true} />
              <Employee />
              <Footer />
            </>
          } />
          <Route path="/employee/:id" element={
            <>
              <Header showTopImage={false} />
              <EmployeeDetail />
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
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="sponsors" element={<AdminSponsors />} />
            <Route path="gallery" element={<AdminGallery />} />
          </Route>
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
