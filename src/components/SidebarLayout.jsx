import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { LogOut, LayoutDashboard, Package, Ticket, FileText, ClipboardList, PenTool } from 'lucide-react';

const SidebarLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const renderNavLinks = () => {
    if (!user) return null;

    if (user.role === 'ADMIN') {
      return (
        <>
          <NavLink to="/admin/dashboard" className="sidebar-link"><LayoutDashboard size={18} className="me-2"/> Dashboard</NavLink>
          <NavLink to="/admin/inventory" className="sidebar-link"><Package size={18} className="me-2"/> Asset Inventory</NavLink>
          <NavLink to="/admin/tickets" className="sidebar-link"><Ticket size={18} className="me-2"/> Tickets</NavLink>
          <NavLink to="/admin/assignments" className="sidebar-link"><ClipboardList size={18} className="me-2"/> Assignments</NavLink>
          <NavLink to="/admin/reports" className="sidebar-link"><FileText size={18} className="me-2"/> Reports</NavLink>
        </>
      );
    }
    
    if (user.role === 'TECHNICIAN') {
      return (
        <>
          <NavLink to="/technician/dashboard" className="sidebar-link"><LayoutDashboard size={18} className="me-2"/> Dashboard</NavLink>
          <NavLink to="/technician/queue" className="sidebar-link"><PenTool size={18} className="me-2"/> My Work Queue</NavLink>
        </>
      );
    }

    if (user.role === 'EMPLOYEE') {
      return (
        <>
          <NavLink to="/employee/dashboard" className="sidebar-link"><LayoutDashboard size={18} className="me-2"/> Dashboard</NavLink>
          <NavLink to="/employee/ticket" className="sidebar-link"><Ticket size={18} className="me-2"/> Raise Ticket</NavLink>
        </>
      );
    }
  };

  return (
    <div className="sidebar-layout-wrapper">
      <div className="sidebar">
        <div className="brand d-flex align-items-center">
          <Package className="me-2" /> EAMS
        </div>
        <div className="sidebar-nav">
          {renderNavLinks()}
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
      
      <div className="workspace">
        <div className="workspace-header d-flex justify-content-between align-items-center bg-white" style={{ borderBottom: '1px solid #E5E7EB', padding: '16px 32px', height: '72px' }}>
          <div className="d-flex align-items-center gap-3">
            <div className="border rounded d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px', borderColor: '#E5E7EB' }}>
              <LayoutDashboard size={18} className="text-dark" />
            </div>
            <div className="d-flex flex-column lh-1 mt-1">
              <span className="text-muted fw-bold mb-1" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>ASSET MANAGEMENT</span>
              <span className="fw-bold text-dark" style={{ fontSize: '1.05rem' }}>Admin Console</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="text-muted" style={{ fontSize: '0.9rem' }}>{user?.username}@focusrtech.com</span>
            <div className="rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold" style={{ width: '36px', height: '36px', backgroundColor: '#312E81', fontSize: '0.9rem' }}>
              {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
          </div>
        </div>
        <div className="workspace-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
