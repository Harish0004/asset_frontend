import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';
import {
  useTickets,
  useCreateTicket,
  useMyAssets
} from '../../services/useTicketQueries';
import { useToast } from '../../components/Toast';

const EmployeePortal = () => {
  const user = useSelector(state => state.auth.user);
  const { addToast } = useToast();

  // Form state
  const [assetId, setAssetId] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [errors, setErrors] = useState({});

  // Data fetching
  const { data: tickets = [], isLoading: ticketsLoading } = useTickets();
  const { data: allAssets = [], isLoading: assetsLoading } = useMyAssets();
  const createMutation = useCreateTicket();

  // Filter to user's assigned assets only
  const myAssets = useMemo(() => {
    return allAssets.filter(asset =>
      asset.assignedToUsername?.toLowerCase() === user?.username?.toLowerCase()
    );
  }, [allAssets, user?.username]);

  // Filter to user's tickets
  const myTickets = useMemo(() => {
    return Array.isArray(tickets)
      ? tickets.filter(t => t.raisedByUsername?.toLowerCase() === user?.username?.toLowerCase())
      : [];
  }, [tickets, user?.username]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!assetId) {
      newErrors.assetId = 'Please select an asset';
    }

    if (!description || description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!priority) {
      newErrors.priority = 'Please select a priority';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmitTicket = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      addToast('Please fix the validation errors', 'warning');
      return;
    }

    try {
      const selectedAsset = myAssets.find(a => a.id === parseInt(assetId));
      
      await createMutation.mutateAsync({
        assetId: parseInt(assetId),
        issueDescription: description,
        priority: priority
      });

      // Reset form
      setAssetId('');
      setDescription('');
      setPriority('MEDIUM');
      setErrors({});

      addToast('Ticket submitted successfully!', 'success');
    } catch (error) {
      addToast(
        error.response?.data?.message || 'Failed to submit ticket',
        'error'
      );
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      OPEN: { bg: '#FEF3C7', color: '#92400E', label: 'Open' },
      IN_PROGRESS: { bg: '#DBEAFE', color: '#1E40AF', label: 'In Progress' },
      RESOLVED: { bg: '#D1FAE5', color: '#065F46', label: 'Resolved' }
    };
    const style = statusMap[status] || { bg: '#F3F4F6', color: '#374151' };
    return (
      <span
        className="badge rounded-pill"
        style={{ backgroundColor: style.bg, color: style.color, padding: '6px 12px' }}
      >
        {style.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      CRITICAL: { bg: '#FEE2E2', color: '#DC2626' },
      HIGH: { bg: '#FEF3C7', color: '#D97706' },
      MEDIUM: { bg: '#DBEAFE', color: '#2563EB' },
      LOW: { bg: '#D1FAE5', color: '#059669' }
    };
    const style = priorityMap[priority] || priorityMap.MEDIUM;
    return (
      <span
        className="badge rounded-pill"
        style={{ backgroundColor: style.bg, color: style.color, padding: '6px 12px' }}
      >
        {priority}
      </span>
    );
  };

  return (
    <div className="employee-portal p-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div className="mb-4">
        <h2 className="fw-bold mb-1" style={{ fontSize: '1.5rem', color: '#1F2937' }}>
          Support Portal
        </h2>
        <p className="text-muted" style={{ fontSize: '0.95rem' }}>
          Request assistance with your assigned assets
        </p>
      </div>

      {/* New Request Form */}
      <div
        className="card mb-4"
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
            padding: '20px'
          }}
        >
          <h5 className="fw-bold mb-0" style={{ fontSize: '1.1rem', color: '#1F2937' }}>
            Submit a New Request
          </h5>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmitTicket}>
            {/* Asset Selection */}
            <div className="mb-4">
              <label className="form-label fw-semibold" style={{ fontSize: '0.95rem' }}>
                Select Asset *
              </label>
              <select
                className={`form-select ${errors.assetId ? 'is-invalid' : ''}`}
                value={assetId}
                onChange={(e) => {
                  setAssetId(e.target.value);
                  if (e.target.value) setErrors(prev => ({ ...prev, assetId: '' }));
                }}
                disabled={assetsLoading || createMutation.isPending}
                style={{
                  borderRadius: '6px',
                  borderColor: errors.assetId ? '#DC2626' : '#D1D5DB',
                  fontSize: '0.95rem',
                  padding: '10px 12px'
                }}
              >
                <option value="">-- Select your asset --</option>
                {myAssets.map(asset => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.serialNumber})
                  </option>
                ))}
              </select>
              {errors.assetId && (
                <div className="invalid-feedback d-block" style={{ color: '#DC2626', fontSize: '0.9rem' }}>
                  {errors.assetId}
                </div>
              )}
              {myAssets.length === 0 && !assetsLoading && (
                <small className="text-muted d-block mt-2">
                  You have no assigned assets
                </small>
              )}
            </div>

            {/* Issue Description */}
            <div className="mb-4">
              <label className="form-label fw-semibold" style={{ fontSize: '0.95rem' }}>
                Describe the Issue *
              </label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                rows="4"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (e.target.value.length >= 10) setErrors(prev => ({ ...prev, description: '' }));
                }}
                placeholder="Please provide details about the issue (minimum 10 characters)"
                disabled={createMutation.isPending}
                style={{
                  borderRadius: '6px',
                  borderColor: errors.description ? '#DC2626' : '#D1D5DB',
                  fontSize: '0.95rem',
                  padding: '10px 12px'
                }}
              />
              <div
                style={{
                  marginTop: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {errors.description && (
                  <div style={{ color: '#DC2626', fontSize: '0.9rem' }}>
                    {errors.description}
                  </div>
                )}
                <small
                  className="text-muted"
                  style={{
                    fontSize: '0.85rem',
                    marginLeft: 'auto'
                  }}
                >
                  {description.length}/10 (minimum)
                </small>
              </div>
            </div>

            {/* Priority Selection */}
            <div className="mb-4">
              <label className="form-label fw-semibold" style={{ fontSize: '0.95rem' }}>
                Priority Level *
              </label>
              <select
                className={`form-select ${errors.priority ? 'is-invalid' : ''}`}
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  setErrors(prev => ({ ...prev, priority: '' }));
                }}
                disabled={createMutation.isPending}
                style={{
                  borderRadius: '6px',
                  borderColor: errors.priority ? '#DC2626' : '#D1D5DB',
                  fontSize: '0.95rem',
                  padding: '10px 12px'
                }}
              >
                <option value="LOW">Low - Can wait</option>
                <option value="MEDIUM">Medium - Standard</option>
                <option value="HIGH">High - Urgent</option>
                <option value="CRITICAL">Critical - Immediate attention needed</option>
              </select>
              {errors.priority && (
                <div className="invalid-feedback d-block" style={{ color: '#DC2626', fontSize: '0.9rem' }}>
                  {errors.priority}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="d-grid">
              <button
                type="submit"
                className="btn"
                disabled={createMutation.isPending || !myAssets.length}
                style={{
                  backgroundColor: '#2563EB',
                  color: '#FFFFFF',
                  borderRadius: '6px',
                  fontSize: '1rem',
                  fontWeight: '500',
                  border: 'none',
                  padding: '12px 16px',
                  cursor: createMutation.isPending ? 'not-allowed' : 'pointer',
                  opacity: createMutation.isPending || !myAssets.length ? 0.6 : 1
                }}
              >
                {createMutation.isPending ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* My Tickets Grid */}
      <div
        className="card"
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
            padding: '20px'
          }}
        >
          <h5 className="fw-bold mb-0" style={{ fontSize: '1.1rem', color: '#1F2937' }}>
            My Support Requests
          </h5>
        </div>

        <div className="card-body p-0">
          {ticketsLoading && (
            <div className="d-flex justify-content-center align-items-center py-5">
              <Loader size={24} className="text-primary" />
            </div>
          )}

          {!ticketsLoading && myTickets.length === 0 && (
            <div className="p-4 text-center text-muted">
              <p>No support requests yet. Submit one above to get started.</p>
            </div>
          )}

          {!ticketsLoading && myTickets.length > 0 && (
            <div className="table-responsive">
              <table className="table mb-0 align-middle">
                <thead style={{ backgroundColor: '#F9FAFB' }}>
                  <tr>
                    <th
                      className="text-muted fw-bold"
                      style={{
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px',
                        padding: '16px 24px',
                        borderBottom: '1px solid #E5E7EB'
                      }}
                    >
                      TICKET ID
                    </th>
                    <th
                      className="text-muted fw-bold"
                      style={{
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px',
                        padding: '16px 24px',
                        borderBottom: '1px solid #E5E7EB'
                      }}
                    >
                      ASSET
                    </th>
                    <th
                      className="text-muted fw-bold"
                      style={{
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px',
                        padding: '16px 24px',
                        borderBottom: '1px solid #E5E7EB'
                      }}
                    >
                      PRIORITY
                    </th>
                    <th
                      className="text-muted fw-bold"
                      style={{
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px',
                        padding: '16px 24px',
                        borderBottom: '1px solid #E5E7EB'
                      }}
                    >
                      STATUS
                    </th>
                    <th
                      className="text-muted fw-bold"
                      style={{
                        fontSize: '0.75rem',
                        letterSpacing: '0.5px',
                        padding: '16px 24px',
                        borderBottom: '1px solid #E5E7EB'
                      }}
                    >
                      CREATED
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {myTickets.map(ticket => (
                    <tr key={ticket.id} style={{ borderBottom: '1px solid #E5E7EB' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div className="fw-bold" style={{ fontSize: '0.95rem', color: '#1F2937' }}>
                          #{ticket.id}
                        </div>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontSize: '0.95rem', color: '#374151' }}>
                          {ticket.assetName || 'Unknown'}
                        </div>
                        <small className="text-muted">{ticket.serialNumber}</small>
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {getPriorityBadge(ticket.priority)}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        {getStatusBadge(ticket.status)}
                      </td>
                      <td style={{ padding: '16px 24px' }}>
                        <small className="text-muted">
                          {ticket.createdAt
                            ? new Date(ticket.createdAt).toLocaleDateString()
                            : 'N/A'}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeePortal;
