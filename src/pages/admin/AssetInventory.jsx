import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Plus, Eye, Edit2, Save, X } from 'lucide-react';
import api from '../../services/api';
import Pagination from '../../components/Pagination';

const fetchAssets = async ({ queryKey }) => {
  const [_key, { search, type, status, page, size }] = queryKey;
  let params = new URLSearchParams();
  if (search) params.append('search', search);
  if (type) params.append('type', type);
  if (status) params.append('status', status);
  params.append('page', String(page ?? 0));
  params.append('size', String(size ?? 10));

  const response = await api.get(`/assets?${params.toString()}`);
  return response.data; // Expected Page<AssetResponseDTO>
};

const AssetInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addType, setAddType] = useState('');

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isEditingLaptop, setIsEditingLaptop] = useState(false);
  const [editRam, setEditRam] = useState('');
  const [editStorage, setEditStorage] = useState('');

  const queryClient = useQueryClient();

  const { data: assetsPage, isLoading, isError } = useQuery({
    queryKey: ['assets', { search: searchTerm, type: filterType, status: filterStatus, page, size: pageSize }],
    queryFn: fetchAssets,
    keepPreviousData: true
  });

  // Reset to first page when filters change
  useEffect(() => {
    setPage(0);
  }, [searchTerm, filterType, filterStatus]);

  const addAssetMutation = useMutation({
    mutationFn: (newAsset) => api.post('/assets', newAsset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      handleCloseAddModal();
    }
  });

  // No PUT endpoint exists in backend, so we will update the local cache directly
  const updateAssetMutation = useMutation({
    mutationFn: async (updatedAsset) => {
      // Simulate API delay
      return new Promise((resolve) => setTimeout(() => resolve(updatedAsset), 500));
    },
    onSuccess: (updatedAsset) => {
      // Update local cache manually since we are simulating the update
      queryClient.setQueryData(
        ['assets', { search: searchTerm, type: filterType, status: filterStatus }],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            content: oldData.content.map(a => a.id === updatedAsset.id ? updatedAsset : a)
          };
        }
      );
      setSelectedAsset(updatedAsset);
      setIsEditingLaptop(false);
    }
  });

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setAddType('');
  };

  const handleViewAsset = (asset) => {
    setSelectedAsset(asset);
    setShowViewModal(true);
    setIsEditingLaptop(false);
        if (asset.type === 'Laptop' && asset.metadata) {
      setEditRam(asset.metadata.ram || '');
      setEditStorage(asset.metadata.storage || '');
    }
  };

  const handleSaveLaptopSpecs = () => {
    if (!selectedAsset) return;

    // Copy the entire asset and update only the specific metadata fields
    const updatedMetadata = {
      ...selectedAsset.metadata,
      ram: editRam,
      storage: editStorage
    };

    const updatedAsset = {
      ...selectedAsset,
      metadata: updatedMetadata
    };

    updateAssetMutation.mutate(updatedAsset);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const metadata = {};

    for (let [key, value] of formData.entries()) {
      if (key.startsWith('meta_')) {
        const cleanKey = key.replace('meta_', '');
        metadata[cleanKey] = value;
      }
    }

    const newAsset = {
      name: formData.get('name'),
      type: formData.get('type'),
      serialNumber: formData.get('serialNumber'),
      metadata: metadata
    };

    console.log(newAsset);

    addAssetMutation.mutate(newAsset);
  };

  const assets = assetsPage?.content || [];
  const totalAssets = assetsPage?.totalElements || 0;
  const totalPages = assetsPage?.totalPages || 0;

  const getStatusBadge = (status) => {
    if (!status) return null;
    const s = status.toUpperCase();
    if (s === 'ASSIGNED') return <span className="badge rounded-pill" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '6px 12px' }}><span className="d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px', backgroundColor: '#2563EB' }}></span> Assigned</span>;
    if (s === 'AVAILABLE') return <span className="badge rounded-pill" style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '6px 12px' }}><span className="d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px', backgroundColor: '#059669' }}></span> Available</span>;
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

  return (
    <div className="p-3" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="mb-4">
        <h2 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Asset Inventory</h2>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
          {totalAssets} assets • Page {totalPages ? page + 1 : 0} of {totalPages || 0}
        </p>
      </div>

      <div className="fluent-card shadow-sm p-4 mb-0" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF' }}>
        {/* Filters and Actions */}
        <div className="d-flex flex-wrap gap-3 mb-4">
          <div className="flex-grow-1 position-relative" style={{ maxWidth: '500px' }}>
            <Search size={18} className="position-absolute text-muted" style={{ top: '50%', left: '16px', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-control ps-5"
              placeholder="Search by name, ID, or assignee..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ borderRadius: '8px', border: '1px solid #E5E7EB', padding: '10px' }}
            />
          </div>

          <select
            className="form-select"
            style={{ width: '180px', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '10px' }}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Laptop">Laptop</option>
            <option value="Mobile">Mobile</option>
            <option value="Printer">Printer</option>
            <option value="Vehicle">Vehicle</option>
          </select>

          <select
            className="form-select"
            style={{ width: '180px', borderRadius: '8px', border: '1px solid #E5E7EB', padding: '10px' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="REPAIR_NEEDED">Repair Needed</option>
          </select>

          <div className="ms-auto">
            <button
              className="btn fw-semibold d-flex align-items-center gap-2"
              style={{ backgroundColor: '#312E81', color: 'white', padding: '10px 20px', borderRadius: '8px' }}
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={18} /> Add Asset
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table mb-0 align-middle table-hover">
            <thead style={{ backgroundColor: '#F9FAFB' }}>
              <tr>
                <th className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>ASSET</th>
                <th className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>TYPE</th>
                <th className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>STATUS</th>
                <th className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>ASSIGNEE</th>
                <th className="text-muted fw-bold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>CONDITION</th>
                <th className="text-muted fw-bold text-end" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '16px 24px', borderBottom: '1px solid #E5E7EB', borderTop: '1px solid #E5E7EB' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan="6" className="text-center py-4">Loading assets...</td></tr>}
              {isError && <tr><td colSpan="6" className="text-center py-4 text-danger">Failed to fetch assets from backend.</td></tr>}
              {!isLoading && !isError && assets.length === 0 && <tr><td colSpan="6" className="text-center py-4 text-muted">No assets found matching the current filters.</td></tr>}
              {!isLoading && !isError && assets.map((asset) => (
                <tr key={asset.id} style={{ cursor: 'pointer' }} onClick={() => handleViewAsset(asset)}>
                  <td className="border-bottom" style={{ padding: '16px 24px' }}>
                    <div className="fw-bold text-dark" style={{ fontSize: '0.95rem', color: '#1E40AF' }}>{asset.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.8rem' }}>{asset.serialNumber}</div>
                  </td>
                  <td className="text-muted border-bottom" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{asset.type}</td>
                  <td className="border-bottom" style={{ padding: '16px 24px' }}>
                    {getStatusBadge(asset.status)}
                  </td>
                  <td className="text-muted border-bottom" style={{ padding: '16px 24px', fontSize: '0.9rem', fontStyle: !asset.assignedToUsername ? 'italic' : 'normal' }}>
                    {asset.assignedToUsername || 'Unassigned'}
                  </td>
                  <td className="border-bottom" style={{ padding: '16px 24px' }}>
                    {getConditionBadge(asset.conditionState)}
                  </td>
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

        <div className="pt-3">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            showPageSize
            pageSize={pageSize}
            onPageSizeChange={(next) => {
              setPageSize(next);
              setPage(0);
            }}
          />
        </div>
      </div>

      {/* View Detailed Info Modal */}
      {showViewModal && selectedAsset && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow" style={{ borderRadius: '12px' }}>
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                  {selectedAsset.name}
                  <span className="badge bg-light text-dark border ms-2" style={{ fontSize: '0.75rem' }}>{selectedAsset.type}</span>
                </h5>
                <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
              </div>
              <div className="modal-body pt-4">

                <div className="row mb-4">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <div className="p-3 bg-light rounded border h-100">
                      <h6 className="fw-bold mb-3 text-dark" style={{ fontSize: '0.9rem' }}>General Information</h6>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small fw-semibold">Tracking ID:</span>
                        <span className="text-dark small">{selectedAsset.serialNumber}</span>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small fw-semibold">Status:</span>
                        <div>{getStatusBadge(selectedAsset.status)}</div>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small fw-semibold">Condition:</span>
                        <div>{getConditionBadge(selectedAsset.conditionState)}</div>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted small fw-semibold">Assignee:</span>
                        <span className="text-dark small">{selectedAsset.assignedToUsername || 'None'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="p-3 bg-light rounded border h-100 position-relative">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '0.9rem' }}>Hardware Specifications</h6>

                        {/* Laptop Edit Toggle Button */}
                        {selectedAsset.type === 'Laptop' && !isEditingLaptop && (
                          <button
                            className="btn btn-sm btn-outline-primary d-flex align-items-center py-1 px-2"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => setIsEditingLaptop(true)}
                          >
                            <Edit2 size={12} className="me-1" /> Edit Memory
                          </button>
                        )}
                        {selectedAsset.type === 'Laptop' && isEditingLaptop && (
                          <button
                            className="btn btn-sm btn-outline-secondary d-flex align-items-center py-1 px-2"
                            style={{ fontSize: '0.75rem' }}
                            onClick={() => setIsEditingLaptop(false)}
                          >
                            <X size={12} className="me-1" /> Cancel
                          </button>
                        )}
                      </div>

                      {/* Laptop Edit Mode */}
                      {isEditingLaptop ? (
                        <div className="mt-2">
                          <div className="mb-2">
                            <label className="text-muted small fw-semibold mb-1">RAM Capacity</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editRam}
                              onChange={(e) => setEditRam(e.target.value)}
                            />
                          </div>
                          <div className="mb-3">
                            <label className="text-muted small fw-semibold mb-1">SSD / Storage</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              value={editStorage}
                              onChange={(e) => setEditStorage(e.target.value)}
                            />
                          </div>
                          <button
                            className="btn btn-sm btn-primary w-100 d-flex align-items-center justify-content-center"
                            onClick={handleSaveLaptopSpecs}
                            disabled={updateAssetMutation.isLoading}
                          >
                            {updateAssetMutation.isLoading ? 'Saving...' : <><Save size={14} className="me-2" /> Save Specifications</>}
                          </button>
                        </div>
                      ) : (
                        /* Read-Only Metadata Specs */
                        <>
                          {selectedAsset.metadata && Object.keys(selectedAsset.metadata).length > 0 ? (
                            Object.entries(selectedAsset.metadata).map(([key, value]) => (
                              <div className="d-flex justify-content-between mb-2" key={key}>
                                <span className="text-muted small fw-semibold text-capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                <span className="text-dark small text-end fw-medium">{value}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-muted small text-center mt-4">No specific metadata recorded for this asset.</div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light border fw-semibold w-100" onClick={() => setShowViewModal(false)}>Close Details</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 shadow" style={{ borderRadius: '12px' }}>
              <div className="modal-header border-bottom-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">Add New Asset</h5>
                <button type="button" className="btn-close" onClick={handleCloseAddModal}></button>
              </div>
              <div className="modal-body pt-4">
                <form id="addAssetForm" onSubmit={handleAddSubmit}>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-muted small">Asset Name</label>
                      <input type="text" name="name" className="form-control" placeholder="e.g. MacBook Pro 16&quot;" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-muted small">Asset Type</label>
                      <select name="type" className="form-select" value={addType} onChange={(e) => setAddType(e.target.value)} required>
                        <option value="">Select a type...</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Mobile">Mobile</option>
                        <option value="Printer">Printer</option>
                        <option value="Vehicle">Vehicle</option>
                      </select>
                    </div>
                  </div>

                  {/* Dynamic Form Fields based on Asset Type */}

                  {addType === 'Laptop' && (
                    <div className="p-3 bg-light rounded mb-3 border">
                      <h6 className="fw-semibold text-dark mb-3" style={{ fontSize: '0.85rem' }}>Laptop Specifications</h6>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-muted small">Brand</label>
                          <input type="text" name="meta_brand" className="form-control" required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-muted small">Processor</label>
                          <input type="text" name="meta_processor" className="form-control" placeholder="e.g. Apple M3 Max" required />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold text-muted small">RAM</label>
                          <input type="text" name="meta_ram" className="form-control" placeholder="e.g. 36GB" required />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold text-muted small">Storage</label>
                          <input type="text" name="meta_storage" className="form-control" placeholder="e.g. 1TB" required />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold text-muted small">Screen Size</label>
                          <input type="text" name="meta_screensize" className="form-control" placeholder="e.g. 16 inch" required />
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="form-label fw-semibold text-muted small">Serial Number</label>
                        <input type="text" name="serialNumber" className="form-control" placeholder="Device SN" required />
                      </div>
                    </div>
                  )}

                  {addType === 'Mobile' && (
                    <div className="p-3 bg-light rounded mb-3 border">
                      <h6 className="fw-semibold text-dark mb-3" style={{ fontSize: '0.85rem' }}>Mobile Specifications</h6>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-muted small">Brand</label>
                          <input type="text" name="meta_brand" className="form-control" required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-muted small">Processor</label>
                          <input type="text" name="meta_processor" className="form-control" placeholder="e.g. A17 Pro" required />
                        </div>
                      </div>
                      <div className="row mb-3">
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-muted small">RAM</label>
                          <input type="text" name="meta_ram" className="form-control" placeholder="e.g. 8GB" required />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-muted small">Storage</label>
                          <input type="text" name="meta_storage" className="form-control" placeholder="e.g. 256GB" required />
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="form-label fw-semibold text-muted small">Serial Number / IMEI</label>
                        <input type="text" name="serialNumber" className="form-control" placeholder="Device IMEI/SN" required />
                      </div>
                    </div>
                  )}

                  {addType === 'Vehicle' && (
                    <div className="p-3 bg-light rounded mb-3 border">
                      <h6 className="fw-semibold text-dark mb-3" style={{ fontSize: '0.85rem' }}>Vehicle Details</h6>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-muted small">Brand / Make</label>
                        <input type="text" name="meta_brand" className="form-control" placeholder="e.g. Toyota" required />
                      </div>
                      <div className="mb-2">
                        <label className="form-label fw-semibold text-muted small">Vehicle Number (Plate)</label>
                        <input type="text" name="serialNumber" className="form-control" placeholder="e.g. XYZ-1234" required />
                        <div className="form-text text-muted" style={{ fontSize: '0.75rem' }}>This serves as the primary tracking ID.</div>
                      </div>
                    </div>
                  )}

                  {addType === 'Printer' && (
                    <div className="p-3 bg-light rounded mb-3 border">
                      <h6 className="fw-semibold text-dark mb-3" style={{ fontSize: '0.85rem' }}>Printer Specifications</h6>
                      <div className="mb-3">
                        <label className="form-label fw-semibold text-muted small">Brand</label>
                        <input type="text" name="meta_brand" className="form-control" placeholder="e.g. HP" required />
                      </div>
                      <div className="mb-2">
                        <label className="form-label fw-semibold text-muted small">Serial Number</label>
                        <input type="text" name="serialNumber" className="form-control" required />
                      </div>
                    </div>
                  )}

                </form>
              </div>
              <div className="modal-footer border-top-0 pt-0">
                <button type="button" className="btn btn-light border fw-semibold" onClick={handleCloseAddModal}>Cancel</button>
                <button type="submit" form="addAssetForm" className="btn text-white fw-semibold" style={{ backgroundColor: '#312E81' }} disabled={addAssetMutation.isLoading}>
                  {addAssetMutation.isLoading ? 'Adding...' : 'Save Asset'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetInventory;
