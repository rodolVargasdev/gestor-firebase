import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type LicenseType } from '../types/licenseTypes';
import { type Employee, type LicenseRequest, type CreateLicenseRequestData } from '../types/index';
import { LicenseService } from '../services/licenseService';

// ========================================
// TIPOS DE ESTADO
// ========================================

interface LicenseState {
  // Tipos de licencias
  licenseTypes: LicenseType[];
  currentLicenseType: LicenseType | null;
  
  // Disponibilidad
  employeeAvailability: Employee['disponibilidad'] | null;
  
  // Solicitudes de licencias
  licenseRequests: LicenseRequest[];
  
  // Estado de carga
  loading: boolean;
  error: string | null;
  
  // Estado de UI
  isInitializing: boolean;
  isRenewing: boolean;
  isCreatingRequest: boolean;
}

interface LicenseActions {
  // ========================================
  // GESTIÓN DE TIPOS DE LICENCIAS
  // ========================================
  
  // Inicializar tipos de licencias
  initializeLicenseTypes: () => Promise<void>;
  
  // Cargar tipos de licencias
  loadLicenseTypes: () => Promise<void>;
  
  // Cargar tipos por categoría
  loadLicenseTypesByCategory: (categoria: 'HORAS' | 'DIAS' | 'OCASION') => Promise<void>;
  
  // Establecer tipo de licencia actual
  setCurrentLicenseType: (licenseType: LicenseType | null) => void;
  
  // ========================================
  // GESTIÓN DE DISPONIBILIDAD
  // ========================================
  
  // Inicializar disponibilidad de empleado
  initializeEmployeeAvailability: (employeeId: string) => Promise<void>;
  
  // Cargar disponibilidad de empleado
  loadEmployeeAvailability: (employeeId: string) => Promise<void>;
  
  // Renovar disponibilidad anual
  renewAnnualAvailability: (employeeId: string) => Promise<void>;
  
  // Renovar disponibilidad mensual
  renewMonthlyAvailability: (employeeId: string) => Promise<void>;
  
  // Limpiar disponibilidad corrupta de VG11
  cleanVG11Availability: (employeeId: string) => Promise<void>;
  
  // Limpiar disponibilidad mensual de OM14 y CT15
  cleanMonthlyOcasionAvailability: (employeeId: string) => Promise<void>;
  
  // Limpiar disponibilidad de MG07
  cleanMG07Availability: (employeeId: string) => Promise<void>;
  
  // ========================================
  // GESTIÓN DE SOLICITUDES DE LICENCIAS
  // ========================================
  
  // Crear solicitud de licencia
  createLicenseRequest: (data: CreateLicenseRequestData) => Promise<void>;
  
  // Cargar solicitudes de empleado
  loadEmployeeLicenseRequests: (employeeId: string) => Promise<void>;
  
  // Actualizar solicitud
  updateLicenseRequest: (requestId: string, updates: Partial<LicenseRequest>) => Promise<void>;
  
  // Eliminar solicitud
  deleteLicenseRequest: (requestId: string) => Promise<void>;
  
  // ========================================
  // UTILIDADES
  // ========================================
  
  // Limpiar estado
  clearState: () => void;
  
  // Limpiar error
  clearError: () => void;
}

type LicenseStore = LicenseState & LicenseActions;

// ========================================
// ESTADO INICIAL
// ========================================

const initialState: LicenseState = {
  licenseTypes: [],
  currentLicenseType: null,
  employeeAvailability: null,
  licenseRequests: [],
  loading: false,
  error: null,
  isInitializing: false,
  isRenewing: false,
  isCreatingRequest: false,
};

// ========================================
// STORE PRINCIPAL
// ========================================

