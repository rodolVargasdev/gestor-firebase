import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  setDoc,
  deleteDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { type LicenseType } from '../types/licenseTypes';
import { type Employee, type LicenciaHora, type LicenciaDia, type LicenciaOcasion, type LicenseRequest, type CreateLicenseRequestData } from '../types/index';
import { getCurrentDateInElSalvador } from '../utils/dateUtils';

export class LicenseService {
  private static licenseTypesCollection = 'licenseTypes';
  private static employeesCollection = 'employees';
  private static licenseRequestsCollection = 'licenseRequests';

  // ========================================
  // GESTIÓN DE TIPOS DE LICENCIAS
  // ========================================

  // Inicializar tipos de licencias predefinidos
  static async initializeLicenseTypes(): Promise<void> {
    try {
      console.log('🚀 Inicializando tipos de licencias...');
      
      const batch = writeBatch(db);
      const { LICENSE_TYPES } = await import('../types/licenseTypes');
      
      for (const licenseType of LICENSE_TYPES) {
        // Verificar si ya existe
        const q = query(
          collection(db, this.licenseTypesCollection),
          where('codigo', '==', licenseType.codigo)
        );
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          const docRef = doc(collection(db, this.licenseTypesCollection));
          batch.set(docRef, {
            ...licenseType,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          console.log(`✅ Tipo de licencia creado: ${licenseType.codigo} - ${licenseType.nombre}`);
        } else {
          console.log(`⚠️ Tipo de licencia ya existe: ${licenseType.codigo}`);
        }
      }
      
      await batch.commit();
      console.log('🎉 Tipos de licencias inicializados correctamente');
    } catch (error) {
      console.error('❌ Error inicializando tipos de licencias:', error);
      throw new Error('Error al inicializar tipos de licencias');
    }
  }

  // Obtener todos los tipos de licencias
  static async getAllLicenseTypes(): Promise<LicenseType[]> {
    try {
      const querySnapshot = await getDocs(collection(db, this.licenseTypesCollection));
      return querySnapshot.docs.map(doc => this.mapDocumentToLicenseType(doc));
    } catch (error) {
      console.error('Error getting license types:', error);
      throw new Error('Error al obtener tipos de licencias');
    }
  }

  // Obtener tipos de licencias activos
  static async getActiveLicenseTypes(): Promise<LicenseType[]> {
    try {
      // Consulta temporal sin ordenamiento mientras se construye el índice
      const q = query(
        collection(db, this.licenseTypesCollection),
        where('activo', '==', true)
      );
      const querySnapshot = await getDocs(q);
      const licenseTypes = querySnapshot.docs.map(doc => this.mapDocumentToLicenseType(doc));
      
      // Ordenar en el cliente mientras se construye el índice
      return licenseTypes.sort((a, b) => {
        if (a.categoria !== b.categoria) {
          return a.categoria.localeCompare(b.categoria);
        }
        return a.nombre.localeCompare(b.nombre);
      });
    } catch (error) {
      console.error('Error getting active license types:', error);
      throw new Error('Error al obtener tipos de licencias activos');
    }
  }

  // Obtener tipos de licencias por categoría
  static async getLicenseTypesByCategory(categoria: 'HORAS' | 'DIAS' | 'OCASION'): Promise<LicenseType[]> {
    try {
      const q = query(
        collection(db, this.licenseTypesCollection),
        where('categoria', '==', categoria),
        where('activo', '==', true),
        orderBy('nombre')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapDocumentToLicenseType(doc));
    } catch (error) {
      console.error('Error getting license types by category:', error);
      throw new Error('Error al obtener tipos de licencias por categoría');
    }
  }

  // Obtener tipo de licencia por código
  static async getLicenseTypeByCode(codigo: string): Promise<LicenseType | null> {
    try {
      const q = query(
        collection(db, this.licenseTypesCollection),
        where('codigo', '==', codigo)
      );
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return null;
      return this.mapDocumentToLicenseType(querySnapshot.docs[0]);
    } catch (error) {
      console.error('Error getting license type by code:', error);
      throw new Error('Error al obtener tipo de licencia');
    }
  }

  // Obtener cantidad disponible para un tipo de licencia
  static async getAvailableQuantity(employeeId: string, licenseTypeCode: string): Promise<number> {
    try {
      const employee = await this.getEmployeeById(employeeId);
      if (!employee?.disponibilidad) return 0;

      const licenseType = await this.getLicenseTypeByCode(licenseTypeCode);
      if (!licenseType) return 0;

      switch (licenseType.categoria) {
        case 'HORAS': {
          const horaLicencia = employee.disponibilidad?.licencias_horas?.[licenseTypeCode];
          return horaLicencia?.disponible_anual || 0;
        }
        
        case 'DIAS': {
          const diaLicencia = employee.disponibilidad?.licencias_dias?.[licenseTypeCode];
          if (licenseType.periodo_control === 'anual') {
            return diaLicencia?.disponible_anual || 0;
          } else if (licenseType.periodo_control === 'mensual') {
            return diaLicencia?.disponible_mes_actual || 0;
          }
          return 0;
        }
        
        case 'OCASION':
          return licenseType.max_por_solicitud || 999;
        
        default:
          return 0;
      }
    } catch (error) {
      console.error('Error getting available quantity:', error);
      return 0;
    }
  }

    // Restaurar disponibilidad del empleado (inverso de updateEmployeeAvailability)
  static async restoreEmployeeAvailability(employeeId: string, licenseTypeCode: string, quantity: number, startDate?: Date): Promise<void> {
    try {
      const employee = await this.getEmployeeById(employeeId);
      if (!employee?.disponibilidad) return;

      const licenseType = await this.getLicenseTypeByCode(licenseTypeCode);
      if (!licenseType) return;

      const disponibilidad = { ...employee.disponibilidad };

      switch (licenseType.categoria) {
        case 'HORAS': {
          const horaLicencia = disponibilidad.licencias_horas?.[licenseTypeCode];
          if (horaLicencia) {
            // ✅ Restaurar disponibilidad para permisos anuales
            if (startDate) {
              const permisoYear = startDate.getFullYear();
              const currentYear = getCurrentDateInElSalvador().getFullYear();
              
              // Si el permiso es de un año anterior, restaurar el historial de ese año
              if (permisoYear < currentYear) {
                if (horaLicencia.uso_anual) {
                  const yearKey = permisoYear.toString();
                  if (horaLicencia.uso_anual[yearKey]) {
                    horaLicencia.uso_anual[yearKey].utilizada -= quantity;
                    horaLicencia.uso_anual[yearKey].disponible += quantity;
                    console.log(`✅ Disponibilidad anual restaurada para ${yearKey}: ${quantity} horas`);
                  }
                }
              } else {
                // Si es del año actual, restaurar disponibilidad actual
                if (typeof horaLicencia.utilizada_anual === 'number' && typeof horaLicencia.disponible_anual === 'number') {
                  horaLicencia.utilizada_anual -= quantity;
                  horaLicencia.disponible_anual += quantity;
                }
              }
            } else {
              // Si no hay fecha de inicio, restaurar año actual
              if (typeof horaLicencia.utilizada_anual === 'number' && typeof horaLicencia.disponible_anual === 'number') {
                horaLicencia.utilizada_anual -= quantity;
                horaLicencia.disponible_anual += quantity;
              }
            }
            horaLicencia.ultima_actualizacion = getCurrentDateInElSalvador();
          }
          break;
        }

        case 'DIAS': {
          const diaLicencia = disponibilidad.licencias_dias?.[licenseTypeCode];
          if (diaLicencia) {
            if (licenseType.periodo_control === 'anual') {
              // ✅ Restaurar disponibilidad para permisos anuales
              if (startDate) {
                const permisoYear = startDate.getFullYear();
                const currentYear = getCurrentDateInElSalvador().getFullYear();
                
                // Si el permiso es de un año anterior, restaurar el historial de ese año
                if (permisoYear < currentYear) {
                  if (diaLicencia.uso_anual) {
                    const yearKey = permisoYear.toString();
                    if (diaLicencia.uso_anual[yearKey]) {
                      diaLicencia.uso_anual[yearKey].utilizada -= quantity;
                      diaLicencia.uso_anual[yearKey].disponible += quantity;
                      console.log(`✅ Disponibilidad anual restaurada para ${yearKey}: ${quantity} días`);
                    }
                  }
                } else {
                  // Si es del año actual, restaurar disponibilidad actual
                  if (typeof diaLicencia.utilizada_anual === 'number' && typeof diaLicencia.disponible_anual === 'number') {
                    diaLicencia.utilizada_anual -= quantity;
                    diaLicencia.disponible_anual += quantity;
                  }
                }
              } else {
                // Si no hay fecha de inicio, restaurar año actual
                if (typeof diaLicencia.utilizada_anual === 'number' && typeof diaLicencia.disponible_anual === 'number') {
                  diaLicencia.utilizada_anual -= quantity;
                  diaLicencia.disponible_anual += quantity;
                }
              }
            } else if (licenseType.periodo_control === 'mensual' && typeof diaLicencia.utilizada_mes_actual === 'number' && typeof diaLicencia.disponible_mes_actual === 'number') {
              diaLicencia.utilizada_mes_actual -= quantity;
              diaLicencia.disponible_mes_actual += quantity;
            }
            diaLicencia.ultima_actualizacion = getCurrentDateInElSalvador();
          }
          break;
        }

        case 'OCASION': {
          const ocasionLicencia = disponibilidad.licencias_ocasion?.[licenseTypeCode];
          if (ocasionLicencia) {
            // ✅ Restaurar disponibilidad para OM14 (Olvido de Marcación) retroactivo
            if (licenseTypeCode === 'OM14' && startDate) {
              const olvidoMonth = startDate.getMonth() + 1;
              const olvidoYear = startDate.getFullYear();
              const currentMonth = getCurrentDateInElSalvador().getMonth() + 1;
              const currentYear = getCurrentDateInElSalvador().getFullYear();
              
              // Si el olvido es de un mes anterior, restaurar el historial de ese mes
              if (olvidoYear < currentYear || (olvidoYear === currentYear && olvidoMonth < currentMonth)) {
                const monthKey = `${olvidoYear}-${olvidoMonth.toString().padStart(2, '0')}`;
                
                if (ocasionLicencia.uso_mensual && ocasionLicencia.uso_mensual[monthKey]) {
                  ocasionLicencia.uso_mensual[monthKey].utilizada -= quantity;
                  ocasionLicencia.uso_mensual[monthKey].disponible += quantity;
                  console.log(`✅ Olvido restaurado para ${monthKey}: ${quantity} olvido(s)`);
                }
              } else {
                // Si es del mes actual, restaurar disponibilidad actual
                ocasionLicencia.utilizada_mes_actual = (ocasionLicencia.utilizada_mes_actual || 0) - quantity;
                ocasionLicencia.disponible_mes_actual = (ocasionLicencia.disponible_mes_actual || 2) + quantity;
              }
            } else {
              // Para otros tipos de OCASIÓN, restaurar contadores anuales
              ocasionLicencia.total_dias_año = (ocasionLicencia.total_dias_año || 0) - quantity;
              ocasionLicencia.total_solicitudes_año = (ocasionLicencia.total_solicitudes_año || 0) - 1;
            }
            
            ocasionLicencia.ultima_actualizacion = getCurrentDateInElSalvador();
          }
          break;
        }
      }

      // Actualizar empleado
      const employeeRef = doc(db, this.employeesCollection, employeeId);
      await updateDoc(employeeRef, {
        disponibilidad: this.removeUndefinedValues(disponibilidad),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error restoring employee availability:', error);
      throw error;
    }
  }

  // Actualizar disponibilidad del empleado después de crear una solicitud
  static async updateEmployeeAvailability(employeeId: string, licenseTypeCode: string, quantity: number, startDate?: Date): Promise<void> {
    try {
      const employee = await this.getEmployeeById(employeeId);
      if (!employee?.disponibilidad) return;

      const licenseType = await this.getLicenseTypeByCode(licenseTypeCode);
      if (!licenseType) return;

      const disponibilidad = { ...employee.disponibilidad };

      switch (licenseType.categoria) {
        case 'HORAS': {
          const horaLicencia = disponibilidad.licencias_horas?.[licenseTypeCode];
          if (horaLicencia) {
            // ✅ NUEVO: Manejo especial para permisos anuales retroactivos
            if (startDate) {
              const permisoYear = startDate.getFullYear();
              const currentYear = getCurrentDateInElSalvador().getFullYear();
              
              // Si el permiso es de un año anterior, actualizar el historial de ese año
              if (permisoYear < currentYear) {
                // Inicializar historial anual si no existe
                if (!horaLicencia.uso_anual) {
                  horaLicencia.uso_anual = {};
                }
                
                const yearKey = permisoYear.toString();
                
                // Actualizar el año del permiso
                if (!horaLicencia.uso_anual[yearKey]) {
                  horaLicencia.uso_anual[yearKey] = { 
                    utilizada: 0, 
                    disponible: horaLicencia.asignada_anual || 40,
                    asignada: horaLicencia.asignada_anual || 40 
                  };
                }
                
                horaLicencia.uso_anual[yearKey].utilizada += quantity;
                horaLicencia.uso_anual[yearKey].disponible -= quantity;
                
                console.log(`✅ Permiso anual retroactivo registrado para ${yearKey}: ${quantity} horas`);
              } else {
                // Si es del año actual, afectar disponibilidad actual
                if (typeof horaLicencia.utilizada_anual === 'number' && typeof horaLicencia.disponible_anual === 'number') {
                  horaLicencia.utilizada_anual += quantity;
                  horaLicencia.disponible_anual -= quantity;
                }
              }
            } else {
              // Si no hay fecha de inicio, afectar año actual (comportamiento por defecto)
              if (typeof horaLicencia.utilizada_anual === 'number' && typeof horaLicencia.disponible_anual === 'number') {
                horaLicencia.utilizada_anual += quantity;
                horaLicencia.disponible_anual -= quantity;
              }
            }
            horaLicencia.ultima_actualizacion = getCurrentDateInElSalvador();
          }
          break;
        }

        case 'DIAS': {
          const diaLicencia = disponibilidad.licencias_dias?.[licenseTypeCode];
          if (diaLicencia) {
            if (licenseType.periodo_control === 'anual') {
              // ✅ NUEVO: Manejo especial para permisos anuales retroactivos
              if (startDate) {
                const permisoYear = startDate.getFullYear();
                const currentYear = getCurrentDateInElSalvador().getFullYear();
                
                // Si el permiso es de un año anterior, actualizar el historial de ese año
                if (permisoYear < currentYear) {
                  // Inicializar historial anual si no existe
                  if (!diaLicencia.uso_anual) {
                    diaLicencia.uso_anual = {};
                  }
                  
                  const yearKey = permisoYear.toString();
                  
                  // Actualizar el año del permiso
                  if (!diaLicencia.uso_anual[yearKey]) {
                    diaLicencia.uso_anual[yearKey] = { 
                      utilizada: 0, 
                      disponible: diaLicencia.asignada_anual || 15,
                      asignada: diaLicencia.asignada_anual || 15 
                    };
                  }
                  
                  diaLicencia.uso_anual[yearKey].utilizada += quantity;
                  diaLicencia.uso_anual[yearKey].disponible -= quantity;
                  
                  console.log(`✅ Permiso anual retroactivo registrado para ${yearKey}: ${quantity} días`);
                } else {
                  // Si es del año actual, afectar disponibilidad actual
                  if (typeof diaLicencia.utilizada_anual === 'number' && typeof diaLicencia.disponible_anual === 'number') {
                    diaLicencia.utilizada_anual += quantity;
                    diaLicencia.disponible_anual -= quantity;
                  }
                }
              } else {
                // Si no hay fecha de inicio, afectar año actual (comportamiento por defecto)
                if (typeof diaLicencia.utilizada_anual === 'number' && typeof diaLicencia.disponible_anual === 'number') {
                  diaLicencia.utilizada_anual += quantity;
                  diaLicencia.disponible_anual -= quantity;
                }
              }
            } else if (licenseType.periodo_control === 'mensual' && typeof diaLicencia.utilizada_mes_actual === 'number' && typeof diaLicencia.disponible_mes_actual === 'number') {
              diaLicencia.utilizada_mes_actual += quantity;
              diaLicencia.disponible_mes_actual -= quantity;
            }
            diaLicencia.ultima_actualizacion = getCurrentDateInElSalvador();
          }
          break;
        }

        case 'OCASION': {
          const ocasionLicencia = disponibilidad.licencias_ocasion?.[licenseTypeCode];
          if (ocasionLicencia) {
            // ✅ NUEVO: Manejo especial para OM14 (Olvido de Marcación) retroactivo
            if (licenseTypeCode === 'OM14' && startDate) {
              const olvidoMonth = startDate.getMonth() + 1;
              const olvidoYear = startDate.getFullYear();
              const currentMonth = getCurrentDateInElSalvador().getMonth() + 1;
              const currentYear = getCurrentDateInElSalvador().getFullYear();
              
              // Si el olvido es de un mes anterior, actualizar el historial de ese mes
              if (olvidoYear < currentYear || (olvidoYear === currentYear && olvidoMonth < currentMonth)) {
                const monthKey = `${olvidoYear}-${olvidoMonth.toString().padStart(2, '0')}`;
                
                // Inicializar historial mensual si no existe
                if (!ocasionLicencia.uso_mensual) {
                  ocasionLicencia.uso_mensual = {};
                }
                
                // Actualizar el mes del olvido
                if (!ocasionLicencia.uso_mensual[monthKey]) {
                  ocasionLicencia.uso_mensual[monthKey] = { utilizada: 0, disponible: 2 };
                }
                
                ocasionLicencia.uso_mensual[monthKey].utilizada += quantity;
                ocasionLicencia.uso_mensual[monthKey].disponible -= quantity;
                
                console.log(`✅ Olvido retroactivo registrado para ${monthKey}: ${quantity} olvido(s)`);
              } else {
                // Si es del mes actual, afectar disponibilidad actual
                ocasionLicencia.utilizada_mes_actual = (ocasionLicencia.utilizada_mes_actual || 0) + quantity;
                ocasionLicencia.disponible_mes_actual = (ocasionLicencia.disponible_mes_actual || 2) - quantity;
              }
            } else {
              // Para otros tipos de OCASIÓN, solo actualizar contadores anuales
              ocasionLicencia.total_dias_año = (ocasionLicencia.total_dias_año || 0) + quantity;
              ocasionLicencia.total_solicitudes_año = (ocasionLicencia.total_solicitudes_año || 0) + 1;
            }
            
            ocasionLicencia.ultima_actualizacion = getCurrentDateInElSalvador();
          }
          break;
        }
      }

      // Actualizar empleado
      const employeeRef = doc(db, this.employeesCollection, employeeId);
      await updateDoc(employeeRef, {
        disponibilidad: this.removeUndefinedValues(disponibilidad),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating employee availability:', error);
      throw error;
    }
  }

  // ========================================
  // GESTIÓN DE DISPONIBILIDAD DE EMPLEADOS
  // ========================================

  // Inicializar disponibilidad para un empleado
  static async initializeEmployeeAvailability(employeeId: string): Promise<void> {
    try {
      console.log(`🔄 Inicializando disponibilidad para empleado: ${employeeId}`);
      
      const employee = await this.getEmployeeById(employeeId);
      if (!employee) {
        throw new Error('Empleado no encontrado');
      }

      const licenseTypes = await this.getActiveLicenseTypes();
             const currentYear = getCurrentDateInElSalvador().getFullYear();
       const currentMonth = getCurrentDateInElSalvador().getMonth() + 1;

      // Crear estructura de disponibilidad
      const disponibilidad = {
        año_actual: currentYear,
        mes_actual: currentMonth,
                 ultima_renovacion_anual: getCurrentDateInElSalvador(),
         ultima_renovacion_mensual: getCurrentDateInElSalvador(),
        licencias_horas: {} as Record<string, LicenciaHora>,
        licencias_dias: {} as Record<string, LicenciaDia>,
        licencias_ocasion: {} as Record<string, LicenciaOcasion>,
      };

      // Inicializar cada tipo de licencia según categoría
      for (const licenseType of licenseTypes) {
        // Verificar elegibilidad por género
        if (licenseType.aplica_genero) {
          const employeeGender = employee.gender === 'male' ? 'M' : employee.gender === 'female' ? 'F' : 'M';
          if (employeeGender !== licenseType.aplica_genero) {
            continue; // Saltar si no es elegible
          }
        }

        switch (licenseType.categoria) {
                     case 'HORAS':
             disponibilidad.licencias_horas[licenseType.codigo] = {
               codigo: licenseType.codigo,
               nombre: licenseType.nombre,
               categoria: 'HORAS',
               periodo_control: licenseType.periodo_control,
               asignada_anual: licenseType.cantidad_maxima,
               utilizada_anual: 0,
               disponible_anual: licenseType.cantidad_maxima,
               asignada_actual: licenseType.cantidad_maxima,
               utilizada_actual: 0,
               disponible_actual: licenseType.cantidad_maxima,
               unidad: licenseType.unidad_control,
               ...(licenseType.aplica_genero && { aplica_genero: licenseType.aplica_genero }),
               periodo_activo: true,
               fecha_inicio_periodo: getCurrentDateInElSalvador(),
               fecha_fin_periodo: new Date(getCurrentDateInElSalvador().getFullYear(), 11, 31), // Fin de año
               solicitudes_activas: [],
               ultima_actualizacion: getCurrentDateInElSalvador(),
             };
            break;

                     case 'DIAS':
             disponibilidad.licencias_dias[licenseType.codigo] = {
               codigo: licenseType.codigo,
               nombre: licenseType.nombre,
               categoria: 'DIAS',
               periodo_control: licenseType.periodo_control,
               asignada_anual: licenseType.periodo_control === 'anual' ? licenseType.cantidad_maxima : 0,
               utilizada_anual: 0,
               disponible_anual: licenseType.periodo_control === 'anual' ? licenseType.cantidad_maxima : 0,
               asignada_mensual: licenseType.periodo_control === 'mensual' ? licenseType.cantidad_maxima : 0,
               utilizada_mes_actual: 0,
               disponible_mes_actual: licenseType.periodo_control === 'mensual' ? licenseType.cantidad_maxima : 0,
               asignada_por_embarazo: licenseType.codigo === 'MG07' ? licenseType.cantidad_maxima : 0,
               utilizada_embarazo_actual: 0,
               disponible_embarazo_actual: licenseType.codigo === 'MG07' ? licenseType.cantidad_maxima : 0,
               unidad: licenseType.unidad_control,
               ...(licenseType.aplica_genero && { aplica_genero: licenseType.aplica_genero }),
               embarazo_activo: false,
               uso_mensual: {},
               solicitudes_activas: [],
               ultima_actualizacion: getCurrentDateInElSalvador(),
             };
            break;

          case 'OCASION':
            disponibilidad.licencias_ocasion[licenseType.codigo] = {
              codigo: licenseType.codigo,
              nombre: licenseType.nombre,
              categoria: 'OCASION',
              periodo_control: 'ninguno',
              max_por_solicitud: licenseType.max_por_solicitud,
              unidad: licenseType.unidad_control,
                             historial_uso: [],
               total_dias_año: 0,
               total_solicitudes_año: 0,
               solicitudes_activas: [],
               ultima_actualizacion: getCurrentDateInElSalvador(),
            };
            break;
        }
      }

             // Limpiar valores undefined antes de enviar a Firestore
       const cleanDisponibilidad = this.removeUndefinedValues(disponibilidad);
       
       // Actualizar empleado con disponibilidad
       const employeeRef = doc(db, this.employeesCollection, employeeId);
       await updateDoc(employeeRef, {
         disponibilidad: cleanDisponibilidad,
         updatedAt: serverTimestamp(),
       });

      console.log(`✅ Disponibilidad inicializada para empleado: ${employeeId}`);
    } catch (error) {
      console.error('❌ Error inicializando disponibilidad:', error);
      throw new Error('Error al inicializar disponibilidad del empleado');
    }
  }

  // Obtener disponibilidad de un empleado
  static async getEmployeeAvailability(employeeId: string): Promise<Employee['disponibilidad'] | null> {
    try {
      const employee = await this.getEmployeeById(employeeId);
      return employee?.disponibilidad || null;
    } catch (error) {
      console.error('Error getting employee availability:', error);
      throw new Error('Error al obtener disponibilidad del empleado');
    }
  }

  // Renovar disponibilidad anual
  static async renewAnnualAvailability(employeeId: string): Promise<void> {
    try {
      console.log(`🔄 Renovando disponibilidad anual para empleado: ${employeeId}`);
      
      const employee = await this.getEmployeeById(employeeId);
      if (!employee?.disponibilidad) {
        throw new Error('Empleado o disponibilidad no encontrada');
      }

             const licenseTypes = await this.getActiveLicenseTypes();
       const currentYear = getCurrentDateInElSalvador().getFullYear();
      const disponibilidad = { ...employee.disponibilidad };

      // Renovar licencias anuales
      for (const licenseType of licenseTypes) {
        if (licenseType.periodo_control === 'anual') {
          switch (licenseType.categoria) {
            case 'HORAS':
              if (disponibilidad.licencias_horas[licenseType.codigo]) {
                disponibilidad.licencias_horas[licenseType.codigo].asignada_anual = licenseType.cantidad_maxima;
                disponibilidad.licencias_horas[licenseType.codigo].utilizada_anual = 0;
                disponibilidad.licencias_horas[licenseType.codigo].disponible_anual = licenseType.cantidad_maxima;
                disponibilidad.licencias_horas[licenseType.codigo].ultima_actualizacion = new Date();
              }
              break;

            case 'DIAS':
              if (disponibilidad.licencias_dias[licenseType.codigo]) {
                disponibilidad.licencias_dias[licenseType.codigo].asignada_anual = licenseType.cantidad_maxima;
                disponibilidad.licencias_dias[licenseType.codigo].utilizada_anual = 0;
                disponibilidad.licencias_dias[licenseType.codigo].disponible_anual = licenseType.cantidad_maxima;
                disponibilidad.licencias_dias[licenseType.codigo].ultima_actualizacion = new Date();
              }
              break;
          }
        }
      }

             disponibilidad.año_actual = currentYear;
       disponibilidad.ultima_renovacion_anual = getCurrentDateInElSalvador();

      // Actualizar empleado
      const employeeRef = doc(db, this.employeesCollection, employeeId);
      await updateDoc(employeeRef, {
        disponibilidad,
        updatedAt: serverTimestamp(),
      });

      console.log(`✅ Disponibilidad anual renovada para empleado: ${employeeId}`);
    } catch (error) {
      console.error('❌ Error renovando disponibilidad anual:', error);
      throw new Error('Error al renovar disponibilidad anual');
    }
  }

  // Renovar disponibilidad mensual
  static async renewMonthlyAvailability(employeeId: string): Promise<void> {
    try {
      console.log(`🔄 Renovando disponibilidad mensual para empleado: ${employeeId}`);
      
      const employee = await this.getEmployeeById(employeeId);
      if (!employee?.disponibilidad) {
        throw new Error('Empleado o disponibilidad no encontrada');
      }

             const licenseTypes = await this.getActiveLicenseTypes();
       const currentMonth = getCurrentDateInElSalvador().getMonth() + 1;
      const disponibilidad = { ...employee.disponibilidad };

      // Renovar licencias mensuales
      for (const licenseType of licenseTypes) {
        if (licenseType.periodo_control === 'mensual') {
          switch (licenseType.categoria) {
            case 'DIAS':
              if (disponibilidad.licencias_dias[licenseType.codigo]) {
                disponibilidad.licencias_dias[licenseType.codigo].asignada_mensual = licenseType.cantidad_maxima;
                disponibilidad.licencias_dias[licenseType.codigo].utilizada_mes_actual = 0;
                disponibilidad.licencias_dias[licenseType.codigo].disponible_mes_actual = licenseType.cantidad_maxima;
                disponibilidad.licencias_dias[licenseType.codigo].ultima_actualizacion = new Date();
              }
              break;
          }
        }
      }

             disponibilidad.mes_actual = currentMonth;
       disponibilidad.ultima_renovacion_mensual = getCurrentDateInElSalvador();

      // Actualizar empleado
      const employeeRef = doc(db, this.employeesCollection, employeeId);
      await updateDoc(employeeRef, {
        disponibilidad,
        updatedAt: serverTimestamp(),
      });

      console.log(`✅ Disponibilidad mensual renovada para empleado: ${employeeId}`);
    } catch (error) {
      console.error('❌ Error renovando disponibilidad mensual:', error);
      throw new Error('Error al renovar disponibilidad mensual');
    }
  }

       // ========================================
  // GESTIÓN DE SOLICITUDES DE LICENCIAS
  // ========================================

  // Crear solicitud de licencia (aprobación automática)
  static async createLicenseRequest(data: CreateLicenseRequestData): Promise<LicenseRequest> {
    try {
      console.log(`🔄 Creando solicitud de licencia para empleado: ${data.employeeId}`);
      
      // Obtener información del tipo de licencia
      const licenseType = await this.getLicenseTypeByCode(data.licenseTypeCode);
      if (!licenseType) {
        throw new Error('Tipo de licencia no encontrado');
      }

      // Obtener empleado
      const employee = await this.getEmployeeById(data.employeeId);
      if (!employee) {
        throw new Error('Empleado no encontrado');
      }

      // Validar disponibilidad
      const availableQuantity = await this.getAvailableQuantity(data.employeeId, data.licenseTypeCode);
      if (data.quantity > availableQuantity) {
        throw new Error(`Cantidad solicitada (${data.quantity}) excede la disponibilidad (${availableQuantity})`);
      }

      // Crear la solicitud
      const docRef = doc(collection(db, this.licenseRequestsCollection));
      const licenseRequest: Omit<LicenseRequest, 'id'> = {
        employeeId: data.employeeId,
        licenseTypeCode: data.licenseTypeCode,
        licenseTypeName: licenseType.nombre,
        startDate: data.startDate,
        endDate: data.endDate,
        quantity: data.quantity,
        reason: data.reason,
        observations: data.observations,
        status: 'active',
                 createdAt: getCurrentDateInElSalvador(),
         updatedAt: getCurrentDateInElSalvador(),
      };

      await setDoc(docRef, licenseRequest);

      // Actualizar disponibilidad del empleado
      await this.updateEmployeeAvailability(data.employeeId, data.licenseTypeCode, data.quantity, data.startDate);

      console.log(`✅ Solicitud de licencia creada: ${docRef.id}`);
      
      return {
        id: docRef.id,
        ...licenseRequest,
      };
    } catch (error) {
      console.error('❌ Error creando solicitud de licencia:', error);
      throw error;
    }
  }

  // Obtener solicitudes de un empleado
  static async getEmployeeLicenseRequests(employeeId: string): Promise<LicenseRequest[]> {
    try {
      const q = query(
        collection(db, this.licenseRequestsCollection),
        where('employeeId', '==', employeeId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.mapDocumentToLicenseRequest(doc));
    } catch (error) {
      console.error('Error getting employee license requests:', error);
      throw new Error('Error al obtener solicitudes de licencia del empleado');
    }
  }

  // Actualizar solicitud de licencia
  static async updateLicenseRequest(requestId: string, updates: Partial<LicenseRequest>): Promise<void> {
    try {
      console.log(`🔄 Actualizando solicitud de licencia: ${requestId}`);
      
      // Obtener la solicitud actual antes de actualizarla
      const docRef = doc(db, this.licenseRequestsCollection, requestId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Solicitud de licencia no encontrada');
      }
      
      const currentRequest = this.mapDocumentToLicenseRequest(docSnap);
      
      // Restaurar disponibilidad de la solicitud actual
      await this.restoreEmployeeAvailability(
        currentRequest.employeeId, 
        currentRequest.licenseTypeCode, 
        currentRequest.quantity, 
        currentRequest.startDate
      );
      
      // Actualizar la solicitud
      await updateDoc(docRef, {
        ...updates,
        updatedAt: getCurrentDateInElSalvador(),
      });
      
      // Si hay cambios en cantidad o fechas, actualizar disponibilidad con los nuevos valores
      if (updates.quantity !== undefined || updates.startDate !== undefined) {
        const newQuantity = updates.quantity ?? currentRequest.quantity;
        const newStartDate = updates.startDate ?? currentRequest.startDate;
        
        await this.updateEmployeeAvailability(
          currentRequest.employeeId, 
          currentRequest.licenseTypeCode, 
          newQuantity, 
          newStartDate
        );
      }
      
      console.log(`✅ Solicitud de licencia actualizada: ${requestId}`);
    } catch (error) {
      console.error('Error updating license request:', error);
      throw new Error('Error al actualizar solicitud de licencia');
    }
  }

  // Eliminar solicitud de licencia
  static async deleteLicenseRequest(requestId: string): Promise<void> {
    try {
      console.log(`🗑️ Eliminando solicitud de licencia: ${requestId}`);
      
      // Obtener la solicitud antes de eliminarla
      const docRef = doc(db, this.licenseRequestsCollection, requestId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error('Solicitud de licencia no encontrada');
      }
      
      const request = this.mapDocumentToLicenseRequest(docSnap);
      
      // Restaurar disponibilidad del empleado
      await this.restoreEmployeeAvailability(
        request.employeeId, 
        request.licenseTypeCode, 
        request.quantity, 
        request.startDate
      );
      
      // Eliminar la solicitud
      await deleteDoc(docRef);
      
      console.log(`✅ Solicitud de licencia eliminada: ${requestId}`);
    } catch (error) {
      console.error('Error deleting license request:', error);
      throw new Error('Error al eliminar solicitud de licencia');
    }
  }

  // ========================================
  // MÉTODOS PRIVADOS
  // ========================================

   // Remover valores undefined de un objeto
   private static removeUndefinedValues(obj: unknown): unknown {
     if (obj === null || obj === undefined) {
       return obj;
     }
     
     if (Array.isArray(obj)) {
       return obj.map(item => this.removeUndefinedValues(item));
     }
     
     if (typeof obj === 'object') {
       const cleaned: Record<string, unknown> = {};
       for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
         if (value !== undefined) {
           cleaned[key] = this.removeUndefinedValues(value);
         }
       }
       return cleaned;
     }
     
     return obj;
   }

  // Mapear documento de Firestore a objeto LicenseType
  private static mapDocumentToLicenseType(doc: QueryDocumentSnapshot<DocumentData>): LicenseType {
    const data = doc.data();
    return {
      id: doc.id,
      codigo: data.codigo,
      nombre: data.nombre,
      categoria: data.categoria,
      periodo_control: data.periodo_control,
      cantidad_maxima: data.cantidad_maxima,
      unidad_control: data.unidad_control,
      aplica_genero: data.aplica_genero,
      max_por_solicitud: data.max_por_solicitud,
      descripcion: data.descripcion,
      activo: data.activo,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
    };
  }

  // Mapear documento de Firestore a objeto LicenseRequest
  private static mapDocumentToLicenseRequest(doc: QueryDocumentSnapshot<DocumentData>): LicenseRequest {
    const data = doc.data();
    return {
      id: doc.id,
      employeeId: data.employeeId,
      licenseTypeCode: data.licenseTypeCode,
      licenseTypeName: data.licenseTypeName,
      startDate: data.startDate?.toDate ? data.startDate.toDate() : new Date(),
      endDate: data.endDate?.toDate ? data.endDate.toDate() : new Date(),
      quantity: data.quantity,
      reason: data.reason,
      observations: data.observations,
      status: data.status,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
    };
  }

  // Obtener empleado por ID
  private static async getEmployeeById(id: string): Promise<Employee | null> {
    try {
      const docRef = doc(db, this.employeesCollection, id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          employeeId: data.employeeId,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          department: data.department,
          position: data.position,
          employeeType: data.employeeType || 'operativo',
          hireDate: data.hireDate?.toDate ? data.hireDate.toDate() : new Date(),
          birthDate: data.birthDate?.toDate ? data.birthDate.toDate() : new Date(),
          salary: data.salary,
          gender: data.gender || 'male',
          personalType: data.personalType || 'full-time',
          address: data.address,
          emergencyContact: data.emergencyContact,
          isActive: data.isActive,
          disponibilidad: data.disponibilidad,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date(),
        };
      }

      return null;
    } catch (error) {
      console.error('Error getting employee by ID:', error);
      throw new Error('Error al obtener empleado');
    }
  }
}
