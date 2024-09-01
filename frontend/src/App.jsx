import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={<DashboardWrapper />}
        />
      </Routes>
    </Router>
    </>
  );
}

// Wrapper component for Dashboard to handle token logic
function DashboardWrapper() {
  const query = useQuery();
  const accessToken = query.get('access_token');

  return accessToken ? <Dashboard accessToken={accessToken} /> : <Login />;
}

export default App;
