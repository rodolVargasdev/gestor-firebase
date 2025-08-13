import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type LicenseRequest, type LicenseAssignment, type SearchFilters, type SortOptions, type RequestStatus, type RequestPriority } from '../types';
import { RequestService } from '../services/requestService';

interface RequestState {
  // Datos
  requests: LicenseRequest[];
  assignments: LicenseAssignment[];
  currentRequest: LicenseRequest | null;
  currentAssignment: LicenseAssignment | null;
  
  // Estado de carga
  loading: boolean;
  error: string | null;
  
  // Paginación
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  
  // Filtros y ordenamiento
  filters: SearchFilters;
  sortOptions: SortOptions;
  
  // Estadísticas
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
    inProgress: number;
    byPriority: Record<RequestPriority, number>;
  } | null;
  
  // Estado de formularios
  isFormOpen: boolean;
  isAssignmentFormOpen: boolean;
}

interface RequestActions {
  // Carga de datos
  loadRequests: (page?: number, filters?: SearchFilters, sort?: SortOptions) => Promise<void>;
  loadRequestById: (id: string) => Promise<void>;
  loadAssignmentsByEmployee: (employeeId: string) => Promise<void>;
  loadRequestStats: () => Promise<void>;
  refreshRequests: () => Promise<void>;
  
