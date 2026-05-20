import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Eye } from 'lucide-react';
import { useMyAssets } from '../../services/useTicketQueries';
import { isMaintenanceDue } from '../../utils/assetUtils';

const needsAttention = (asset) => {
  const status = asset.status?.toUpperCase();
  return status === 'UNDER_MAINTENANCE' || isMaintenanceDue(asset);
};

const EmployeeDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);

  const { data: allAssets = [], isLoading, isError } = useMyAssets({
    enabled: !!user?.username,
  });

  const assignedAssets = useMemo(() => {
    if (!user?.username) return [];
    return allAssets.filter((asset) =>
      asset.assignedToUsername?.toLowerCase() === user?.username?.toLowerCase()
    );
  }, [allAssets, user?.username]);

  const assignedCount = assignedAssets.length;
  const needsAttentionCount = useMemo(
    () => assignedAssets.filter(needsAttention).length,
    [assignedAssets]
  );

  const getStatusBadge = (status) => {
    if (!status) return null;
    const s = status.toUpperCase();
    if (s === 'ASSIGNED') return <span className="badge rounded-pill" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '6px 12px' }}><span className="d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px', backgroundColor: '#2563EB' }}></span> Assigned</span>;
    if (s === 'AVAILABLE') return <span className="badge rounded-pill" style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '6px 12px' }}><span className="d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px', backgroundColor: '#059669' }}></span> Available</span>;
    if (s === 'UNDER_MAINTENANCE') return <span className="badge rounded-pill" style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '6px 12px' }}><span className="d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px', backgroundColor: '#D97706' }}></span> Under Maintenance</span>;
    if (s === 'REPAIR_NEEDED' || s === 'REPAIR NEEDED') return <span className="badge rounded-pill" style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '6px 12px' }}><span className="d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px', backgroundColor: '#D97706' }}></span> Repair Needed</span>;
    return <span className="badge bg-secondary rounded-pill">{status}</span>;
  };

  const getConditionBadge = (condition) => {
    if (!condition) return null;
    const c = condition.toUpperCase();
    if (c === 'GOOD') return <span className="badge rounded-pill" style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '6px 12px' }}><span className="d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px', backgroundColor: '#059669' }}></span> Good</span>;
    if (c === 'REPAIR_NEEDED' || c === 'REPAIR NEEDED') return <span className="badge rounded-pill" style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '6px 12px' }}><span className="d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px', backgroundColor: '#D97706' }}></span> Repair Needed</span>;
    return <span className="badge bg-secondary rounded-pill">{condition}</span>;
  };

  const handleViewAsset = (asset) => {
    setSelectedAsset(asset);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setSelectedAsset(null);
  };

  return (
    <div className="dashboard-container p-2" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="mb-4 d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3">
        <div>
          <h2 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Employee Dashboard</h2>
          <p className="text-muted" style={{ fontSize: '0.95rem' }}>Your assigned assets and current status.</p>
        </div>
        <div className="text-sm-end">
          <p className="mb-1 text-muted" style={{ fontSize: '0.9rem' }}>Signed in as</p>
          <h6 className="mb-0 fw-bold">{user?.username || 'Employee'}</h6>
        </div>
      </div>

      <div className="row row-cols-1 row-cols-md-3 g-3 mb-4">
        <div className="col">
          <div className="fluent-card h-100 py-3 px-3 shadow-sm" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>MY ASSETS</span>
            </div>
            <h2 className="fw-bold mb-1 text-dark">{assignedCount}</h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Assets currently assigned to you</p>
          </div>
        </div>
        <div className="col">
          <div className="fluent-card h-100 py-3 px-3 shadow-sm" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>NEEDS ATTENTION</span>
            </div>
            <h2 className="fw-bold mb-1 text-dark">{needsAttentionCount}</h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Under maintenance or marked for repair</p>
          </div>
        </div>
        {/* 'Available' card removed per request */}
      </div>

      <div className="fluent-card shadow-sm p-4" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h5 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.1rem' }}>My Asset List</h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>Click an item to open the full details panel.</p>
          </div>
          <div className="text-muted" style={{ fontSize: '0.85rem' }}>{assignedCount} assets assigned</div>
        </div>

        <div className="table-responsive">
          <table className="table mb-0 align-middle table-hover">
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr>
                <th className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB' }}>ASSET</th>
                <th className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB' }}>TYPE</th>
                <th className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB' }}>STATUS</th>
                <th className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB' }}>CONDITION</th>
                <th className="text-muted fw-bold text-end" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan="5" className="text-center py-4">Loading assigned assets...</td></tr>
              )}
              {isError && (
                <tr><td colSpan="5" className="text-center py-4 text-danger">Unable to load assets. Please try again later.</td></tr>
              )}
              {!isLoading && !isError && assignedAssets.length === 0 && (
                <tr><td colSpan="5" className="text-center py-4 text-muted">No assets are currently assigned to you.</td></tr>
              )}
              {!isLoading && !isError && assignedAssets.map((asset) => (
                <tr key={asset.id} style={{ cursor: 'pointer' }} onClick={() => handleViewAsset(asset)}>
                  <td className="border-bottom" style={{ padding: '16px 24px' }}>
                    <div className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{asset.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>{asset.serialNumber}</div>
                  </td>
                  <td className="text-muted border-bottom" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{asset.type}</td>
                  <td className="border-bottom" style={{ padding: '16px 24px' }}>{getStatusBadge(asset.status)}</td>
                  <td className="border-bottom" style={{ padding: '16px 24px' }}>{getConditionBadge(asset.conditionState)}</td>
                  <td className="border-bottom text-end" style={{ padding: '16px 24px' }}>
                    <button className="btn btn-sm btn-light border" onClick={(e) => { e.stopPropagation(); handleViewAsset(asset); }}>
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showViewModal && selectedAsset && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow" style={{ borderRadius: '12px' }}>
              <div className="modal-header border-bottom-0 pb-0">
                <div>
                  <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                    {selectedAsset.name}
                    <span className="badge bg-light text-dark border" style={{ fontSize: '0.75rem' }}>{selectedAsset.type}</span>
                  </h5>
                  <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>{selectedAsset.serialNumber}</p>
                </div>
                <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body pt-0">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="fluent-card p-3 h-100" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                      <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>Status</p>
                      {getStatusBadge(selectedAsset.status)}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="fluent-card p-3 h-100" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                      <p className="text-muted mb-2" style={{ fontSize: '0.85rem' }}>Condition</p>
                      {getConditionBadge(selectedAsset.conditionState)}
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-12">
                    <div className="fluent-card p-4" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                      <h6 className="fw-bold mb-3">Asset Details</h6>
                      <div className="row gy-3">
                        <div className="col-md-6">
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Asset Type</div>
                          <div className="fw-semibold text-dark">{selectedAsset.type}</div>
                        </div>
                        <div className="col-md-6">
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Serial Number</div>
                          <div className="fw-semibold text-dark">{selectedAsset.serialNumber}</div>
                        </div>
                        <div className="col-md-6">
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Assigned To</div>
                          <div className="fw-semibold text-dark">{selectedAsset.assignedToUsername || 'N/A'}</div>
                        </div>
                        <div className="col-md-6">
                          <div className="text-muted" style={{ fontSize: '0.8rem' }}>Created</div>
                          <div className="fw-semibold text-dark">{selectedAsset.createdAt ? new Date(selectedAsset.createdAt).toLocaleString() : 'Unknown'}</div>
                        </div>
                      </div>

                      {selectedAsset.metadata && Object.keys(selectedAsset.metadata).length > 0 && (
                        <div className="mt-4">
                          <h6 className="fw-bold mb-3">Metadata</h6>
                          <div className="row g-3">
                            {Object.entries(selectedAsset.metadata).map(([key, value]) => (
                              <div className="col-md-4" key={key}>
                                <div className="text-muted" style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</div>
                                <div className="fw-semibold text-dark">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
