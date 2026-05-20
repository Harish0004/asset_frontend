import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import api from '../../services/api';
import Pagination from '../../components/Pagination';

const fetchUsers = async () => {
  const response = await api.get('/users');
  return response.data || [];
};

const fetchAssets = async ({ queryKey }) => {
  const [_key, status] = queryKey;
  const response = await api.get(`/assets?status=${status}&size=1000`);
  return response.data.content || [];
};

const fetchHistory = async () => {
  const response = await api.get(`/assets/history`);
  return response.data || [];
};

const AssetAssignment = () => {
  const queryClient = useQueryClient();

  // Issue Form State
  const [issueAssetId, setIssueAssetId] = useState('');
  const [issueEmployeeId, setIssueEmployeeId] = useState('');

  // Return Form State
  const [returnAssetId, setReturnAssetId] = useState('');
  const [returnCondition, setReturnCondition] = useState('GOOD');

  // Queries
  const { data: availableAssets = [] } = useQuery({
    queryKey: ['assetsForAssignment', 'AVAILABLE'],
    queryFn: fetchAssets
  });

  const { data: assignedAssets = [] } = useQuery({
    queryKey: ['assetsForAssignment', 'ASSIGNED'],
    queryFn: fetchAssets
  });

  const { data: historyData = [] } = useQuery({
    queryKey: ['assetHistory'],
    queryFn: fetchHistory
  });

  const { data: usersData = [] } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers
  });

  // Mutations
  const issueMutation = useMutation({
    mutationFn: (data) => api.put('/assets/assign', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['assetsForAssignment']);
      queryClient.invalidateQueries(['assetHistory']);
      setIssueAssetId('');
      setIssueEmployeeId('');
    }
  });

  const returnMutation = useMutation({
    mutationFn: (data) => api.put('/assets/return', data),
    onSuccess: () => {
      queryClient.invalidateQueries(['assetsForAssignment']);
      queryClient.invalidateQueries(['assetHistory']);
      setReturnAssetId('');
      setReturnCondition('GOOD');
    }
  });

  const handleIssue = (e) => {
    e.preventDefault();
    if (!issueAssetId || !issueEmployeeId) return;
    issueMutation.mutate({
      assetId: parseInt(issueAssetId),
      employeeId: parseInt(issueEmployeeId)
    });
  };

  const handleReturn = (e) => {
    e.preventDefault();
    if (!returnAssetId) return;
    returnMutation.mutate({
      assetId: parseInt(returnAssetId),
      conditionState: returnCondition
    });
  };

  // Transform history data to split check-in and check-out
  const formatHistory = () => {
    const list = [];
    historyData.forEach(h => {
      // Check-out event
      if (h.assignedAt) {
        list.push({
          id: `${h.id}-out`,
          timestamp: h.assignedAt,
          action: 'Check-out',
          assetName: h.asset?.name || 'Unknown Asset',
          employeeEmail: h.user?.email || 'Unknown User',
          detail: 'Issued to employee',
          rawDate: new Date(h.assignedAt).getTime()
        });
      }
      // Check-in event
      if (h.returnedAt) {
        list.push({
          id: `${h.id}-in`,
          timestamp: h.returnedAt,
          action: 'Check-in',
          assetName: h.asset?.name || 'Unknown Asset',
          employeeEmail: h.user?.email || 'Unknown User',
          detail: 'Returned to inventory',
          rawDate: new Date(h.returnedAt).getTime()
        });
      }
    });

    // Sort descending by rawDate
    list.sort((a, b) => b.rawDate - a.rawDate);
    return list;
  };

  const formattedHistory = formatHistory();
  const [historyPage, setHistoryPage] = useState(0);
  const [historyPageSize, setHistoryPageSize] = useState(5);

  const historyTotalPages = useMemo(() => {
    return Math.max(1, Math.ceil(formattedHistory.length / historyPageSize));
  }, [formattedHistory.length, historyPageSize]);

  const pagedHistory = useMemo(() => {
    const start = historyPage * historyPageSize;
    return formattedHistory.slice(start, start + historyPageSize);
  }, [formattedHistory, historyPage, historyPageSize]);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true
    });
  };

  return (
    <div className="p-3" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="mb-4">
        <h2 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Asset Assignment</h2>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>Issue and process returns. Stock counts update everywhere in real time.</p>
      </div>

      <div className="row g-4 mb-4">
        {/* Issue Asset Card */}
        <div className="col-md-6">
          <div className="fluent-card shadow-sm p-4 h-100" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-center mb-4">
              <div className="rounded p-2 me-3" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                <ArrowUpRight size={20} />
              </div>
              <div>
                <h5 className="fw-bold mb-0 text-dark">Issue Asset</h5>
                <small className="text-muted">{availableAssets.length} units available</small>
              </div>
            </div>

            <form onSubmit={handleIssue}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark small mb-1">Available Asset</label>
                <select 
                  className="form-select" 
                  style={{ borderRadius: '8px', border: '1px solid #E5E7EB', padding: '10px' }}
                  value={issueAssetId}
                  onChange={(e) => setIssueAssetId(e.target.value)}
                  required
                >
                  <option value="">Select an available asset</option>
                  {availableAssets.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.serialNumber})</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-dark small mb-1">Assign To</label>
                <select 
                  className="form-select" 
                  style={{ borderRadius: '8px', border: '1px solid #E5E7EB', padding: '10px' }}
                  value={issueEmployeeId}
                  onChange={(e) => setIssueEmployeeId(e.target.value)}
                  required
                >
                  <option value="">Search employees</option>
                  {usersData.map(e => (
                    <option key={e.id} value={e.id}>{e.username} ({e.email})</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit" 
                className="btn w-100 fw-semibold" 
                style={{ backgroundColor: '#312E81', color: 'white', padding: '12px', borderRadius: '8px' }}
                disabled={issueMutation.isLoading}
              >
                {issueMutation.isLoading ? 'Issuing...' : 'Issue Asset'}
              </button>
            </form>
          </div>
        </div>

        {/* Return Asset Card */}
        <div className="col-md-6">
          <div className="fluent-card shadow-sm p-4 h-100" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
            <div className="d-flex align-items-center mb-4">
              <div className="rounded p-2 me-3" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
                <ArrowDownLeft size={20} />
              </div>
              <div>
                <h5 className="fw-bold mb-0 text-dark">Return Asset</h5>
                <small className="text-muted">{assignedAssets.length} units in the field</small>
              </div>
            </div>

            <form onSubmit={handleReturn}>
              <div className="mb-3">
                <label className="form-label fw-semibold text-dark small mb-1">Assigned Asset</label>
                <select 
                  className="form-select" 
                  style={{ borderRadius: '8px', border: '1px solid #E5E7EB', padding: '10px' }}
                  value={returnAssetId}
                  onChange={(e) => setReturnAssetId(e.target.value)}
                  required
                >
                  <option value="">Select an assigned asset</option>
                  {assignedAssets.map(a => (
                    <option key={a.id} value={a.id}>{a.name} ({a.assignedToUsername})</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold text-dark small mb-2">Condition on Return</label>
                <div className="d-flex gap-2">
                  <label className={`flex-grow-1 border rounded p-2 text-center cursor-pointer ${returnCondition === 'GOOD' ? 'bg-light border-primary text-primary fw-semibold' : 'text-muted'}`} style={{ cursor: 'pointer' }}>
                    <input type="radio" name="condition" className="me-2" value="GOOD" checked={returnCondition === 'GOOD'} onChange={() => setReturnCondition('GOOD')} />
                    Good
                  </label>
                  <label className={`flex-grow-1 border rounded p-2 text-center cursor-pointer ${returnCondition === 'REPAIR_NEEDED' ? 'bg-light border-primary text-primary fw-semibold' : 'text-muted'}`} style={{ cursor: 'pointer' }}>
                    <input type="radio" name="condition" className="me-2" value="REPAIR_NEEDED" checked={returnCondition === 'REPAIR_NEEDED'} onChange={() => setReturnCondition('REPAIR_NEEDED')} />
                    Repair Needed
                  </label>
                  <label className={`flex-grow-1 border rounded p-2 text-center cursor-pointer ${returnCondition === 'DAMAGED' ? 'bg-light border-primary text-primary fw-semibold' : 'text-muted'}`} style={{ cursor: 'pointer' }}>
                    <input type="radio" name="condition" className="me-2" value="DAMAGED" checked={returnCondition === 'DAMAGED'} onChange={() => setReturnCondition('DAMAGED')} />
                    Damaged
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                className="btn w-100 fw-semibold mt-1" 
                style={{ backgroundColor: '#312E81', color: 'white', padding: '12px', borderRadius: '8px' }}
                disabled={returnMutation.isLoading}
              >
                {returnMutation.isLoading ? 'Processing...' : 'Process Return'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Audit Trail */}
      <div className="fluent-card shadow-sm p-4 mb-0" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
        <div className="mb-4">
          <h5 className="fw-bold mb-1 text-dark">Historical Audit Trail</h5>
          <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Complete record of check-ins and check-outs</p>
        </div>

        <div className="table-responsive">
          <table className="table mb-0 align-middle table-hover">
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr>
                <th className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>TIMESTAMP</th>
                <th className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>ACTION</th>
                <th className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>ASSET</th>
                <th className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>EMPLOYEE</th>
                <th className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>DETAIL</th>
              </tr>
            </thead>
            <tbody>
              {formattedHistory.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">No history found.</td>
                </tr>
              ) : (
                pagedHistory.map((row) => (
                  <tr key={row.id}>
                    <td className="text-muted border-bottom" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{formatDate(row.timestamp)}</td>
                    <td className="border-bottom" style={{ padding: '16px 24px' }}>
                      {row.action === 'Check-out' ? (
                        <span className="badge rounded-pill" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '6px 12px' }}>
                          <span className="d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px', backgroundColor: '#2563EB' }}></span> Check-out
                        </span>
                      ) : (
                        <span className="badge rounded-pill" style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '6px 12px' }}>
                          <span className="d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px', backgroundColor: '#059669' }}></span> Check-in
                        </span>
                      )}
                    </td>
                    <td className="border-bottom fw-bold text-dark" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{row.assetName}</td>
                    <td className="text-muted border-bottom" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{row.employeeEmail}</td>
                    <td className="text-muted border-bottom" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{row.detail}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-3">
          <Pagination
            page={Math.min(historyPage, historyTotalPages - 1)}
            totalPages={historyTotalPages}
            onPageChange={setHistoryPage}
            showPageSize
            pageSize={historyPageSize}
            onPageSizeChange={(next) => {
              setHistoryPageSize(next);
              setHistoryPage(0);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AssetAssignment;
