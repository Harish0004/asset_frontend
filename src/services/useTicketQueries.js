import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ticketService from './ticketService';

// Query hook: Fetch all tickets
export const useTickets = (options = {}) => {
  return useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketService.getAllTickets(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options
  });
};

// Query hook: Fetch technicians
export const useTechnicians = (options = {}) => {
  return useQuery({
    queryKey: ['technicians'],
    queryFn: () => ticketService.getTechnicians(),
    staleTime: 1000 * 60 * 10, // 10 minutes
    ...options
  });
};

// Query hook: Fetch user's assets
export const useMyAssets = (options = {}) => {
  return useQuery({
    queryKey: ['myAssets'],
    queryFn: () => ticketService.getMyAssets(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options
  });
};

// Query hook: Fetch all assets (admin dashboards, ticket creation)
export const useAllAssets = (options = {}) => {
  return useQuery({
    queryKey: ['allAssets'],
    queryFn: () => ticketService.getAllAssets(),
    staleTime: 1000 * 60 * 2,
    ...options
  });
};

// Query hook: Assignment history for admin activity feed
export const useAssignmentHistory = (options = {}) => {
  return useQuery({
    queryKey: ['assetHistory'],
    queryFn: () => ticketService.getAssignmentHistory(),
    staleTime: 1000 * 60 * 2,
    ...options
  });
};

// Mutation hook: Create ticket
export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ticketData) => ticketService.createTicket(ticketData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    }
  });
};

// Mutation hook: Dispatch ticket
export const useDispatchTicket = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, technicianId }) => 
      ticketService.dispatchTicket(ticketId, technicianId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    }
  });
};

// Mutation hook: Update ticket status
export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ticketId, status }) => 
      ticketService.updateTicketStatus(ticketId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    }
  });
};
