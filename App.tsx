import React, { useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, AppContext } from './context/AppContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import Results from './pages/Results';
import Details from './pages/Details';
import CookingMode from './pages/CookingMode';
import Planner from './pages/Planner';
import Pantry from './pages/Pantry';
import Profile from './pages/Profile';
import History from './pages/History';
import ShoppingList from './pages/ShoppingList';
import ShoppingAssistant from './pages/ShoppingAssistant';
import AdminPanel from './pages/AdminPanel';

// FIX: Added explicit type for children prop to resolve TS errors.
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { user, isInitialLoading } = useContext(AppContext);
  const location = useLocation();

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// FIX: Added explicit type for children prop to resolve TS errors.
const AdminRoute = ({ children }: { children: React.ReactElement }) => {
    const { user, isInitialLoading } = useContext(AppContext);
    const location = useLocation();

    if (isInitialLoading) {
        return <div className="flex items-center justify-center min-h-screen"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout>
                  <Home />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route path="/results" element={<ProtectedRoute><Layout><Results /></Layout></ProtectedRoute>} />
          <Route path="/details/:id" element={<ProtectedRoute><Layout><Details /></Layout></ProtectedRoute>} />
          <Route path="/cooking/:id" element={<ProtectedRoute><CookingMode /></ProtectedRoute>} />
          <Route path="/planner" element={<ProtectedRoute><Layout><Planner /></Layout></ProtectedRoute>} />
          <Route path="/pantry" element={<ProtectedRoute><Layout><Pantry /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><Layout><History /></Layout></ProtectedRoute>} />
          <Route path="/shopping-list" element={<ProtectedRoute><Layout><ShoppingList /></Layout></ProtectedRoute>} />
          <Route path="/assistant" element={<ProtectedRoute><Layout><ShoppingAssistant /></Layout></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><Layout><AdminPanel /></Layout></AdminRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AppProvider>
  );
}

export default App;