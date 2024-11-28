import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/icones/logo.png'; // Assurez-vous que le chemin du logo est correct
import { KeyIcon, Lock, LogIn } from 'lucide-react';

export default function Login() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/agents/login', { login, password });
      console.log(response.data);
    
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        // Sauvegarder les permissions dans le local storage
        if (response.data.permissions) {
          const permissions = JSON.stringify(response.data.permissions);
          localStorage.setItem('permissions', permissions);
        }

        if(response.data.isAdmin){
          localStorage.setItem('isAdmin', response.data.isAdmin);
        }

        if (response.data.profilName) {
          localStorage.setItem('profilName', response.data.profilName);
        }

        if (response.data.firstName) {
          localStorage.setItem('firstName', response.data.firstName);
        }

        if (response.data.lastName) {
          localStorage.setItem('lastName', response.data.lastName);
        }

        if (response.data.role) {
          localStorage.setItem('role', response.data.role);
        }

        if (response.data.service) {
          localStorage.setItem('service', response.data.service);
        }

        if (response.data.serviceId) {
          localStorage.setItem('serviceId', response.data.serviceId);
        }

        const isAdmin = response.data.role.trim() === 'admin';
        if (isAdmin) {
          navigate('/app-archive');
        } else {
          navigate('/agents');
        }
      } else {
        setError('Identifiants incorrects');
      }
    } catch (error) {
      setError('Erreur lors de la connexion');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-400 via-gray-600 to-gray-800 animate-fade-in">
      <img src={logo} alt="Logo" className="absolute p-3 bg-white rounded-full top-10 left-10 w-32 h-32 transform transition duration-500 hover:scale-110" />
      <div className="w-full max-w-md p-10 space-y-8 bg-white shadow-2xl rounded-xl transform transition duration-500 hover:scale-105">
        <h2 className="text-4xl  font-extrabold text-center text-gray-800">
          
          Connexion</h2>
        {error && <p className="text-center text-red-500">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center justify-start text-sm font-medium text-gray-700">
            <KeyIcon className="w-4 h-4 mr-2" />
              Login</label>
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>
          <div>
            <label className=" flex items-center justify-start text-sm font-medium text-gray-700">
              <Lock className="w-4 h-4 mr-2" />
              Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-indigo-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 flex items-center justify-center text-lg font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-indigo-200 transition duration-300 ease-in-out transform hover:scale-105"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
