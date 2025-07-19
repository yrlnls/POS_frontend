import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import AdminDashboard from './pages/admin/Dashboard'
import SalesDashboard from './pages/sales/Dashboard'
import TechDashboard from './pages/tech/TicketSystem'
import CustomerDashboard from './pages/customer/Dashboard'
import { AuthProvider, useAuth } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="sales" element={<ProtectedRoute role="sales"><SalesDashboard /></ProtectedRoute>} />
          <Route path="tech" element={<ProtectedRoute role="tech"><TechDashboard /></ProtectedRoute>} />
          <Route path="customer" element={<ProtectedRoute role="customer"><CustomerDashboard /></ProtectedRoute>} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

function ProtectedRoute({ children, role }) {
  const { user } = useAuth()
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}`} replace />
  }
  
  return children
}

export default App