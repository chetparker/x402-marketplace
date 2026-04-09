import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import AboutPage from './pages/AboutPage.jsx'
import PricingPage from './pages/PricingPage.jsx'
import CalculatorPage from './pages/CalculatorPage.jsx'
import BlogIndex from './pages/BlogIndex.jsx'
import BlogPost from './pages/BlogPost.jsx'
import ForAPIProviders from './pages/ForAPIProviders.jsx'
import ForAIAgents from './pages/ForAIAgents.jsx'
import ForDevelopers from './pages/ForDevelopers.jsx'
import ForEnterprise from './pages/ForEnterprise.jsx'

document.body.style.margin = '0'
document.body.style.padding = '0'
document.body.style.background = '#06080D'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/providers" element={<ForAPIProviders />} />
          <Route path="/agents" element={<ForAIAgents />} />
          <Route path="/developers" element={<ForDevelopers />} />
          <Route path="/enterprises" element={<ForEnterprise />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
