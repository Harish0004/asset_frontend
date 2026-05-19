import React from 'react';

const TechDashboard = () => {
  return (
    <div>
      <h2 className="mb-4">My Work Queue - Technician Module Workspace</h2>
      
      <div className="row">
        <div className="col-md-6">
          <div className="fluent-card">
            <h5 className="text-muted mb-2">Pending Assignments</h5>
            <h3 className="fw-bold mb-0">8</h3>
            <span className="fluent-badge warning mt-3">High Priority: 2</span>
          </div>
        </div>
        <div className="col-md-6">
          <div className="fluent-card">
            <h5 className="text-muted mb-2">Completed Today</h5>
            <h3 className="fw-bold mb-0">3</h3>
            <span className="fluent-badge success mt-3">On track</span>
          </div>
        </div>
      </div>

      <div className="fluent-card mt-2">
        <h5 className="fw-bold mb-3">Task Overview</h5>
        <p className="text-muted">Placeholder for the technician's assigned tickets and maintenance schedule.</p>
      </div>
    </div>
  );
};

export default TechDashboard;
