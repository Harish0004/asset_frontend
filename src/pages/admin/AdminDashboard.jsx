import React from 'react';
import { Package, UserCheck, Box, Ticket, Wrench, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="dashboard-container p-2" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="mb-4">
        <h2 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Executive Dashboard</h2>
        <p className="text-muted" style={{ fontSize: '0.95rem' }}>Real-time overview of the enterprise asset estate.</p>
      </div>

      {/* Stats Row */}
      <div className="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-3 mb-4">
        {/* Card 1 */}
        <div className="col">
          <div className="fluent-card h-100 mb-0 py-3 px-3 shadow-sm" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>TOTAL ASSETS</span>
              <div className="rounded d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                <Package size={18} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-dark">12</h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Across all categories</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="col">
          <div className="fluent-card h-100 mb-0 py-3 px-3 shadow-sm" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>ASSIGNED</span>
              <div className="rounded d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', backgroundColor: '#DBEAFE', color: '#1E40AF' }}>
                <UserCheck size={18} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-dark">5</h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Active allocations</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="col">
          <div className="fluent-card h-100 mb-0 py-3 px-3 shadow-sm" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>AVAILABLE</span>
              <div className="rounded d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', backgroundColor: '#D1FAE5', color: '#065F46' }}>
                <Box size={18} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-dark">5</h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Ready for issue</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="col">
          <div className="fluent-card h-100 mb-0 py-3 px-3 shadow-sm" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>OPEN TICKETS</span>
              <div className="rounded d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', backgroundColor: '#FEF3C7', color: '#92400E' }}>
                <Ticket size={18} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-dark">4</h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Awaiting action</p>
          </div>
        </div>

        {/* Card 5 */}
        <div className="col">
          <div className="fluent-card h-100 mb-0 py-3 px-3 shadow-sm" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="text-muted fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>MAINTENANCE DUE</span>
              <div className="rounded d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', backgroundColor: '#FEE2E2', color: '#991B1B' }}>
                <Wrench size={18} />
              </div>
            </div>
            <h2 className="fw-bold mb-1 text-dark">1</h2>
            <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Repair / damaged</p>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Recent Asset Activity */}
        <div className="col-lg-7">
          <div className="fluent-card h-100 mb-0 shadow-sm p-0" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <div>
                <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.05rem' }}>Recent Asset Activity</h6>
                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Latest assignments, returns & status changes</p>
              </div>
              <a href="#" className="text-dark text-decoration-none fw-semibold d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                View all <ArrowRight size={16} className="ms-1" />
              </a>
            </div>

            <div className="table-responsive">
              <table className="table mb-0 align-middle">
                <thead className="bg-light">
                  <tr>
                    <th className="text-muted fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '12px 24px', borderBottom: '1px solid #E5E7EB' }}>ASSET</th>
                    <th className="text-muted fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '12px 24px', borderBottom: '1px solid #E5E7EB' }}>ACTION</th>
                    <th className="text-muted fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '12px 24px', borderBottom: '1px solid #E5E7EB' }}>USER</th>
                    <th className="text-muted fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px', padding: '12px 24px', borderBottom: '1px solid #E5E7EB' }}>WHEN</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="fw-bold text-dark border-bottom" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>MacBook Air M3</td>
                    <td className="text-muted border-bottom" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>Issued to employee</td>
                    <td className="text-muted border-bottom" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>emma.wilson@company.com</td>
                    <td className="text-muted border-bottom" style={{ padding: '16px 24px', fontSize: '0.85rem' }}>32 minutes ago</td>
                  </tr>
                  <tr>
                    <td className="fw-bold text-dark border-bottom" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>iPhone 14</td>
                    <td className="text-muted border-bottom" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>Returned in Good condition</td>
                    <td className="text-muted border-bottom" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>carlos.mendez@company.com</td>
                    <td className="text-muted border-bottom" style={{ padding: '16px 24px', fontSize: '0.85rem' }}>about 3 hours ago</td>
                  </tr>
                  <tr>
                    <td className="fw-bold text-dark border-bottom" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>Dell XPS 15</td>
                    <td className="text-muted border-bottom" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>Critical ticket raised</td>
                    <td className="text-muted border-bottom" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>—</td>
                    <td className="text-muted border-bottom" style={{ padding: '16px 24px', fontSize: '0.85rem' }}>about 1 hour ago</td>
                  </tr>
                  <tr>
                    <td className="fw-bold text-dark" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>Herman Miller Aeron Chair</td>
                    <td className="text-muted" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>Issued to employee</td>
                    <td className="text-muted" style={{ padding: '16px 24px', fontSize: '0.9rem' }}>michael.brown@company.com</td>
                    <td className="text-muted" style={{ padding: '16px 24px', fontSize: '0.85rem' }}>2 days ago</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Urgent Tickets */}
        <div className="col-lg-5">
          <div className="fluent-card h-100 mb-0 shadow-sm p-0 d-flex flex-column" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
            <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
              <div>
                <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.05rem' }}>Urgent Tickets</h6>
                <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Highest priority open issues</p>
              </div>
              <a href="#" className="text-dark text-decoration-none fw-semibold d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                Open queue <ArrowRight size={16} className="ms-1" />
              </a>
            </div>

            <div className="d-flex flex-column flex-grow-1">
              {/* Ticket 1 */}
              <div className="p-3 border-bottom position-relative bg-white">
                <div className="d-flex align-items-center mb-2 gap-2">
                  <span className="badge rounded-pill" style={{ backgroundColor: '#FEE2E2', color: '#991B1B', padding: '4px 8px', fontSize: '0.75rem', fontWeight: '600' }}>
                    <span className="d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px', backgroundColor: '#DC2626' }}></span> Critical
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>TKT-1041</span>
                </div>
                <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '0.95rem' }}>Dell XPS 15</h6>
                <p className="text-muted mb-0 pe-5" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>Screen cracked after accidental drop, machine still boots but...</p>
                <button className="btn btn-light position-absolute border shadow-sm" style={{ top: '50%', right: '16px', transform: 'translateY(-50%)', padding: '4px 12px', fontSize: '0.85rem', fontWeight: '600', backgroundColor: '#F9FAFB' }}>View</button>
              </div>

              {/* Ticket 2 */}
              <div className="p-3 border-bottom position-relative bg-white">
                <div className="d-flex align-items-center mb-2 gap-2">
                  <span className="badge rounded-pill" style={{ backgroundColor: '#FEF3C7', color: '#92400E', padding: '4px 8px', fontSize: '0.75rem', fontWeight: '600' }}>
                    <span className="d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px', backgroundColor: '#D97706' }}></span> High
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>TKT-1042</span>
                </div>
                <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '0.95rem' }}>HP LaserJet Pro M404n</h6>
                <p className="text-muted mb-0 pe-5" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>Printer producing faded prints and frequent paper jams in tray 2.</p>
                <button className="btn btn-light position-absolute border shadow-sm" style={{ top: '50%', right: '16px', transform: 'translateY(-50%)', padding: '4px 12px', fontSize: '0.85rem', fontWeight: '600', backgroundColor: '#F9FAFB' }}>View</button>
              </div>

              {/* Ticket 3 */}
              <div className="p-3 border-bottom position-relative bg-white">
                <div className="d-flex align-items-center mb-2 gap-2">
                  <span className="badge rounded-pill" style={{ backgroundColor: '#DBEAFE', color: '#1E40AF', padding: '4px 8px', fontSize: '0.75rem', fontWeight: '600' }}>
                    <span className="d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px', backgroundColor: '#2563EB' }}></span> Medium
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>TKT-1039</span>
                </div>
                <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '0.95rem' }}>MacBook Pro 16"</h6>
                <p className="text-muted mb-0 pe-5" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>Battery drains rapidly, won't hold a charge for more than 2 hours.</p>
                <button className="btn btn-light position-absolute border shadow-sm" style={{ top: '50%', right: '16px', transform: 'translateY(-50%)', padding: '4px 12px', fontSize: '0.85rem', fontWeight: '600', backgroundColor: '#F9FAFB' }}>View</button>
              </div>

              {/* Ticket 4 */}
              <div className="p-3 position-relative bg-white">
                <div className="d-flex align-items-center mb-2 gap-2">
                  <span className="badge rounded-pill" style={{ backgroundColor: '#F3F4F6', color: '#4B5563', padding: '4px 8px', fontSize: '0.75rem', fontWeight: '600' }}>
                    <span className="d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px', backgroundColor: '#6B7280' }}></span> Low
                  </span>
                  <span className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>TKT-1037</span>
                </div>
                <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '0.95rem' }}>iPhone 15 Pro</h6>
                <p className="text-muted mb-0 pe-5" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>Camera app crashes intermittently after iOS update.</p>
                <button className="btn btn-light position-absolute border shadow-sm" style={{ top: '50%', right: '16px', transform: 'translateY(-50%)', padding: '4px 12px', fontSize: '0.85rem', fontWeight: '600', backgroundColor: '#F9FAFB' }}>View</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
