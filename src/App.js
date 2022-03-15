import './App.css';
import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router'
import LoginPage from './pages/LoginPage';
import MoviePage from './pages/MoviePage';
import MainNavigation from './components/MainNavigation';
import SignupPage from './pages/SignupPage';
import AccountPage from './pages/AccountPage';



function App() {

  return (
    <div>
      <MainNavigation />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/movie" element={<MoviePage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </div>
  );
}

export default App;
