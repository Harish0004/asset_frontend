import React from 'react';

const EmployeeDashboard = () => {
  return (
    <div>
      <h2 className="mb-4">My Assets - Employee Module Workspace</h2>
      
      <div className="row">
        <div className="col-md-6">
          <div className="fluent-card">
            <h5 className="text-muted mb-2">Assigned Devices</h5>
            <h3 className="fw-bold mb-0">2</h3>
            <span className="fluent-badge info mt-3">Laptop, Mobile</span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="fluent-card">
            <h5 className="text-muted mb-2">Open Requests</h5>
            <h3 className="fw-bold mb-0">0</h3>
            <span className="fluent-badge success mt-3">All issues resolved</span>
          </div>
        </div>
      </div>

      <div className="fluent-card mt-2">
        <h5 className="fw-bold mb-3">Current Devices</h5>
        <p className="text-muted">Placeholder for employee's currently assigned equipment and their status.</p>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
