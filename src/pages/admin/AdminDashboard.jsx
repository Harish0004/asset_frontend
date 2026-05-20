import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, UserCheck, Box, Ticket, Wrench, ArrowRight, Loader } from 'lucide-react';
import { useTickets, useAllAssets, useAssignmentHistory } from '../../services/useTicketQueries';
import { isMaintenanceDue } from '../../utils/assetUtils';

const PRIORITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minute${mins !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `about ${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
};

const getPriorityBadge = (priority) => {
  const map = {
    CRITICAL: { bg: '#FEE2E2', color: '#991B1B', dot: '#DC2626', label: 'Critical' },
    HIGH: { bg: '#FEF3C7', color: '#92400E', dot: '#D97706', label: 'High' },
    MEDIUM: { bg: '#DBEAFE', color: '#1E40AF', dot: '#2563EB', label: 'Medium' },
    LOW: { bg: '#F3F4F6', color: '#4B5563', dot: '#6B7280', label: 'Low' },
  };
  const style = map[priority] || map.MEDIUM;
  return (
    <span className="badge rounded-pill" style={{ backgroundColor: style.bg, color: style.color, padding: '4px 8px', fontSize: '0.75rem', fontWeight: '600' }}>
      <span className="d-inline-block rounded-circle me-1" style={{ width: '6px', height: '6px', backgroundColor: style.dot }}></span>
      {style.label}
    </span>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { data: assets = [], isLoading: assetsLoading } = useAllAssets();
  const { data: tickets = [], isLoading: ticketsLoading } = useTickets();
  const { data: history = [], isLoading: historyLoading } = useAssignmentHistory();

  const stats = useMemo(() => {
    const totalAssets = assets.length;
    const assignedCount = assets.filter((a) => a.status === 'ASSIGNED').length;
    const availableCount = assets.filter((a) => a.status === 'AVAILABLE').length;
    const openTickets = tickets.filter((t) => t.status === 'OPEN').length;
    const maintenanceDue = assets.filter(isMaintenanceDue).length;
    return { totalAssets, assignedCount, availableCount, openTickets, maintenanceDue };
  }, [assets, tickets]);

  const recentActivity = useMemo(() => {
    const events = [];
    history.forEach((h) => {
      if (h.assignedAt) {
        events.push({
          id: `${h.id}-out`,
          assetName: h.asset?.name || 'Unknown Asset',
          action: 'Issued to employee',
          user: h.user?.email || h.user?.username || '—',
          when: h.assignedAt,
        });
      }
      if (h.returnedAt) {
        const condition = h.asset?.conditionState || 'GOOD';
        events.push({
          id: `${h.id}-in`,
          assetName: h.asset?.name || 'Unknown Asset',
          action: `Returned (${condition.replace(/_/g, ' ').toLowerCase()})`,
          user: h.user?.email || h.user?.username || '—',
          when: h.returnedAt,
        });
      }
    });
    tickets.slice(0, 20).forEach((t) => {
      events.push({
        id: `ticket-${t.id}`,
        assetName: t.assetName || 'Unknown Asset',
        action: `Ticket raised (${t.priority})`,
        user: t.raisedByUsername || '—',
        when: t.createdAt,
      });
    });
    return events
      .sort((a, b) => new Date(b.when) - new Date(a.when))
      .slice(0, 6);
  }, [history, tickets]);

  const urgentTickets = useMemo(() => {
    return tickets
      .filter((t) => t.status === 'OPEN')
      .sort((a, b) => {
        const pa = PRIORITY_ORDER[a.priority] ?? 99;
        const pb = PRIORITY_ORDER[b.priority] ?? 99;
        if (pa !== pb) return pa - pb;
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .slice(0, 4);
  }, [tickets]);

  const isLoading = assetsLoading || ticketsLoading || historyLoading;

  const statCards = [
    { label: 'TOTAL ASSETS', value: stats.totalAssets, sub: 'Across all categories', icon: Package, bg: '#DBEAFE', color: '#1E40AF' },
    { label: 'ASSIGNED', value: stats.assignedCount, sub: 'Active allocations', icon: UserCheck, bg: '#DBEAFE', color: '#1E40AF' },
    { label: 'AVAILABLE', value: stats.availableCount, sub: 'Ready for issue', icon: Box, bg: '#D1FAE5', color: '#065F46' },
    { label: 'OPEN TICKETS', value: stats.openTickets, sub: 'Awaiting action', icon: Ticket, bg: '#FEF3C7', color: '#92400E' },
    { label: 'MAINTENANCE DUE', value: stats.maintenanceDue, sub: 'Repair needed or damaged', icon: Wrench, bg: '#FEE2E2', color: '#991B1B' },
  ];

  return (
    <div className="dashboard-container p-2" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="mb-4">
        <h2 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Executive Dashboard</h2>
        <p className="text-muted" style={{ fontSize: '0.95rem' }}>Real-time overview of the enterprise asset estate.</p>
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center py-5">
          <Loader size={28} className="text-primary me-2" />
          <span className="text-muted">Loading dashboard data...</span>
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-3 row-cols-lg-5 g-3 mb-4">
            {statCards.map((card) => {
              const Icon = card.icon;
              return (
                <div className="col" key={card.label}>
                  <div className="fluent-card h-100 mb-0 py-3 px-3 shadow-sm" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="text-muted fw-semibold" style={{ fontSize: '0.7rem', letterSpacing: '0.5px' }}>{card.label}</span>
                      <div className="rounded d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', backgroundColor: card.bg, color: card.color }}>
                        <Icon size={18} />
                      </div>
                    </div>
                    <h2 className="fw-bold mb-1 text-dark">{card.value}</h2>
                    <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>{card.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="row g-4">
            <div className="col-lg-7">
              <div className="fluent-card h-100 mb-0 shadow-sm p-0" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                  <div>
                    <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.05rem' }}>Recent Asset Activity</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Latest assignments, returns &amp; status changes</p>
                  </div>
                  <Link to="/admin/assignments" className="text-dark text-decoration-none fw-semibold d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                    View all <ArrowRight size={16} className="ms-1" />
                  </Link>
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
                      {recentActivity.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center text-muted py-4">No recent activity recorded.</td>
                        </tr>
                      ) : (
                        recentActivity.map((row, idx) => (
                          <tr key={row.id}>
                            <td className={`fw-bold text-dark ${idx < recentActivity.length - 1 ? 'border-bottom' : ''}`} style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{row.assetName}</td>
                            <td className={`text-muted ${idx < recentActivity.length - 1 ? 'border-bottom' : ''}`} style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{row.action}</td>
                            <td className={`text-muted ${idx < recentActivity.length - 1 ? 'border-bottom' : ''}`} style={{ padding: '16px 24px', fontSize: '0.9rem' }}>{row.user}</td>
                            <td className={`text-muted ${idx < recentActivity.length - 1 ? 'border-bottom' : ''}`} style={{ padding: '16px 24px', fontSize: '0.85rem' }}>{formatRelativeTime(row.when)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="col-lg-5">
              <div className="fluent-card h-100 mb-0 shadow-sm p-0 d-flex flex-column" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
                <div className="d-flex justify-content-between align-items-center p-4 border-bottom">
                  <div>
                    <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.05rem' }}>Urgent Tickets</h6>
                    <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Highest priority open issues</p>
                  </div>
                  <Link to="/admin/tickets" className="text-dark text-decoration-none fw-semibold d-flex align-items-center" style={{ fontSize: '0.9rem' }}>
                    Open queue <ArrowRight size={16} className="ms-1" />
                  </Link>
                </div>

                <div className="d-flex flex-column flex-grow-1">
                  {urgentTickets.length === 0 ? (
                    <div className="p-4 text-center text-muted">No open tickets at the moment.</div>
                  ) : (
                    urgentTickets.map((t, idx) => (
                      <div
                        key={t.id}
                        className={`p-3 position-relative bg-white ${idx < urgentTickets.length - 1 ? 'border-bottom' : ''}`}
                      >
                        <div className="d-flex align-items-center mb-2 gap-2">
                          {getPriorityBadge(t.priority)}
                          <span className="text-muted" style={{ fontSize: '0.8rem', letterSpacing: '0.5px' }}>TKT-{t.id}</span>
                        </div>
                        <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '0.95rem' }}>{t.assetName}</h6>
                        <p className="text-muted mb-0 pe-5" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                          {t.issueDescription?.length > 80
                            ? `${t.issueDescription.slice(0, 80)}...`
                            : t.issueDescription}
                        </p>
                        <button
                          type="button"
                          className="btn btn-light position-absolute border shadow-sm"
                          style={{ top: '50%', right: '16px', transform: 'translateY(-50%)', padding: '4px 12px', fontSize: '0.85rem', fontWeight: '600', backgroundColor: '#F9FAFB' }}
                          onClick={() => navigate('/admin/tickets')}
                        >
                          View
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
