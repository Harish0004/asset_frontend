import api from './api';

const downloadBlob = (content, filename, mimeType = 'text/csv') => {
  const blob = new Blob([content], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const reportService = {
  async getDashboard() {
    const response = await api.get('/admin/reports/dashboard');
    return response.data;
  },

  async exportAssets() {
    const response = await api.get('/admin/reports/export/assets', {
      responseType: 'text',
    });
    downloadBlob(response.data, 'asset-utilization-report.csv');
  },

  async exportTickets() {
    const response = await api.get('/admin/reports/export/tickets', {
      responseType: 'text',
    });
    downloadBlob(response.data, 'ticket-resolution-logs.csv');
  },
};

export default reportService;
