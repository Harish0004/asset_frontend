import React from 'react';

export const formatDeadline = (deadlineAt) => {
  if (!deadlineAt) return 'N/A';
  return new Date(deadlineAt).toLocaleString();
};

const TicketSlaBadge = ({ ticket, className = '' }) => {
  if (!ticket?.deadlineAt && !ticket?.slaBreached) return null;

  const breached = ticket.slaBreached;
  const style = breached
    ? { backgroundColor: '#FEE2E2', color: '#991B1B' }
    : { backgroundColor: '#DBEAFE', color: '#1E40AF' };

  return (
    <span
      className={`badge rounded-pill ${className}`}
      style={{ ...style, padding: '6px 12px', fontSize: '0.75rem', fontWeight: 600 }}
    >
      {breached ? 'SLA Breached' : `Due: ${formatDeadline(ticket.deadlineAt)}`}
    </span>
  );
};

export default TicketSlaBadge;
