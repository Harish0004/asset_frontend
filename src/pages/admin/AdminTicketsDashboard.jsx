import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ChevronDown, Loader, Plus } from 'lucide-react';
import { useTickets, useTechnicians, useDispatchTicket, useCreateTicket, useAllAssets } from '../../services/useTicketQueries';
import { useToast } from '../../components/Toast';
import TicketSlaBadge, { formatDeadline } from '../../components/TicketSlaBadge';
import Pagination from '../../components/Pagination';

const AdminTicketsDashboard = () => {
  const user = useSelector(state => state.auth.user);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState(null);
  const [showRaiseForm, setShowRaiseForm] = useState(false);
  const [assetId, setAssetId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [formErrors, setFormErrors] = useState({});
  const [listPage, setListPage] = useState(0);
  const [listPageSize, setListPageSize] = useState(5);
  const { addToast } = useToast();

  const { data: tickets = [], isLoading: ticketsLoading, isError: ticketsError } = useTickets();
  const { data: technicians = [], isLoading: techniciansLoading } = useTechnicians();
  const { data: allAssets = [], isLoading: assetsLoading } = useAllAssets();
  const dispatchMutation = useDispatchTicket();
  const createMutation = useCreateTicket();

  // Filter for admin - should see all tickets
  const adminTickets = useMemo(() => {
    return Array.isArray(tickets) ? tickets : [];
  }, [tickets]);

  const totalTicketPages = useMemo(() => {
    return Math.max(1, Math.ceil(adminTickets.length / listPageSize));
  }, [adminTickets.length, listPageSize]);

  const pagedTickets = useMemo(() => {
    const start = listPage * listPageSize;
    return adminTickets.slice(start, start + listPageSize);
  }, [adminTickets, listPage, listPageSize]);

  const selectedTicket = useMemo(() => {
    return adminTickets.find(t => t.id === selectedTicketId);
  }, [adminTickets, selectedTicketId]);

  // Determine if can dispatch (status is OPEN and no technician assigned)
  const canDispatch = selectedTicket && selectedTicket.status === 'OPEN' && !selectedTicket.technicianUsername;

  const validateRaiseForm = () => {
    const errors = {};
    if (!assetId) errors.assetId = 'Please select an asset';
    if (!description || description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    }
    if (!priority) errors.priority = 'Please select a priority';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    if (!validateRaiseForm()) {
      addToast('Please fix the validation errors', 'warning');
      return;
    }

    try {
      const created = await createMutation.mutateAsync({
        assetId: parseInt(assetId, 10),
        issueDescription: description.trim(),
        priority,
      });
      addToast('Ticket raised successfully!', 'success');
      setAssetId('');
      setDescription('');
      setPriority('MEDIUM');
      setFormErrors({});
      setShowRaiseForm(false);
      if (created?.id) setSelectedTicketId(created.id);
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to raise ticket', 'error');
    }
  };

  const handleDispatch = async () => {
    if (!selectedTicket || !selectedTechnicianId) {
      addToast('Please select a technician', 'warning');
      return;
    }

    try {
      await dispatchMutation.mutateAsync({
        ticketId: selectedTicket.id,
        technicianId: selectedTechnicianId
      });
      addToast('Ticket dispatched successfully!', 'success');
      setSelectedTechnicianId(null);
    } catch (error) {
      addToast(error.response?.data?.message || 'Failed to dispatch ticket', 'error');
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
      <span
        className="badge rounded-pill"
        style={{ backgroundColor: style.bg, color: style.color, padding: '6px 12px' }}
      >
        {style.label}
      </span>
    );
  };

  const getStatusPill = (status) => {
    const statusMap = {
      OPEN: { bg: '#FEF3C7', color: '#92400E' },
      IN_PROGRESS: { bg: '#DBEAFE', color: '#1E40AF' },
      RESOLVED: { bg: '#D1FAE5', color: '#065F46' }
    };
    const style = statusMap[status] || { bg: '#F3F4F6', color: '#374151' };
    return (
      <span
        className="badge rounded-pill"
        style={{ backgroundColor: style.bg, color: style.color, padding: '6px 12px' }}
      >
        {status}
      </span>
    );
  };

  return (
    <div>
      <div style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 24px 0' }}>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h2 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.5rem' }}>Ticket Management</h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>Raise, review, and dispatch support tickets</p>
          </div>
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => setShowRaiseForm((v) => !v)}
            style={{ backgroundColor: '#4F46E5', borderColor: '#4F46E5' }}
          >
            <Plus size={18} />
            {showRaiseForm ? 'Hide Form' : 'Raise Ticket'}
          </button>
        </div>

        {showRaiseForm && (
          <div className="card mb-4" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div className="card-header" style={{ backgroundColor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
              <h5 className="fw-bold mb-0" style={{ fontSize: '1rem' }}>Raise New Ticket</h5>
            </div>
            <div className="card-body p-4">
              <form onSubmit={handleRaiseTicket}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Select Asset *</label>
                    <select
                      className={`form-select ${formErrors.assetId ? 'is-invalid' : ''}`}
                      value={assetId}
                      onChange={(e) => {
                        setAssetId(e.target.value);
                        if (e.target.value) setFormErrors((prev) => ({ ...prev, assetId: '' }));
                      }}
                      disabled={assetsLoading || createMutation.isPending}
                    >
                      <option value="">-- Select asset --</option>
                      {allAssets.map((asset) => (
                        <option key={asset.id} value={asset.id}>
                          {asset.name} ({asset.serialNumber}) — {asset.status}
                        </option>
                      ))}
                    </select>
                    {formErrors.assetId && (
                      <div className="invalid-feedback d-block">{formErrors.assetId}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold small">Priority *</label>
                    <select
                      className="form-select"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      disabled={createMutation.isPending}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold small">Issue Description *</label>
                    <textarea
                      className={`form-control ${formErrors.description ? 'is-invalid' : ''}`}
                      rows="3"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        if (e.target.value.trim().length >= 10) {
                          setFormErrors((prev) => ({ ...prev, description: '' }));
                        }
                      }}
                      placeholder="Describe the issue (minimum 10 characters)"
                      disabled={createMutation.isPending}
                    />
                    {formErrors.description && (
                      <div className="invalid-feedback d-block">{formErrors.description}</div>
                    )}
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={createMutation.isPending || !allAssets.length}
                      style={{ backgroundColor: '#4F46E5', borderColor: '#4F46E5' }}
                    >
                      {createMutation.isPending ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

    <div className="admin-tickets-container">
      <style>{`
        .admin-tickets-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          padding: 0 24px 24px;
          max-width: 1600px;
          margin: 0 auto;
          height: calc(100vh - 120px);
          overflow: hidden;
        }
        .ticket-list-pane {
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          overflow: hidden;
        }
        .ticket-list-header {
          padding: 20px 24px;
          border-bottom: 1px solid #E5E7EB;
          background: #F9FAFB;
        }
        .ticket-list-body {
          overflow-y: auto;
          flex: 1;
        }
        .ticket-item {
          padding: 16px 24px;
          border-bottom: 1px solid #E5E7EB;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .ticket-item:hover {
          background-color: #F9FAFB;
        }
        .ticket-item.selected {
          background-color: #EFF6FF;
          border-left: 4px solid #2563EB;
          padding-left: 20px;
        }
        .detail-pane {
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
          border: 1px solid #E5E7EB;
          border-radius: 12px;
          padding: 24px;
          overflow-y: auto;
        }
        .detail-empty {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: #9CA3AF;
          text-align: center;
        }
        @media (max-width: 768px) {
          .admin-tickets-container {
            grid-template-columns: 1fr;
            height: auto;
          }
        }
      `}</style>

      {/* Left Pane: Ticket List */}
      <div className="ticket-list-pane">
        <div className="ticket-list-header">
          <h5 className="fw-bold mb-0" style={{ fontSize: '1.1rem', color: '#1F2937' }}>
            All Tickets
          </h5>
          <small className="text-muted" style={{ fontSize: '0.85rem' }}>
            {adminTickets.length} total
          </small>
        </div>

        <div className="ticket-list-body">
          {ticketsLoading && (
            <div className="d-flex justify-content-center align-items-center py-5">
              <Loader size={24} className="spinner-border text-primary" />
            </div>
          )}

          {ticketsError && (
            <div className="p-4 text-center text-danger">
              <p>Error loading tickets</p>
            </div>
          )}

          {!ticketsLoading && adminTickets.length === 0 && (
            <div className="p-4 text-center text-muted">
              <p>No tickets found</p>
            </div>
          )}

            {!ticketsLoading && pagedTickets.map(ticket => (
            <div
              key={ticket.id}
              className={`ticket-item ${selectedTicketId === ticket.id ? 'selected' : ''}`}
              onClick={() => setSelectedTicketId(ticket.id)}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>
                    Ticket #{ticket.id}
                  </div>
                  <small className="text-muted">{ticket.assetName || 'Unknown Asset'}</small>
                </div>
                {getPriorityPill(ticket.priority)}
              </div>
              <div className="d-flex justify-content-between align-items-center mt-2">
                <small className="text-muted">
                  By: {ticket.raisedByUsername || 'Unknown'}
                </small>
                {getStatusPill(ticket.status)}
              </div>
              {ticket.slaBreached && (
                <small className="text-danger fw-semibold d-block mt-1" style={{ fontSize: '0.75rem' }}>
                  SLA breached
                </small>
              )}
            </div>
          ))}
        </div>

          {!ticketsLoading && (
            <div className="p-3 border-top" style={{ backgroundColor: '#FFFFFF' }}>
              <Pagination
                page={Math.min(listPage, totalTicketPages - 1)}
                totalPages={totalTicketPages}
                onPageChange={setListPage}
                showPageSize
                pageSize={listPageSize}
                onPageSizeChange={(next) => {
                  setListPageSize(next);
                  setListPage(0);
                }}
              />
            </div>
          )}
      </div>

      {/* Right Pane: Detail View */}
      <div className="detail-pane">
        {!selectedTicket ? (
          <div className="detail-empty">
            <div>
              <p className="text-muted mb-0">Select a ticket to view details</p>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="mb-4 pb-4 border-bottom">
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h4 className="fw-bold mb-1" style={{ color: '#1F2937' }}>
                    Ticket #{selectedTicket.id}
                  </h4>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                    {selectedTicket.assetName || 'Unknown Asset'}
                  </p>
                </div>
                <div>
                  {getPriorityPill(selectedTicket.priority)}
                </div>
              </div>
              <div className="d-flex gap-2 flex-wrap align-items-center">
                {getStatusPill(selectedTicket.status)}
                <TicketSlaBadge ticket={selectedTicket} />
              </div>
            </div>

            {/* Issue Description */}
            <div className="mb-4">
              <h6 className="fw-bold mb-2" style={{ fontSize: '0.9rem', color: '#374151' }}>
                Issue Description
              </h6>
              <p className="text-dark" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                {selectedTicket.issueDescription}
              </p>
            </div>

            {/* Timestamps and Details */}
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div
                  className="p-3 rounded"
                  style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}
                >
                  <small className="text-muted d-block mb-1" style={{ fontSize: '0.75rem' }}>
                    CREATED AT
                  </small>
                  <p className="fw-semibold mb-0" style={{ fontSize: '0.95rem', color: '#1F2937' }}>
                    {selectedTicket.createdAt
                      ? new Date(selectedTicket.createdAt).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  className="p-3 rounded"
                  style={{ backgroundColor: '#F9FAFB', border: '1px solid #E5E7EB' }}
                >
                  <small className="text-muted d-block mb-1" style={{ fontSize: '0.75rem' }}>
                    RAISED BY
                  </small>
                  <p className="fw-semibold mb-0" style={{ fontSize: '0.95rem', color: '#1F2937' }}>
                    {selectedTicket.raisedByUsername || 'Unknown'}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div
                  className="p-3 rounded"
                  style={{
                    backgroundColor: selectedTicket.slaBreached ? '#FEF2F2' : '#F9FAFB',
                    border: `1px solid ${selectedTicket.slaBreached ? '#FECACA' : '#E5E7EB'}`,
                  }}
                >
                  <small className="text-muted d-block mb-1" style={{ fontSize: '0.75rem' }}>
                    SLA DEADLINE
                  </small>
                  <p
                    className="fw-semibold mb-0"
                    style={{
                      fontSize: '0.95rem',
                      color: selectedTicket.slaBreached ? '#991B1B' : '#1F2937',
                    }}
                  >
                    {formatDeadline(selectedTicket.deadlineAt)}
                  </p>
                  {selectedTicket.resolvedAt && (
                    <small className="text-muted d-block mt-1">
                      Resolved: {formatDeadline(selectedTicket.resolvedAt)}
                    </small>
                  )}
                </div>
              </div>
            </div>

            {/* Assignment Section */}
            {canDispatch && (
              <div
                className="p-4 rounded mb-4"
                style={{ backgroundColor: '#FEF3C7', border: '1px solid #FCD34D' }}
              >
                <h6 className="fw-bold mb-3" style={{ color: '#92400E', fontSize: '0.95rem' }}>
                  Dispatch to Technician
                </h6>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ fontSize: '0.9rem' }}>
                    Select Technician
                  </label>
                  <div className="input-group">
                    <select
                      className="form-select"
                      value={selectedTechnicianId}
                      onChange={(e) => setSelectedTechnicianId(e.target.value ? parseInt(e.target.value) : null)}
                      disabled={techniciansLoading || dispatchMutation.isPending}
                      style={{
                        borderRadius: '6px',
                        borderColor: '#D1D5DB',
                        fontSize: '0.95rem'
                      }}
                    >
                      <option value="">-- Select a technician --</option>
                      {technicians.map(tech => (
                        <option key={tech.id} value={tech.id}>
                          {tech.username || `Technician ${tech.id}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  className="btn w-100"
                  onClick={handleDispatch}
                  disabled={!selectedTechnicianId || dispatchMutation.isPending}
                  style={{
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    fontWeight: '500',
                    border: 'none',
                    padding: '10px 16px'
                  }}
                >
                  {dispatchMutation.isPending ? 'Dispatching...' : 'Dispatch to Technician'}
                </button>
              </div>
            )}

            {selectedTicket.technicianUsername && (
              <div
                className="p-4 rounded"
                style={{ backgroundColor: '#D1FAE5', border: '1px solid #6EE7B7' }}
              >
                <small className="text-muted d-block mb-1" style={{ fontSize: '0.75rem' }}>
                  ASSIGNED TO
                </small>
                <p className="fw-semibold mb-0" style={{ fontSize: '0.95rem', color: '#065F46' }}>
                  {selectedTicket.technicianUsername}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default AdminTicketsDashboard;
