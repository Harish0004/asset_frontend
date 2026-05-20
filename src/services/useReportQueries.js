import { useQuery, useMutation } from '@tanstack/react-query';
import reportService from './reportService';

export const useReportsDashboard = (options = {}) => {
  return useQuery({
    queryKey: ['reportsDashboard'],
    queryFn: () => reportService.getDashboard(),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
};

export const useExportAssets = () => {
  return useMutation({
    mutationFn: () => reportService.exportAssets(),
  });
};

export const useExportTickets = () => {
  return useMutation({
    mutationFn: () => reportService.exportTickets(),
  });
};
