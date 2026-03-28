import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddProduct from './components/AddProduct';
import EditProduct from './components/EditProduct';
import Login from './components/Login';
import Register from './components/Register';
import Chatbot from './components/Chatbot';
import { getUserRole } from './services/api';
import './App.css';

// Enhanced Route Protection with Roles
const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userRole = getUserRole();

  if (!token) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="app-container">
                <Sidebar />
                <main className="content-area">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route
                      path="/add"
                      element={
                        <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                          <AddProduct />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/edit/:id"
                      element={
                        <PrivateRoute allowedRoles={['ADMIN', 'MANAGER']}>
                          <EditProduct />
                        </PrivateRoute>
                      }
                    />
                  </Routes>
                </main>
                <Chatbot />
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