  // CRUD de solicitudes
  createRequest: (requestData: Omit<LicenseRequest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateRequest: (id: string, updates: Partial<Omit<LicenseRequest, 'id' | 'createdAt'>>) => Promise<void>;
  deleteRequest: (id: string) => Promise<void>;
  
  // Acciones de aprobación
  approveRequest: (id: string, approvedBy: string, notes?: string) => Promise<void>;
  rejectRequest: (id: string, rejectedBy: string, rejectionReason: string) => Promise<void>;
  
  // CRUD de asignaciones
  createAssignment: (assignmentData: Omit<LicenseAssignment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAssignmentUsage: (id: string, usedQuantity: number, description?: string) => Promise<void>;
  
  // Búsqueda y filtros
  searchRequests: (searchTerm: string) => Promise<void>;
  getRequestsByStatus: (status: RequestStatus) => Promise<void>;
  getRequestsByEmployee: (employeeId: string) => Promise<void>;
  getRequestsByDepartment: (departmentId: string) => Promise<void>;
  
  // Gestión de estado
  setCurrentRequest: (request: LicenseRequest | null) => void;
  setCurrentAssignment: (assignment: LicenseAssignment | null) => void;
  openForm: (request?: LicenseRequest) => void;
  closeForm: () => void;
  openAssignmentForm: (assignment?: LicenseAssignment) => void;
  closeAssignmentForm: () => void;
  setFilters: (filters: SearchFilters) => void;
  setSortOptions: (sort: SortOptions) => void;
  setPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type RequestStore = RequestState & RequestActions;

const initialState: RequestState = {
  requests: [],
  assignments: [],
  currentRequest: null,
  currentAssignment: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalItems: 0,
  pageSize: 10,
  filters: {},
  sortOptions: { field: 'requestDate', direction: 'desc' },
  stats: null,
  isFormOpen: false,
  isAssignmentFormOpen: false,
};

export const useRequestStore = create<RequestStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Carga de datos
      loadRequests: async (page = 1, filters = get().filters, sort = get().sortOptions) => {
        set({ loading: true, error: null });
        try {
          const response = await RequestService.getRequests(page, get().pageSize, filters, sort);
          set({
            requests: response.data,
            currentPage: response.page,
            totalPages: response.totalPages,
            totalItems: response.total,
            loading: false,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al cargar solicitudes';
          set({ error: errorMessage, loading: false });
        }
      },

      loadRequestById: async (id: string) => {
        set({ loading: true, error: null });
        try {
          const request = await RequestService.getRequestById(id);
          set({ currentRequest: request, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al cargar solicitud';
          set({ error: errorMessage, loading: false });
        }
      },

      loadAssignmentsByEmployee: async (employeeId: string) => {
        set({ loading: true, error: null });
        try {
          const assignments = await RequestService.getAssignmentsByEmployee(employeeId);
          set({ assignments, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al cargar asignaciones';
          set({ error: errorMessage, loading: false });
        }
      },

      loadRequestStats: async () => {
        set({ loading: true, error: null });
        try {
          const stats = await RequestService.getRequestStats();
          set({ stats, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al cargar estadísticas';
          set({ error: errorMessage, loading: false });
        }
      },

      refreshRequests: async () => {
        const { currentPage, filters, sortOptions } = get();
        await get().loadRequests(currentPage, filters, sortOptions);
      },

      // CRUD de solicitudes
      createRequest: async (requestData) => {
        set({ loading: true, error: null });
        try {
          await RequestService.createRequest(requestData);
          await get().refreshRequests();
          set({ loading: false, isFormOpen: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al crear solicitud';
          set({ error: errorMessage, loading: false });
        }
      },

      updateRequest: async (id: string, updates) => {
        set({ loading: true, error: null });
        try {
          await RequestService.updateRequest(id, updates);
          await get().refreshRequests();
          set({ loading: false, isFormOpen: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al actualizar solicitud';
          set({ error: errorMessage, loading: false });
        }
      },

      deleteRequest: async (id: string) => {
        set({ loading: true, error: null });
        try {
          await RequestService.deleteRequest(id);
          await get().refreshRequests();
          set({ loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al eliminar solicitud';
          set({ error: errorMessage, loading: false });
        }
      },

      // Acciones de aprobación
      approveRequest: async (id: string, approvedBy: string, notes?: string) => {
        set({ loading: true, error: null });
        try {
          await RequestService.approveRequest(id, approvedBy, notes);
          await get().refreshRequests();
          set({ loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al aprobar solicitud';
          set({ error: errorMessage, loading: false });
        }
      },

      rejectRequest: async (id: string, rejectedBy: string, rejectionReason: string) => {
        set({ loading: true, error: null });
        try {
          await RequestService.rejectRequest(id, rejectedBy, rejectionReason);
          await get().refreshRequests();
          set({ loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al rechazar solicitud';
          set({ error: errorMessage, loading: false });
        }
      },

      // CRUD de asignaciones
      createAssignment: async (assignmentData) => {
        set({ loading: true, error: null });
        try {
          await RequestService.createAssignment(assignmentData);
          set({ loading: false, isAssignmentFormOpen: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al crear asignación';
          set({ error: errorMessage, loading: false });
        }
      },

      updateAssignmentUsage: async (id: string, usedQuantity: number, description?: string) => {
        set({ loading: true, error: null });
        try {
          await RequestService.updateAssignmentUsage(id, usedQuantity, description);
          set({ loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al actualizar uso';
          set({ error: errorMessage, loading: false });
        }
      },

      // Búsqueda y filtros
      searchRequests: async (searchTerm: string) => {
        set({ loading: true, error: null });
        try {
          const requests = await RequestService.searchRequests(searchTerm);
          set({ requests, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al buscar solicitudes';
          set({ error: errorMessage, loading: false });
        }
      },

      getRequestsByStatus: async (status: RequestStatus) => {
        set({ loading: true, error: null });
        try {
          const requests = await RequestService.getRequestsByStatus(status);
          set({ requests, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al obtener solicitudes por estado';
          set({ error: errorMessage, loading: false });
        }
      },

      getRequestsByEmployee: async (employeeId: string) => {
        set({ loading: true, error: null });
        try {
          const requests = await RequestService.getRequestsByEmployee(employeeId);
          set({ requests, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al obtener solicitudes por empleado';
          set({ error: errorMessage, loading: false });
        }
      },

      getRequestsByDepartment: async (departmentId: string) => {
        set({ loading: true, error: null });
        try {
          const requests = await RequestService.getRequestsByDepartment(departmentId);
          set({ requests, loading: false });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error al obtener solicitudes por departamento';
          set({ error: errorMessage, loading: false });
        }
      },

      // Gestión de estado
      setCurrentRequest: (request) => set({ currentRequest: request }),
      setCurrentAssignment: (assignment) => set({ currentAssignment: assignment }),
      
      openForm: (request) => set({ 
        isFormOpen: true, 
        currentRequest: request || null 
      }),
      
      closeForm: () => set({ 
        isFormOpen: false, 
        currentRequest: null 
      }),
      
      openAssignmentForm: (assignment) => set({ 
        isAssignmentFormOpen: true, 
        currentAssignment: assignment || null 
      }),
      
      closeAssignmentForm: () => set({ 
        isAssignmentFormOpen: false, 
        currentAssignment: null 
      }),
      
      setFilters: (filters) => set({ filters }),
      setSortOptions: (sort) => set({ sortOptions: sort }),
      setPage: (page) => set({ currentPage: page }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'request-store',
      partialize: (state) => ({
        filters: state.filters,
        sortOptions: state.sortOptions,
        pageSize: state.pageSize,
      }),
    }
  )
);
