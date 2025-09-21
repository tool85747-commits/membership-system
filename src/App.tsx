import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CustomerPage } from './components/CustomerPage';
import { AdminConsole } from './components/AdminConsole';
import { GlobalProvider } from './context/GlobalContext';
import './index.css';

function App() {
  return (
    <GlobalProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Routes>
            <Route path="/card" element={<CustomerPage />} />
            <Route path="/card/:token" element={<CustomerPage />} />
            <Route path="/admin" element={<AdminConsole />} />
            <Route path="/" element={<CustomerPage />} />
          </Routes>
        </div>
      </Router>
    </GlobalProvider>
  );
}

export default App;