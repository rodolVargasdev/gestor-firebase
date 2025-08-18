import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Employee, type SearchFilters, type SortOptions } from '../types/index';
import { EmployeeService } from '../services/employeeService';

interface EmployeeState {
  // Estado de los datos
  employees: Employee[];

  currentEmployee: Employee | null;
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

interface EmployeeActions {
  // Acciones de carga de datos
  loadEmployees: (page?: number, filters?: SearchFilters, sort?: SortOptions) => Promise<void>;
  loadEmployeeById: (id: string) => Promise<void>;

  refreshEmployees: () => Promise<void>;
  
  // Acciones CRUD
  createEmployee: (employeeData: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  importEmployees: (employeesData: Array<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<{ success: number; total: number; failed: number }>;
  updateEmployee: (id: string, updates: Partial<Omit<Employee, 'id' | 'createdAt'>>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  
  // Acciones de búsqueda
  searchEmployees: (searchTerm: string) => Promise<void>;
  getActiveEmployees: () => Promise<void>;
  getEmployeesByDepartment: (departmentId: string) => Promise<void>;
  
  // Acciones de UI
  setCurrentEmployee: (employee: Employee | null) => void;
  openForm: (employee?: Employee) => void;
  closeForm: () => void;
  setFilters: (filters: SearchFilters) => void;
  setSortOptions: (sort: SortOptions) => void;
  setPage: (page: number) => void;
  
  // Acciones de estado
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

type EmployeeStore = EmployeeState & EmployeeActions;

const initialState: EmployeeState = {
  employees: [],

  currentEmployee: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  totalItems: 0,
  pageSize: 10,
  filters: {},
  sortOptions: { field: 'firstName', direction: 'asc' },
  isFormOpen: false,
  isEditing: false,
};

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Acciones de carga de datos
      loadEmployees: async (page = 1, filters = get().filters, sort = get().sortOptions) => {
        try {
          set({ loading: true, error: null });
          
          const response = await EmployeeService.getEmployees(
            page,
            get().pageSize,
            filters,
            sort
          );
          
          set({
            employees: response.data,
            currentPage: response.page,
            totalPages: response.totalPages,
            totalItems: response.total,
            loading: false,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al cargar empleados',
            loading: false,
          });
        }
      },

      loadEmployeeById: async (id: string) => {
        try {
          set({ loading: true, error: null });
          
          const employee = await EmployeeService.getEmployeeById(id);
          
          set({
            currentEmployee: employee,
            loading: false,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al cargar empleado',
            loading: false,
          });
        }
      },



      refreshEmployees: async () => {
        await get().loadEmployees(get().currentPage);
      },

      // Acciones CRUD
      createEmployee: async (employeeData) => {
        try {
          set({ loading: true, error: null });
          
          await EmployeeService.createEmployee(employeeData);
          
          // Recargar la lista
          await get().loadEmployees(get().currentPage);
          
          set({
            loading: false,
            isFormOpen: false,
            isEditing: false,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al crear empleado',
            loading: false,
          });
        }
      },

      // Importar múltiples empleados
      importEmployees: async (employeesData: Array<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>>) => {
        try {
          set({ loading: true, error: null });
          
          const createdEmployees: Employee[] = [];
          
          for (const employeeData of employeesData) {
            try {
              const newEmployee = await EmployeeService.createEmployee(employeeData);
              createdEmployees.push(newEmployee);
            } catch (error) {
              console.error(`Error creando empleado ${employeeData.employeeId}:`, error);
              // Continuar con el siguiente empleado
            }
          }
          
          // Recargar la lista
          await get().loadEmployees(get().currentPage);
          
          set({
            loading: false,
          });
          
          return {
            success: createdEmployees.length,
            total: employeesData.length,
            failed: employeesData.length - createdEmployees.length
          };
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al importar empleados',
            loading: false,
          });
          throw error;
        }
      },

      updateEmployee: async (id: string, updates) => {
        try {
          set({ loading: true, error: null });
          
          await EmployeeService.updateEmployee(id, updates);
          
          // Recargar la lista y el elemento actual
          await Promise.all([
            get().loadEmployees(get().currentPage),
            get().loadEmployeeById(id),
          ]);
          
          set({
            loading: false,
            isFormOpen: false,
            isEditing: false,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al actualizar empleado',
            loading: false,
          });
        }
      },

      deleteEmployee: async (id: string) => {
        try {
          set({ loading: true, error: null });
          
          await EmployeeService.deleteEmployee(id);
          
          // Recargar la lista
          await get().loadEmployees(get().currentPage);
          
          set({
            loading: false,
            currentEmployee: null,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al eliminar empleado',
            loading: false,
          });
        }
      },

      // Acciones de búsqueda
      searchEmployees: async (searchTerm: string) => {
        try {
          set({ loading: true, error: null });
          
          const results = await EmployeeService.searchEmployees(searchTerm);
          
          set({
            employees: results,
            loading: false,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al buscar empleados',
            loading: false,
          });
        }
      },

      getActiveEmployees: async () => {
        try {
          set({ loading: true, error: null });
          
          const results = await EmployeeService.getActiveEmployees();
          
          set({
            employees: results,
            loading: false,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al obtener empleados activos',
            loading: false,
          });
        }
      },

      getEmployeesByDepartment: async (departmentId: string) => {
        try {
          set({ loading: true, error: null });
          
          const results = await EmployeeService.getEmployeesByDepartment(departmentId);
          
          set({
            employees: results,
            loading: false,
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al obtener empleados por departamento',
            loading: false,
          });
        }
      },

      // Acciones de UI
      setCurrentEmployee: (employee) => {
        set({ currentEmployee: employee });
      },

      openForm: (employee) => {
        set({
          isFormOpen: true,
          isEditing: !!employee,
          currentEmployee: employee || null,
        });
      },

      closeForm: () => {
        set({
          isFormOpen: false,
          isEditing: false,
          currentEmployee: null,
        });
      },

      setFilters: (filters) => {
        set({ filters, currentPage: 1 });
        get().loadEmployees(1, filters);
      },

      setSortOptions: (sort) => {
        set({ sortOptions: sort });
        get().loadEmployees(1, get().filters, sort);
      },

      setPage: (page) => {
        set({ currentPage: page });
        get().loadEmployees(page);
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
      name: 'employee-store',
      partialize: (state) => ({
        filters: state.filters,
        sortOptions: state.sortOptions,
        pageSize: state.pageSize,
      }),
    }
  )
);
