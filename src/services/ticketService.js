import api from './api';

// Utility to clean Hibernate lazy initialization properties
const cleanData = (data) => {
  if (Array.isArray(data)) {
    return data.map(item => cleanData(item));
  }
  if (data && typeof data === 'object') {
    const cleaned = {};
    for (const [key, value] of Object.entries(data)) {
      if (!key.includes('hibernateLazyInitializer') && !key.includes('handler')) {
        cleaned[key] = cleanData(value);
      }
    }
    return cleaned;
  }
  return data;
};

// Normalize ticket (flat DTO from API, or legacy nested entity)
const normalizeTicket = (ticket) => {
  if (!ticket) return ticket;

  return {
    ...ticket,
    assetName: ticket.assetName || ticket.asset?.name || 'Unknown Asset',
    serialNumber: ticket.serialNumber || ticket.asset?.serialNumber || 'N/A',
    raisedByUsername: ticket.raisedByUsername || ticket.raisedBy?.username || 'Unknown',
    technicianUsername: ticket.technicianUsername ?? ticket.technician?.username ?? null,
    deadlineAt: ticket.deadlineAt ?? null,
    resolvedAt: ticket.resolvedAt ?? null,
    slaBreached: Boolean(ticket.slaBreached),
  };
};

// Transform array of tickets
const normalizeTickets = (tickets) => {
  if (Array.isArray(tickets)) {
    return tickets.map(normalizeTicket);
  }
  return tickets;
};

// Ticket API calls
export const ticketService = {
  // Get all tickets (filtered by role)
  async getAllTickets() {
    try {
      const response = await api.get('/tickets');
      return normalizeTickets(cleanData(response.data));
    } catch (error) {
      console.error('Error fetching tickets:', error);
      throw error;
    }
  },

  // Create new ticket
  async createTicket(ticketData) {
    try {
      const response = await api.post('/tickets', ticketData);
      return normalizeTicket(cleanData(response.data));
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  // Dispatch ticket to technician
  async dispatchTicket(ticketId, technicianId) {
    try {
      const response = await api.put(`/tickets/${ticketId}/dispatch`, {
        technicianId
      });
      return normalizeTicket(cleanData(response.data));
    } catch (error) {
      console.error('Error dispatching ticket:', error);
      throw error;
    }
  },

  // Update ticket status
  async updateTicketStatus(ticketId, status) {
    try {
      const response = await api.put(`/tickets/${ticketId}/status?status=${status}`);
      return normalizeTicket(cleanData(response.data));
    } catch (error) {
      console.error('Error updating ticket status:', error);
      throw error;
    }
  },

  // Get available technicians (for admin dispatch)
  async getTechnicians() {
    try {
      const response = await api.get('/users');
      const allUsers = cleanData(response.data);
      // Filter to only technicians
      return allUsers.filter(user => user.role === 'TECHNICIAN');
    } catch (error) {
      console.error('Error fetching technicians:', error);
      throw error;
    }
  },

  // Get all assets (paginated fetch for dashboards / admin flows)
  async getAllAssets() {
    try {
      const response = await api.get('/assets?size=1000&page=0&sort=id,desc');
      return cleanData(response.data.content || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },

  // Get user's assigned assets (for employee ticket creation)
  async getMyAssets() {
    return this.getAllAssets();
  },

  // Get assignment history for admin dashboard activity feed
  async getAssignmentHistory() {
    try {
      const response = await api.get('/assets/history');
      return cleanData(response.data || []);
    } catch (error) {
      console.error('Error fetching assignment history:', error);
      throw error;
    }
  }
};

export default ticketService;
