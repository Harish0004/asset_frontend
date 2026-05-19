import React from 'react';
import { TrendingUp, Clock, FileText, FileSpreadsheet } from 'lucide-react';

const AdminReports = () => {
  return (
    <div className="reports-container p-2" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="mb-4">
        <h2 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Reports & Analytics</h2>
        <p className="text-muted" style={{ fontSize: '0.95rem' }}>Utilization insights and data exports for compliance review.</p>
      </div>

      {/* Stats Row */}
      <div className="row g-4 mb-4">
        {/* Card 1 */}
        <div className="col-md-3">
          <div className="fluent-card h-100 mb-0 py-3 px-4 shadow-sm d-flex flex-column" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>ASSET UTILIZATION</span>
              <TrendingUp size={16} className="text-success" />
            </div>
            <h2 className="fw-bold mb-3 text-dark">42%</h2>
            <div className="mt-auto">
              <div className="progress mb-2" style={{ height: '6px', backgroundColor: '#E0E7FF' }}>
                <div className="progress-bar" role="progressbar" style={{ width: '42%', backgroundColor: '#312E81' }} aria-valuenow="42" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>5 of 12 assets deployed</p>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col-md-3">
          <div className="fluent-card h-100 mb-0 py-3 px-4 shadow-sm d-flex flex-column" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>AVG RESOLUTION TIME</span>
              <Clock size={16} className="text-primary" />
            </div>
            <h2 className="fw-bold mb-3 text-dark">1.8 <span style={{ fontSize: '1.1rem', fontWeight: '500', color: '#4B5563' }}>days</span></h2>
            <div className="mt-auto">
              <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Across the last 30 days</p>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col-md-3">
          <div className="fluent-card h-100 mb-0 py-3 px-4 shadow-sm d-flex flex-column" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>ACTIVE TICKETS</span>
            </div>
            <h2 className="fw-bold mb-3 text-dark">4</h2>
            <div className="mt-auto">
              <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Open + In-Progress</p>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="col-md-3">
          <div className="fluent-card h-100 mb-0 py-3 px-4 shadow-sm d-flex flex-column" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>MAINTENANCE RATE</span>
            </div>
            <h2 className="fw-bold mb-3 text-dark">17%</h2>
            <div className="mt-auto">
              <div className="progress mb-2" style={{ height: '6px', backgroundColor: '#E0E7FF' }}>
                <div className="progress-bar" role="progressbar" style={{ width: '17%', backgroundColor: '#312E81' }} aria-valuenow="17" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
              <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Assets needing attention</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Utilization by Category */}
        <div className="col-lg-8">
          <div className="fluent-card h-100 mb-0 shadow-sm" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <div className="mb-4">
              <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.1rem' }}>Utilization by Category</h6>
              <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Deployment ratio across asset types</p>
            </div>

            <div className="d-flex flex-column gap-4">
              <CategoryBar label="Laptop" ratio="1/4" percent="25%" width="25" />
              <CategoryBar label="Monitor" ratio="2/2" percent="100%" width="100" />
              <CategoryBar label="Mobile" ratio="1/2" percent="50%" width="50" />
              <CategoryBar label="Printer" ratio="0/1" percent="0%" width="0" />
              <CategoryBar label="Furniture" ratio="1/2" percent="50%" width="50" />
              <CategoryBar label="Vehicle" ratio="0/1" percent="0%" width="0" />
            </div>
          </div>
        </div>

        {/* Export Center */}
        <div className="col-lg-4">
          <div className="fluent-card h-100 mb-0 shadow-sm" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <div className="mb-4 d-flex align-items-center gap-2">
              <div className="d-flex flex-column">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <FileText size={18} className="text-dark" />
                  <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '1.1rem' }}>Export Center</h6>
                </div>
                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Download structured data for archival or analysis.</p>
              </div>
            </div>

            <div className="d-flex flex-column gap-3">
              {/* Export Card 1 */}
              <div className="d-flex align-items-center p-3 border rounded-3" style={{ borderColor: '#E5E7EB', cursor: 'pointer', backgroundColor: '#FFFFFF' }}>
                <div className="rounded d-flex align-items-center justify-content-center me-3" style={{ minWidth: '40px', height: '40px', backgroundColor: '#D1FAE5' }}>
                  <FileSpreadsheet size={20} className="text-success" />
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-1" style={{ fontSize: '0.9rem', color: '#111827' }}>Asset Utilization Report</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>CSV • 12 records</p>
                </div>
                <div>
                  <span className="badge rounded-pill" style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '6px 12px', fontWeight: '600' }}>• CSV</span>
                </div>
              </div>

              {/* Export Card 2 */}
              <div className="d-flex align-items-center p-3 border rounded-3" style={{ borderColor: '#E5E7EB', cursor: 'pointer', backgroundColor: '#FFFFFF' }}>
                <div className="rounded d-flex align-items-center justify-content-center me-3" style={{ minWidth: '40px', height: '40px', backgroundColor: '#DBEAFE' }}>
                  <FileText size={20} className="text-primary" />
                </div>
                <div className="flex-grow-1">
                  <h6 className="fw-bold mb-1" style={{ fontSize: '0.9rem', color: '#111827' }}>Ticket Resolution Logs</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Excel • 5 records</p>
                </div>
                <div>
                  <span className="badge rounded-pill" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '6px 12px', fontWeight: '600' }}>• XLS</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for the progress bars
const CategoryBar = ({ label, ratio, percent, width }) => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{label}</span>
        <span className="text-muted" style={{ fontSize: '0.85rem' }}>{ratio} · {percent}</span>
      </div>
      <div className="progress" style={{ height: '8px', backgroundColor: '#E0E7FF', borderRadius: '4px' }}>
        <div className="progress-bar" role="progressbar" style={{ width: `${width}%`, backgroundColor: '#312E81', borderRadius: '4px' }} aria-valuenow={width} aria-valuemin="0" aria-valuemax="100"></div>
      </div>
    </div>
  );
};

export default AdminReports;
