import React from 'react';
import { TrendingUp, Clock, FileText, FileSpreadsheet, Loader, AlertTriangle } from 'lucide-react';
import { useReportsDashboard, useExportAssets, useExportTickets } from '../../services/useReportQueries';
import { useToast } from '../../components/Toast';

const AdminReports = () => {
  const { addToast } = useToast();
  const { data, isLoading, isError } = useReportsDashboard();
  const exportAssetsMutation = useExportAssets();
  const exportTicketsMutation = useExportTickets();

  const summary = data?.summary;
  const categories = data?.utilizationByCategory || [];
  const breachedTickets = data?.breachedTickets || [];

  const handleExportAssets = async () => {
    try {
      await exportAssetsMutation.mutateAsync();
      addToast('Asset report downloaded', 'success');
    } catch {
      addToast('Failed to export asset report', 'error');
    }
  };

  const handleExportTickets = async () => {
    try {
      await exportTicketsMutation.mutateAsync();
      addToast('Ticket logs downloaded', 'success');
    } catch {
      addToast('Failed to export ticket logs', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="reports-container p-2 d-flex justify-content-center align-items-center py-5" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <Loader size={28} className="text-primary me-2" />
        <span className="text-muted">Loading reports...</span>
      </div>
    );
  }

  if (isError || !summary) {
    return (
      <div className="reports-container p-2 text-center py-5 text-danger" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        Unable to load reports. Please try again later.
      </div>
    );
  }

  return (
    <div className="reports-container p-2" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div className="mb-4">
        <h2 className="fw-bold mb-1 text-dark" style={{ letterSpacing: '-0.5px' }}>Reports & Analytics</h2>
        <p className="text-muted" style={{ fontSize: '0.95rem' }}>Utilization insights and data exports for compliance review.</p>
      </div>

      <div className="row g-4 mb-4">
        <StatCard
          label="ASSET UTILIZATION"
          value={`${summary.assetUtilizationPercent}%`}
          sub={`${summary.assignedAssets} of ${summary.totalAssets} assets deployed`}
          progress={summary.assetUtilizationPercent}
          icon={<TrendingUp size={16} className="text-success" />}
        />
        <StatCard
          label="ACTIVE TICKETS"
          value={summary.activeTickets}
          sub="Open + In-Progress"
        />
        <StatCard
          label="MAINTENANCE RATE"
          value={`${summary.maintenanceRatePercent}%`}
          sub={`${summary.maintenanceDueCount} assets need repair or are damaged`}
          progress={summary.maintenanceRatePercent}
        />
      </div>

     

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="fluent-card h-100 mb-0 shadow-sm" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', padding: '24px' }}>
            <div className="mb-4">
              <h6 className="fw-bold mb-1 text-dark" style={{ fontSize: '1.1rem' }}>Utilization by Category</h6>
              <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>Deployment ratio across asset types</p>
            </div>

            <div className="d-flex flex-column gap-4">
              {categories.length === 0 ? (
                <p className="text-muted mb-0">No asset categories to display.</p>
              ) : (
                categories.map((cat) => (
                  <CategoryBar
                    key={cat.category}
                    label={cat.category}
                    ratio={`${cat.assigned}/${cat.total}`}
                    percent={`${cat.percent}%`}
                    width={cat.percent}
                  />
                ))
              )}
            </div>
          </div>
        </div>

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
              <ExportCard
                title="Asset Utilization Report"
                detail={`CSV • ${data.assetExportCount} records`}
                badgeLabel="CSV"
                badgeStyle={{ backgroundColor: '#D1FAE5', color: '#065F46' }}
                icon={<FileSpreadsheet size={20} className="text-success" />}
                iconBg="#D1FAE5"
                onClick={handleExportAssets}
                loading={exportAssetsMutation.isPending}
              />
              <ExportCard
                title="Ticket Resolution Logs"
                detail={`CSV • ${data.ticketExportCount} records (includes SLA breach flag)`}
                badgeLabel="CSV"
                badgeStyle={{ backgroundColor: '#DBEAFE', color: '#1E40AF' }}
                icon={<FileText size={20} className="text-primary" />}
                iconBg="#DBEAFE"
                onClick={handleExportTickets}
                loading={exportTicketsMutation.isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, sub, progress, icon }) => (
  <div className="col-md-3">
    <div className="fluent-card h-100 mb-0 py-3 px-4 shadow-sm d-flex flex-column" style={{ borderRadius: '12px', border: '1px solid #E5E7EB' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.5px' }}>{label}</span>
        {icon}
      </div>
      <h2 className="fw-bold mb-3 text-dark">{value}</h2>
      <div className="mt-auto">
        {progress != null && (
          <div className="progress mb-2" style={{ height: '6px', backgroundColor: '#E0E7FF' }}>
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: `${Math.min(progress, 100)}%`, backgroundColor: '#312E81' }}
            />
          </div>
        )}
        <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>{sub}</p>
      </div>
    </div>
  </div>
);

const ExportCard = ({ title, detail, badgeLabel, badgeStyle, icon, iconBg, onClick, loading }) => (
  <button
    type="button"
    className="d-flex align-items-center p-3 border rounded-3 w-100 text-start"
    style={{ borderColor: '#E5E7EB', cursor: loading ? 'wait' : 'pointer', backgroundColor: '#FFFFFF' }}
    onClick={onClick}
    disabled={loading}
  >
    <div className="rounded d-flex align-items-center justify-content-center me-3" style={{ minWidth: '40px', height: '40px', backgroundColor: iconBg }}>
      {icon}
    </div>
    <div className="flex-grow-1">
      <h6 className="fw-bold mb-1" style={{ fontSize: '0.9rem', color: '#111827' }}>{title}</h6>
      <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>{loading ? 'Preparing download...' : detail}</p>
    </div>
    <span className="badge rounded-pill" style={{ ...badgeStyle, padding: '6px 12px', fontWeight: '600' }}>
      • {badgeLabel}
    </span>
  </button>
);

const CategoryBar = ({ label, ratio, percent, width }) => (
  <div>
    <div className="d-flex justify-content-between align-items-center mb-2">
      <span className="fw-bold text-dark" style={{ fontSize: '0.95rem' }}>{label}</span>
      <span className="text-muted" style={{ fontSize: '0.85rem' }}>{ratio} · {percent}</span>
    </div>
    <div className="progress" style={{ height: '8px', backgroundColor: '#E0E7FF', borderRadius: '4px' }}>
      <div
        className="progress-bar"
        role="progressbar"
        style={{ width: `${width}%`, backgroundColor: '#312E81', borderRadius: '4px' }}
      />
    </div>
  </div>
);

export default AdminReports;
