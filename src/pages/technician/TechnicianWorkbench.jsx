import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Bell, CheckCircle, Loader, AlertCircle } from 'lucide-react';
import { useTickets, useUpdateTicketStatus } from '../../services/useTicketQueries';
import { useToast } from '../../components/Toast';

const TechnicianWorkbench = () => {
  const user = useSelector(state => state.auth.user);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const { addToast } = useToast();

  const { data: tickets = [], isLoading, isError } = useTickets();
  const statusMutation = useUpdateTicketStatus();

  // Filter tickets assigned to current technician
  const myTickets = useMemo(() => {
    if (!Array.isArray(tickets) || !user?.username) return [];
    return tickets.filter(t => t.technician?.username?.toLowerCase() === user?.username?.toLowerCase());
  }, [tickets, user?.username]);

  // Separate tickets by status
  const openTickets = myTickets.filter(t => t.status === 'OPEN');
  const inProgressTickets = myTickets.filter(t => t.status === 'IN_PROGRESS');
  const newlyAssigned = myTickets.filter(t => t.status === 'OPEN');

  const selectedTicket = useMemo(() => {
    return myTickets.find(t => t.id === selectedTicketId);
  }, [myTickets, selectedTicketId]);

  const handleAcceptAndStart = async () => {
    if (!selectedTicket) return;
    try {
      await statusMutation.mutateAsync({
        ticketId: selectedTicket.id,
        status: 'IN_PROGRESS'
      });
      addToast('Ticket accepted and marked as in progress', 'success');
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to update ticket', 'error');
    }
  };

  const handleMarkResolved = async () => {
    if (!selectedTicket) return;
    try {
      await statusMutation.mutateAsync({
        ticketId: selectedTicket.id,
        status: 'RESOLVED'
      });
      addToast('Ticket marked as resolved!', 'success');
      setSelectedTicketId(null);
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to resolve ticket', 'error');
    }
  };

  const getPriorityPill = (priority) => {
    const priorityMap = {
      CRITICAL: { bg: '#FEE2E2', color: '#DC2626', label: 'Critical' },
      HIGH: { bg: '#FEF3C7', color: '#D97706', label: 'High' },
      MEDIUM: { bg: '#DBEAFE', color: '#2563EB', label: 'Medium' },
      LOW: { bg: '#D1FAE5', color: '#059669', label: 'Low' }
    };
    const style = priorityMap[priority] || priorityMap.MEDIUM;
    return (
      <span className="badge rounded-pill" style={{ backgroundColor: style.bg, color: style.color, padding: '6px 12px' }}>
        {style.label}
      </span>
    );
  };

  return (
    <div className="technician-workbench p-4" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#1F2937' }}>
          Technician Workbench
        </h2>
        <p className="text-muted mb-3" style={{ fontSize: '0.95rem' }}>
          Your assigned tickets and work queue
        </p>
      </div>

      {/* Notification Center */}
      {newlyAssigned.length > 0 && (
        <div
          className="alert d-flex align-items-center gap-3 mb-4 rounded"
          style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E' }}
          role="alert"
        >
          <Bell size={20} className="flex-shrink-0" />
          <div className="flex-grow-1">
            <strong>New Assignments!</strong>
            <p className="mb-0" style={{ fontSize: '0.9rem' }}>
              You have {newlyAssigned.length} newly assigned ticket{newlyAssigned.length !== 1 ? 's' : ''}. 
              Click to review and accept.
            </p>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="row g-3 mb-4">
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
              <small className="text-muted d-block mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                OPEN TICKETS
              </small>
              <h3 className="fw-bold mb-0" style={{ color: '#DC2626', fontSize: '2rem' }}>
                {openTickets.length}
              </h3>
            </div>
          </div>
        </div>
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
              <small className="text-muted d-block mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                IN PROGRESS
              </small>
              <h3 className="fw-bold mb-0" style={{ color: '#2563EB', fontSize: '2rem' }}>
                {inProgressTickets.length}
              </h3>
            </div>
          </div>
        </div>
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
              <small className="text-muted d-block mb-1" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>
                TOTAL QUEUE
              </small>
              <h3 className="fw-bold mb-0" style={{ color: '#059669', fontSize: '2rem' }}>
                {myTickets.length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Left: Ticket Queue */}
        <div
          className="card"
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
              padding: '20px'
            }}
          >
            <h5 className="fw-bold mb-0" style={{ fontSize: '1rem', color: '#1F2937' }}>
              My Work Queue
            </h5>
          </div>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {isLoading && (
              <div className="d-flex justify-content-center align-items-center py-5">
                <Loader size={24} className="text-primary" />
              </div>
            )}

            {isError && (
              <div className="p-4 text-center text-danger">
                <AlertCircle className="mb-2" />
                <p>Error loading tickets</p>
              </div>
            )}

            {!isLoading && myTickets.length === 0 && (
              <div className="p-4 text-center text-muted">
                <p>No tickets assigned to you</p>
              </div>
            )}

            {!isLoading && myTickets.map(ticket => (
              <div
                key={ticket.id}
                className="p-4"
                onClick={() => setSelectedTicketId(ticket.id)}
                style={{
                  borderBottom: '1px solid #E5E7EB',
                  cursor: 'pointer',
                  backgroundColor: selectedTicketId === ticket.id ? '#EFF6FF' : '#FFFFFF',
                  borderLeft: selectedTicketId === ticket.id ? '4px solid #2563EB' : '4px solid transparent',
                  paddingLeft: selectedTicketId === ticket.id ? '16px' : '16px',
                  transition: 'background-color 0.2s'
                }}
              >
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <div className="fw-bold" style={{ color: '#1F2937', fontSize: '0.95rem' }}>
                      Ticket #{ticket.id}
                    </div>
                    <small className="text-muted">{ticket.assetName || 'Unknown Asset'}</small>
                  </div>
                  {getPriorityPill(ticket.priority)}
                </div>
                <small className="text-muted d-block mt-2">
                  By: {ticket.raisedByUsername}
                </small>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detail View & Action Panel */}
        <div
          className="card"
          style={{
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            backgroundColor: '#FFFFFF',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div
            className="card-header"
            style={{
              backgroundColor: '#F9FAFB',
              borderBottom: '1px solid #E5E7EB',
              padding: '20px'
            }}
          >
            <h5 className="fw-bold mb-0" style={{ fontSize: '1rem', color: '#1F2937' }}>
              Ticket Details
            </h5>
          </div>

          <div
            className="card-body"
            style={{ overflow: 'auto', flex: 1 }}
          >
            {!selectedTicket ? (
              <div className="d-flex align-items-center justify-content-center h-100" style={{ minHeight: '400px' }}>
                <p className="text-muted text-center">Select a ticket to view details and take action</p>
              </div>
            ) : (
              <div>
                {/* Ticket Header */}
                <div className="mb-4 pb-4" style={{ borderBottom: '1px solid #E5E7EB' }}>
                  <h4 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                    Ticket #{selectedTicket.id}
                  </h4>
                  <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
                    {selectedTicket.assetName}
                  </p>
                  <div className="d-flex gap-2">
                    {getPriorityPill(selectedTicket.priority)}
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor:
                          selectedTicket.status === 'OPEN' ? '#FEF3C7' :
                          selectedTicket.status === 'IN_PROGRESS' ? '#DBEAFE' : '#D1FAE5',
                        color:
                          selectedTicket.status === 'OPEN' ? '#92400E' :
                          selectedTicket.status === 'IN_PROGRESS' ? '#1E40AF' : '#065F46',
                        padding: '6px 12px'
                      }}
                    >
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>

                {/* Issue Description */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-2" style={{ fontSize: '0.9rem', color: '#374151' }}>
                    Issue Description
                  </h6>
                  <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#374151' }}>
                    {selectedTicket.issueDescription}
                  </p>
                </div>

                {/* Metadata */}
                <div className="row g-3 mb-4">
                  <div className="col-6">
                    <small className="text-muted d-block mb-1" style={{ fontSize: '0.75rem' }}>
                      CREATED BY
                    </small>
                    <p className="fw-semibold mb-0" style={{ fontSize: '0.9rem', color: '#1F2937' }}>
                      {selectedTicket.raisedByUsername}
                    </p>
                  </div>
                  <div className="col-6">
                    <small className="text-muted d-block mb-1" style={{ fontSize: '0.75rem' }}>
                      CREATED AT
                    </small>
                    <p className="fw-semibold mb-0" style={{ fontSize: '0.9rem', color: '#1F2937' }}>
                      {selectedTicket.createdAt
                        ? new Date(selectedTicket.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto pt-4" style={{ borderTop: '1px solid #E5E7EB' }}>
                  {selectedTicket.status === 'OPEN' && (
                    <button
                      className="btn w-100"
                      onClick={handleAcceptAndStart}
                      disabled={statusMutation.isPending}
                      style={{
                        backgroundColor: '#4F46E5',
                        color: '#FFFFFF',
                        borderRadius: '6px',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        border: 'none',
                        padding: '12px 16px'
                      }}
                    >
                      {statusMutation.isPending ? 'Accepting...' : '✓ Accept & Start Work'}
                    </button>
                  )}

                  {selectedTicket.status === 'IN_PROGRESS' && (
                    <button
                      className="btn w-100"
                      onClick={handleMarkResolved}
                      disabled={statusMutation.isPending}
                      style={{
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        borderRadius: '6px',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        border: 'none',
                        padding: '12px 16px'
                      }}
                    >
                      {statusMutation.isPending ? 'Resolving...' : '✓ Mark as Resolved'}
                    </button>
                  )}

                  {selectedTicket.status === 'RESOLVED' && (
                    <div
                      className="d-flex align-items-center justify-content-center gap-2 p-3 rounded"
                      style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}
                    >
                      <CheckCircle size={20} />
                      <span className="fw-semibold">Ticket Resolved</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianWorkbench;
