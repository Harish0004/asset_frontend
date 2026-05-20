import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast';
import ProtectedRoute from './components/ProtectedRoute';
import SidebarLayout from './components/SidebarLayout';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AssetInventory from './pages/admin/AssetInventory';
import AssetAssignment from './pages/admin/AssetAssignment';
import AdminReports from './pages/admin/AdminReports';
import AdminTicketsDashboard from './pages/admin/AdminTicketsDashboard';
import TechDashboard from './pages/technician/TechDashboard';
import TechnicianWorkbench from './pages/technician/TechnicianWorkbench';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';
import EmployeePortal from './pages/employee/EmployeePortal';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route element={<SidebarLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/inventory" element={<AssetInventory />} />
              <Route path="/admin/tickets" element={<AdminTicketsDashboard />} />
              <Route path="/admin/assignments" element={<AssetAssignment />} />
              <Route path="/admin/reports" element={<AdminReports />} />
            </Route>
          </Route>

          {/* Technician Routes */}
          <Route element={<ProtectedRoute allowedRoles={['TECHNICIAN']} />}>
            <Route element={<SidebarLayout />}>
              <Route path="/technician/dashboard" element={<TechDashboard />} />
              <Route path="/technician/queue" element={<TechnicianWorkbench />} />
            </Route>
          </Route>

          {/* Employee Routes */}
          <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE']} />}>
            <Route element={<SidebarLayout />}>
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/ticket" element={<EmployeePortal />} />
            </Route>
          </Route>

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
