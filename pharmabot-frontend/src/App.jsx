import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Prescription from './pages/Prescription';
import Report from './pages/Report';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a24',
              color: '#e2e8f0',
              border: '1px solid #2a2a3a',
              borderRadius: '12px',
              fontSize: '14px'
            },
            success: { iconTheme: { primary: '#6366f1', secondary: '#fff' } }
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/upload" element={
            <ProtectedRoute><Upload /></ProtectedRoute>
          } />
          <Route path="/prescription/:id" element={
            <ProtectedRoute><Prescription /></ProtectedRoute>
          } />
          <Route path="/prescription/:id/report" element={
            <ProtectedRoute><Report /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
