import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import SidebarLayout from './components/SidebarLayout';
import Login from './pages/Login';
import AdminDashboard from './pages/admin/AdminDashboard';
import AssetInventory from './pages/admin/AssetInventory';
import AdminReports from './pages/admin/AdminReports';
import TechDashboard from './pages/technician/TechDashboard';
import EmployeeDashboard from './pages/employee/EmployeeDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
          <Route element={<SidebarLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/inventory" element={<AssetInventory />} />
            <Route path="/admin/tickets" element={<div className="p-4"><h2>Tickets</h2><p className="text-muted">Placeholder content</p></div>} />
            <Route path="/admin/assignments" element={<div className="p-4"><h2>Assignments</h2><p className="text-muted">Placeholder content</p></div>} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>
        </Route>

        {/* Technician Routes */}
        <Route element={<ProtectedRoute allowedRoles={['TECHNICIAN']} />}>
          <Route element={<SidebarLayout />}>
            <Route path="/technician/dashboard" element={<TechDashboard />} />
            <Route path="/technician/queue" element={<div className="p-4"><h2>My Work Queue</h2><p className="text-muted">Placeholder content</p></div>} />
          </Route>
        </Route>

        {/* Employee Routes */}
        <Route element={<ProtectedRoute allowedRoles={['EMPLOYEE']} />}>
          <Route element={<SidebarLayout />}>
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/assets" element={<div className="p-4"><h2>My Assets</h2><p className="text-muted">Placeholder content</p></div>} />
            <Route path="/employee/ticket" element={<div className="p-4"><h2>Raise Ticket</h2><p className="text-muted">Placeholder content</p></div>} />
          </Route>
        </Route>

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
