import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type LicenseType, type SearchFilters, type SortOptions } from '../types';
import { LicenseService } from '../services/licenseService';

interface LicenseState {
  // Estado de los datos
  licenseTypes: LicenseType[];
  currentLicenseType: LicenseType | null;
  loading: boolean;
  error: string | null;
  
  // Estado de paginación
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  
  // Estado de filtros y búsqueda
  filters: SearchFilters;
  sortOptions: SortOptions;
  
  // Estado de formularios
  isFormOpen: boolean;
  isEditing: boolean;
}

interface LicenseActions {
  // Acciones de carga de datos
  loadLicenseTypes: (page?: number, filters?: SearchFilters, sort?: SortOptions) => Promise<void>;
  loadLicenseTypeById: (id: string) => Promise<void>;
  refreshLicenseTypes: () => Promise<void>;
  
  // Acciones CRUD
  createLicenseType: (licenseTypeData: Omit<LicenseType, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLicenseType: (id: string, updates: Partial<Omit<LicenseType, 'id' | 'createdAt'>>) => Promise<void>;
  deleteLicenseType: (id: string) => Promise<void>;
  
  // Acciones de búsqueda
  searchLicenseTypes: (searchTerm: string) => Promise<void>;
  getActiveLicenseTypes: () => Promise<void>;
  getLicenseTypesByCategory: (category: string) => Promise<void>;
  
  // Acciones de UI
  setCurrentLicenseType: (licenseType: LicenseType | null) => void;
  openForm: (licenseType?: LicenseType) => void;
  closeForm: () => void;
  setFilters: (filters: SearchFilters) => void;
  setSortOptions: (sort: SortOptions) => void;
  setPage: (page: number) => void;
  
  // Acciones de estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type LicenseStore = LicenseState & LicenseActions;

const initialState: LicenseState = {
  licenseTypes: [],
  currentLicenseType: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  pageSize: 10,
  filters: {},
  sortOptions: { field: 'createdAt', direction: 'desc' },
  isFormOpen: false,
  isEditing: false,
};

export const useLicenseStore = create<LicenseStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Acciones de carga de datos
      loadLicenseTypes: async (page = 1, filters = get().filters, sort = get().sortOptions) => {
        try {
          set({ loading: true, error: null });
          
          const response = await LicenseService.getLicenseTypes(
            page,
            get().pageSize,
            filters,
            sort
          );
          
          set({
            licenseTypes: response.data,
            currentPage: response.page,
            totalPages: response.totalPages,
            totalItems: response.total,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Error al cargar tipos de licencias',
            loading: false,
          });
        }
      },

      loadLicenseTypeById: async (id: string) => {
        try {
          set({ loading: true, error: null });
          
          const licenseType = await LicenseService.getLicenseTypeById(id);
          
          set({
            currentLicenseType: licenseType,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Error al cargar tipo de licencia',
            loading: false,
          });
        }
      },

      refreshLicenseTypes: async () => {
        await get().loadLicenseTypes(get().currentPage);
      },

      // Acciones CRUD
      createLicenseType: async (licenseTypeData) => {
        try {
          set({ loading: true, error: null });
          
          await LicenseService.createLicenseType(licenseTypeData);
          
          // Recargar la lista
          await get().loadLicenseTypes(get().currentPage);
          
          set({
            loading: false,
            isFormOpen: false,
            isEditing: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Error al crear tipo de licencia',
            loading: false,
          });
        }
      },

      updateLicenseType: async (id: string, updates) => {
        try {
          set({ loading: true, error: null });
          
          await LicenseService.updateLicenseType(id, updates);
          
          // Recargar la lista y el elemento actual
          await Promise.all([
            get().loadLicenseTypes(get().currentPage),
            get().loadLicenseTypeById(id),
          ]);
          
          set({
            loading: false,
            isFormOpen: false,
            isEditing: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Error al actualizar tipo de licencia',
            loading: false,
          });
        }
      },

      deleteLicenseType: async (id: string) => {
        try {
          set({ loading: true, error: null });
          
          await LicenseService.deleteLicenseType(id);
          
          // Recargar la lista
          await get().loadLicenseTypes(get().currentPage);
          
          set({
            loading: false,
            currentLicenseType: null,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Error al eliminar tipo de licencia',
            loading: false,
          });
        }
      },

      // Acciones de búsqueda
      searchLicenseTypes: async (searchTerm: string) => {
        try {
          set({ loading: true, error: null });
          
          const results = await LicenseService.searchLicenseTypes(searchTerm);
          
          set({
            licenseTypes: results,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Error al buscar tipos de licencias',
            loading: false,
          });
        }
      },

      getActiveLicenseTypes: async () => {
        try {
          set({ loading: true, error: null });
          
          const results = await LicenseService.getActiveLicenseTypes();
          
          set({
            licenseTypes: results,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Error al obtener tipos de licencias activos',
            loading: false,
          });
        }
      },

      getLicenseTypesByCategory: async (category: string) => {
        try {
          set({ loading: true, error: null });
          
          const results = await LicenseService.getLicenseTypesByCategory(category);
          
          set({
            licenseTypes: results,
            loading: false,
          });
        } catch (error: any) {
          set({
            error: error.message || 'Error al obtener tipos de licencias por categoría',
            loading: false,
          });
        }
      },

      // Acciones de UI
      setCurrentLicenseType: (licenseType) => {
        set({ currentLicenseType: licenseType });
      },

      openForm: (licenseType) => {
        set({
          isFormOpen: true,
          isEditing: !!licenseType,
          currentLicenseType: licenseType || null,
        });
      },

      closeForm: () => {
        set({
          isFormOpen: false,
          isEditing: false,
          currentLicenseType: null,
        });
      },

      setFilters: (filters) => {
        set({ filters, currentPage: 1 });
        get().loadLicenseTypes(1, filters);
      },

      setSortOptions: (sort) => {
        set({ sortOptions: sort });
        get().loadLicenseTypes(1, get().filters, sort);
      },

      setPage: (page) => {
        set({ currentPage: page });
        get().loadLicenseTypes(page);
      },

      // Acciones de estado
      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'license-store',
      partialize: (state) => ({
        filters: state.filters,
        sortOptions: state.sortOptions,
        pageSize: state.pageSize,
      }),
    }
  )
);
