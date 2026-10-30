import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CreateMysteryPage from './pages/CreateMysteryPage';
import InvestigationPage from './pages/InvestigationPage';
import AccusationPage from './pages/AccusationPage';
import ResultsPage from './pages/ResultsPage';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-noir-950 text-slate-100">
        <Navbar />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/create" element={<CreateMysteryPage />} />
            <Route path="/cases/:id" element={<InvestigationPage />} />
            <Route path="/cases/:id/accuse" element={<AccusationPage />} />
            <Route path="/cases/:id/results" element={<ResultsPage />} />
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}