export const useLicenseStore = create<LicenseStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ========================================
      // GESTIÓN DE TIPOS DE LICENCIAS
      // ========================================

      initializeLicenseTypes: async () => {
        try {
          set({ isInitializing: true, error: null });
          console.log('🚀 Inicializando tipos de licencias desde el store...');
          
          await LicenseService.initializeLicenseTypes();
          
          // Recargar tipos después de inicializar
          await get().loadLicenseTypes();
          
          set({ isInitializing: false });
          console.log('✅ Tipos de licencias inicializados desde el store');
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al inicializar tipos de licencias',
            isInitializing: false,
          });
          console.error('❌ Error en initializeLicenseTypes:', error);
        }
      },

      loadLicenseTypes: async () => {
        try {
          set({ loading: true, error: null });
          console.log('📋 Cargando tipos de licencias...');
          
          const licenseTypes = await LicenseService.getActiveLicenseTypes();
          
          set({
            licenseTypes,
            loading: false,
          });
          
          console.log(`✅ ${licenseTypes.length} tipos de licencias cargados`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al cargar tipos de licencias',
            loading: false,
          });
          console.error('❌ Error en loadLicenseTypes:', error);
        }
      },

      loadLicenseTypesByCategory: async (categoria: 'HORAS' | 'DIAS' | 'OCASION') => {
        try {
          set({ loading: true, error: null });
          console.log(`📋 Cargando tipos de licencias por categoría: ${categoria}`);
          
          const licenseTypes = await LicenseService.getLicenseTypesByCategory(categoria);
          
          set({
            licenseTypes,
            loading: false,
          });
          
          console.log(`✅ ${licenseTypes.length} tipos de licencias de categoría ${categoria} cargados`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al cargar tipos de licencias por categoría',
            loading: false,
          });
          console.error('❌ Error en loadLicenseTypesByCategory:', error);
        }
      },

      setCurrentLicenseType: (licenseType: LicenseType | null) => {
        set({ currentLicenseType: licenseType });
      },

      // ========================================
      // GESTIÓN DE DISPONIBILIDAD
      // ========================================

      initializeEmployeeAvailability: async (employeeId: string) => {
        try {
          set({ loading: true, error: null });
          console.log(`🔄 Inicializando disponibilidad para empleado: ${employeeId}`);
          
          await LicenseService.initializeEmployeeAvailability(employeeId);
          
          // Cargar disponibilidad después de inicializar
          await get().loadEmployeeAvailability(employeeId);
          
          set({ loading: false });
          console.log(`✅ Disponibilidad inicializada para empleado: ${employeeId}`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al inicializar disponibilidad del empleado',
            loading: false,
          });
          console.error('❌ Error en initializeEmployeeAvailability:', error);
        }
      },

      loadEmployeeAvailability: async (employeeId: string) => {
        try {
          set({ loading: true, error: null });
          console.log(`📊 Cargando disponibilidad para empleado: ${employeeId}`);
          
          const availability = await LicenseService.getEmployeeAvailability(employeeId);
          
          set({
            employeeAvailability: availability,
            loading: false,
          });
          
          if (availability) {
            console.log(`✅ Disponibilidad cargada para empleado: ${employeeId}`);
          } else {
            console.log(`⚠️ No se encontró disponibilidad para empleado: ${employeeId}`);
          }
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al cargar disponibilidad del empleado',
            loading: false,
          });
          console.error('❌ Error en loadEmployeeAvailability:', error);
        }
      },

      renewAnnualAvailability: async (employeeId: string) => {
        try {
          set({ isRenewing: true, error: null });
          console.log(`🔄 Renovando disponibilidad anual para empleado: ${employeeId}`);
          
          await LicenseService.renewAnnualAvailability(employeeId);
          
          // Recargar disponibilidad después de renovar
          await get().loadEmployeeAvailability(employeeId);
          
          set({ isRenewing: false });
          console.log(`✅ Disponibilidad anual renovada para empleado: ${employeeId}`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al renovar disponibilidad anual',
            isRenewing: false,
          });
          console.error('❌ Error en renewAnnualAvailability:', error);
        }
      },

      renewMonthlyAvailability: async (employeeId: string) => {
        try {
          set({ isRenewing: true, error: null });
          console.log(`🔄 Renovando disponibilidad mensual para empleado: ${employeeId}`);
          
          await LicenseService.renewMonthlyAvailability(employeeId);
          
          // Recargar disponibilidad después de renovar
          await get().loadEmployeeAvailability(employeeId);
          
          set({ isRenewing: false });
          console.log(`✅ Disponibilidad mensual renovada para empleado: ${employeeId}`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al renovar disponibilidad mensual',
            isRenewing: false,
          });
          console.error('❌ Error en renewMonthlyAvailability:', error);
        }
      },

      cleanVG11Availability: async (employeeId: string) => {
        try {
          set({ loading: true, error: null });
          console.log(`🧹 Limpiando disponibilidad de VG11 para empleado: ${employeeId}`);
          
          await LicenseService.cleanVG11Availability(employeeId);
          
          // Recargar disponibilidad después de limpiar
          await get().loadEmployeeAvailability(employeeId);
          
          set({ loading: false });
          console.log(`✅ Disponibilidad de VG11 limpiada para empleado: ${employeeId}`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al limpiar disponibilidad de VG11',
            loading: false,
          });
          console.error('❌ Error en cleanVG11Availability:', error);
        }
      },

      cleanMonthlyOcasionAvailability: async (employeeId: string) => {
        try {
          set({ loading: true, error: null });
          console.log(`🧹 Limpiando disponibilidad mensual de OM14 y CT15 para empleado: ${employeeId}`);
          
          await LicenseService.cleanMonthlyOcasionAvailability(employeeId);
          
          // Recargar disponibilidad después de limpiar
          await get().loadEmployeeAvailability(employeeId);
          
          set({ loading: false });
          console.log(`✅ Disponibilidad mensual de OM14 y CT15 limpiada para empleado: ${employeeId}`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al limpiar disponibilidad mensual',
            loading: false,
          });
          console.error('❌ Error en cleanMonthlyOcasionAvailability:', error);
        }
      },

      cleanMG07Availability: async (employeeId: string) => {
        try {
          set({ loading: true, error: null });
          console.log(`🧹 Limpiando disponibilidad de MG07 para empleado: ${employeeId}`);
          
          await LicenseService.cleanMG07Availability(employeeId);
          
          // Recargar disponibilidad después de limpiar
          await get().loadEmployeeAvailability(employeeId);
          
          set({ loading: false });
          console.log(`✅ Disponibilidad de MG07 limpiada para empleado: ${employeeId}`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al limpiar disponibilidad de MG07',
            loading: false,
          });
          console.error('❌ Error en cleanMG07Availability:', error);
        }
      },

      // ========================================
      // GESTIÓN DE SOLICITUDES DE LICENCIAS
      // ========================================

      createLicenseRequest: async (data: CreateLicenseRequestData) => {
        try {
          set({ isCreatingRequest: true, error: null });
          console.log(`🔄 Creando solicitud de licencia para empleado: ${data.employeeId}`);
          
          await LicenseService.createLicenseRequest(data);
          
          // Recargar disponibilidad después de crear la solicitud
          await get().loadEmployeeAvailability(data.employeeId);
          
          set({ isCreatingRequest: false });
          console.log(`✅ Solicitud de licencia creada para empleado: ${data.employeeId}`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al crear solicitud de licencia',
            isCreatingRequest: false,
          });
          console.error('❌ Error en createLicenseRequest:', error);
          throw error; // Re-lanzar para manejar en el componente
        }
      },

      loadEmployeeLicenseRequests: async (employeeId: string) => {
        try {
          set({ loading: true, error: null });
          console.log(`📋 Cargando solicitudes de licencia para empleado: ${employeeId}`);
          
          const requests = await LicenseService.getEmployeeLicenseRequests(employeeId);
          
          set({ licenseRequests: requests, loading: false });
          console.log(`✅ Solicitudes de licencia cargadas para empleado: ${employeeId}`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al cargar solicitudes de licencia',
            loading: false,
          });
          console.error('❌ Error en loadEmployeeLicenseRequests:', error);
        }
      },

      updateLicenseRequest: async (requestId: string, updates: Partial<LicenseRequest>) => {
        try {
          set({ loading: true, error: null });
          console.log(`🔄 Actualizando solicitud de licencia: ${requestId}`);
          
          // Obtener la solicitud actual para saber el employeeId
          const currentRequests = get().licenseRequests;
          const currentRequest = currentRequests.find(req => req.id === requestId);
          
          if (!currentRequest) {
            throw new Error('Solicitud no encontrada en el estado local');
          }
          
          await LicenseService.updateLicenseRequest(requestId, updates);
          
          // Recargar solicitudes
          const updatedRequests = currentRequests.map(req => 
            req.id === requestId ? { ...req, ...updates } : req
          );
          set({ licenseRequests: updatedRequests, loading: false });
          
          // Recargar disponibilidad del empleado
          await get().loadEmployeeAvailability(currentRequest.employeeId);
          
          console.log(`✅ Solicitud de licencia actualizada: ${requestId}`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al actualizar solicitud de licencia',
            loading: false,
          });
          console.error('❌ Error en updateLicenseRequest:', error);
        }
      },

      deleteLicenseRequest: async (requestId: string) => {
        try {
          set({ loading: true, error: null });
          console.log(`🗑️ Eliminando solicitud de licencia: ${requestId}`);
          
          // Obtener la solicitud actual para saber el employeeId
          const currentRequests = get().licenseRequests;
          const currentRequest = currentRequests.find(req => req.id === requestId);
          
          if (!currentRequest) {
            throw new Error('Solicitud no encontrada en el estado local');
          }
          
          await LicenseService.deleteLicenseRequest(requestId);
          
          // Remover de la lista local
          const filteredRequests = currentRequests.filter(req => req.id !== requestId);
          set({ licenseRequests: filteredRequests, loading: false });
          
          // Recargar disponibilidad del empleado
          await get().loadEmployeeAvailability(currentRequest.employeeId);
          
          console.log(`✅ Solicitud de licencia eliminada: ${requestId}`);
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            error: errorMessage || 'Error al eliminar solicitud de licencia',
            loading: false,
          });
          console.error('❌ Error en deleteLicenseRequest:', error);
        }
      },

      // ========================================
      // UTILIDADES
      // ========================================

      clearState: () => {
        set(initialState);
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'license-store',
      partialize: (state) => ({
        licenseTypes: state.licenseTypes,
        currentLicenseType: state.currentLicenseType,
      }),
    }
  )
);
