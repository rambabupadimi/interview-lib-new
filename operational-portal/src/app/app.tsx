// Uncomment this line to use CSS modules
// import styles from './app.module.css';
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginComponent from './login';

export function App() {
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={<LoginComponent />}
        />
        <Route
          path="/dashboard"
          element={
            <div>
              <h1>Dashboard</h1>
              <p>Welcome to the dashboard!</p>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
