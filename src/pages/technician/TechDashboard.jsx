import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Loader, AlertCircle } from 'lucide-react';
import { useTickets } from '../../services/useTicketQueries';

const TechDashboard = () => {
  const user = useSelector(state => state.auth.user);
  const { data: tickets = [], isLoading, isError } = useTickets();

  // Filter tickets assigned to current technician (API returns technicianUsername on DTO)
  const myTickets = useMemo(() => {
    if (!Array.isArray(tickets) || !user?.username) return [];
    const me = user.username.toLowerCase();
    return tickets.filter((t) => {
      const assignedTo = (t.technicianUsername ?? t.technician?.username ?? '').toLowerCase();
      return assignedTo === me;
    });
  }, [tickets, user?.username]);

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: myTickets.length,
      open: myTickets.filter(t => t.status === 'OPEN').length,
      inProgress: myTickets.filter(t => t.status === 'IN_PROGRESS').length,
      resolved: myTickets.filter(t => t.status === 'RESOLVED').length,
      critical: myTickets.filter(t => t.priority === 'CRITICAL').length,
      high: myTickets.filter(t => t.priority === 'HIGH').length
    };
  }, [myTickets]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '500px' }}>
        <Loader size={32} className="text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="alert alert-danger d-flex align-items-center gap-3" role="alert">
        <AlertCircle size={24} />
        <div>
          <strong>Error</strong>
          <p className="mb-0">Failed to load your work queue. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#1F2937' }}>
          My Work Queue - Technician Module
        </h2>
        <p className="text-muted" style={{ fontSize: '0.95rem' }}>
          Overview of your assigned tickets and maintenance schedule
        </p>
      </div>

      {/* Stats Grid */}
      <div className="row g-3 mb-4">
        {/* Total Tickets */}
        <div className="col-md-3">
          <div
            className="card h-100"
            style={{
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div className="card-body">
              <small
                className="text-muted d-block mb-2"
                style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}
              >
                TOTAL QUEUE
              </small>
              <h3 className="fw-bold mb-2" style={{ color: '#2563EB', fontSize: '2.5rem' }}>
                {stats.total}
              </h3>
              <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                Tickets assigned to you
              </p>
            </div>
          </div>
        </div>

        {/* Open */}
        <div className="col-md-3">
          <div
            className="card h-100"
            style={{
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div className="card-body">
              <small
                className="text-muted d-block mb-2"
                style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}
              >
                PENDING
              </small>
              <h3 className="fw-bold mb-2" style={{ color: '#F59E0B', fontSize: '2.5rem' }}>
                {stats.open}
              </h3>
              <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                Waiting to be accepted
              </p>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="col-md-3">
          <div
            className="card h-100"
            style={{
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div className="card-body">
              <small
                className="text-muted d-block mb-2"
                style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}
              >
                IN PROGRESS
              </small>
              <h3 className="fw-bold mb-2" style={{ color: '#3B82F6', fontSize: '2.5rem' }}>
                {stats.inProgress}
              </h3>
              <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                Currently working on
              </p>
            </div>
          </div>
        </div>

        {/* Resolved */}
        <div className="col-md-3">
          <div
            className="card h-100"
            style={{
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div className="card-body">
              <small
                className="text-muted d-block mb-2"
                style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}
              >
                RESOLVED
              </small>
              <h3 className="fw-bold mb-2" style={{ color: '#10B981', fontSize: '2.5rem' }}>
                {stats.resolved}
              </h3>
              <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
                Completed tickets
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Task Overview Cards */}
      <div className="row g-3">
        {/* Pending Assignments */}
        <div className="col-md-6">
          <div
            className="card h-100"
            style={{
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF',
              overflow: 'hidden'
            }}
          >
            <div
              className="card-header"
              style={{
                backgroundColor: '#F9FAFB',
                borderBottom: '1px solid #E5E7EB',
                padding: '16px'
              }}
            >
              <h5 className="fw-bold mb-0" style={{ fontSize: '1rem', color: '#1F2937' }}>
                Pending Assignments
              </h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-baseline gap-2 mb-3">
                <h2 className="fw-bold mb-0" style={{ color: '#DC2626', fontSize: '2rem' }}>
                  {stats.open}
                </h2>
                <span className="text-muted" style={{ fontSize: '0.9rem' }}>
                  waiting to be accepted
                </span>
              </div>
             
            </div>
          </div>
        </div>

        {/* Completed Today */}
        <div className="col-md-6">
          <div
            className="card h-100"
            style={{
              borderRadius: '12px',
              border: '1px solid #E5E7EB',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div
              className="card-header"
              style={{
                backgroundColor: '#F9FAFB',
                borderBottom: '1px solid #E5E7EB',
                padding: '16px'
              }}
            >
              <h5 className="fw-bold mb-0" style={{ fontSize: '1rem', color: '#1F2937' }}>
                Work Status
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Open / Pending</span>
                  <span className="fw-bold" style={{ color: '#F59E0B' }}>
                    {stats.open}
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: '#F59E0B',
                      width: `${stats.total > 0 ? (stats.open / stats.total) * 100 : 0}%`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>In Progress</span>
                  <span className="fw-bold" style={{ color: '#3B82F6' }}>
                    {stats.inProgress}
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: '#3B82F6',
                      width: `${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>Resolved</span>
                  <span className="fw-bold" style={{ color: '#10B981' }}>
                    {stats.resolved}
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      backgroundColor: '#10B981',
                      width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {stats.total === 0 && (
        <div
          className="alert alert-info d-flex align-items-center gap-3 mt-4"
          role="alert"
        >
          <div>
            <strong>No Assignments Yet</strong>
            <p className="mb-0" style={{ fontSize: '0.9rem' }}>
              You have no tickets assigned. Check back later or contact your administrator.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechDashboard;
