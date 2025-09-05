import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  Header,
  Footer,
  ScrollToTop,
  ProtectedRoute,
  EmployeeDetail,
  EventsDetail,
  BlogDetail
} from './components'
import {
  HomePage,
  AboutPage,
  EventsPage,
  GalleryPage,
  BlogPage,
  EmployeePage,
  ContactPage,
  Error404
} from './pages'
import Dashboard from './pages/admin/Dashboard'
import AdminHome from './pages/admin/AdminHome'
import AdminAbout from './pages/admin/AdminAbout'
import AdminContact from './pages/admin/AdminContact'
import AdminBlog from './pages/admin/AdminBlog'
import AdminEvents from './pages/admin/AdminEvents'
import AdminSponsors from './pages/admin/AdminSponsors'
import AdminGallery from './pages/admin/AdminGallery'
import AdminEmployee from './pages/admin/AdminEmployee'
import AdminRequests from './pages/admin/AdminRequests'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'

import './App.css'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="App">
        <Routes>

          <Route path="/" element={
            <>
              <Header showTopImage={false} />
              <HomePage />
              <Footer />
            </>
          } />
          <Route path="/about" element={
            <>
              <Header showTopImage={true} />
              <AboutPage />
              <Footer />
            </>
          } />
          <Route path="/contact" element={
            <>
              <Header showTopImage={true} />
              <ContactPage />
              <Footer />
            </>
          } />
          <Route path="/employee" element={
            <>
              <Header showTopImage={true} />
              <EmployeePage />
              <Footer />
            </>
          } />
          <Route path="/employee/:id" element={
            <>
              <Header showTopImage={false} hidePageName={true} />
              <EmployeeDetail />
              <Footer />
            </>
          } />
          <Route path="/events" element={
            <>
              <Header showTopImage={true} />
              <EventsPage />
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
              <GalleryPage />
              <Footer />
            </>
          } />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="home" element={<AdminHome />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="sponsors" element={<AdminSponsors />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="employee" element={<AdminEmployee />} />
            <Route path="requests" element={<AdminRequests />} />
          </Route>
          <Route path="/blog" element={
            <>
              <Header showTopImage={true} />
              <BlogPage />
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
          <Route path="*" element={<Error404 />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
