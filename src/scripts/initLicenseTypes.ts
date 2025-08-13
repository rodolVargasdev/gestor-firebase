import { collection, addDoc, getDocs, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { LICENSE_CONFIGS } from '../types';

export async function initializeLicenseTypes() {
  console.log('🏢 Inicializando tipos de licencias laborales...');
  
  try {
    // Verificar si ya existen tipos de licencia
    const existingTypes = await checkLicenseTypesExist();
    if (existingTypes) {
      console.log('✅ Los tipos de licencia ya existen en la base de datos');
      return;
    }

    // Crear cada tipo de licencia
    for (const [key, config] of Object.entries(LICENSE_CONFIGS)) {
      try {
        await addDoc(collection(db, 'licenseTypes'), {
          ...config,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        
        console.log(`✅ Tipo de licencia creado: ${config.code} - ${config.name}`);
      } catch (error) {
        console.error(`❌ Error al crear tipo de licencia ${config.code}:`, error);
      }
    }

    console.log('🎉 Todos los tipos de licencias laborales han sido inicializados exitosamente');
    console.log('📊 Tipos de licencia creados:');
    Object.values(LICENSE_CONFIGS).forEach(config => {
      console.log(`  • ${config.code}: ${config.name}`);
    });
    
  } catch (error) {
    console.error('❌ Error al inicializar tipos de licencia:', error);
    throw error;
  }
}

export async function checkLicenseTypesExist(): Promise<boolean> {
  try {
    const licenseTypesRef = collection(db, 'licenseTypes');
    const snapshot = await getDocs(licenseTypesRef);
    return !snapshot.empty;
  } catch (error) {
    console.error('❌ Error al verificar tipos de licencia existentes:', error);
    return false;
  }
}

// Función para crear un tipo de licencia específico
export async function createLicenseType(licenseTypeData: any) {
  try {
    const docRef = await addDoc(collection(db, 'licenseTypes'), {
      ...licenseTypeData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    console.log(`✅ Tipo de licencia creado: ${licenseTypeData.code}`);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error al crear tipo de licencia:', error);
    throw error;
  }
}

// Función para obtener todos los tipos de licencia
export async function getAllLicenseTypes() {
  try {
    const licenseTypesRef = collection(db, 'licenseTypes');
    const snapshot = await getDocs(licenseTypesRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('❌ Error al obtener tipos de licencia:', error);
    throw error;
  }
}

// Función para obtener un tipo de licencia por código
export async function getLicenseTypeByCode(code: string) {
  try {
    const licenseTypesRef = collection(db, 'licenseTypes');
    const q = query(licenseTypesRef, where('code', '==', code));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data()
      };
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error al obtener tipo de licencia por código:', error);
    throw error;
  }
}

// Función para verificar disponibilidad de un empleado para un tipo de licencia
export async function checkEmployeeAvailability(employeeId: string, licenseTypeCode: string) {
  try {
    // Obtener el tipo de licencia
    const licenseType = await getLicenseTypeByCode(licenseTypeCode);
    if (!licenseType) {
      throw new Error(`Tipo de licencia ${licenseTypeCode} no encontrado`);
    }

    // Obtener la disponibilidad del empleado para este tipo de licencia
    const availabilityRef = collection(db, 'availability');
    const q = query(
      availabilityRef, 
      where('employeeId', '==', employeeId),
      where('licenseTypeId', '==', licenseType.id)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      // Si no hay registro de disponibilidad, crear uno inicial
      return {
        available: (licenseType as any).totalAvailable || 0,
        used: 0,
                  remaining: (licenseType as any).totalAvailable || 0,
        licenseType
      };
    }

    const availability = snapshot.docs[0].data();
    return {
      available: availability.currentPeriod.totalAvailable,
      used: availability.currentPeriod.usedQuantity,
      remaining: availability.currentPeriod.remainingQuantity,
      licenseType
    };
  } catch (error) {
    console.error('❌ Error al verificar disponibilidad:', error);
    throw error;
  }
}

// Función para validar si un empleado puede solicitar una licencia
export async function validateLicenseRequest(employeeId: string, licenseTypeCode: string, requestedQuantity: number) {
  try {
    const availability = await checkEmployeeAvailability(employeeId, licenseTypeCode);
    const { licenseType, remaining } = availability;

    // Validaciones específicas por tipo de licencia
    switch (licenseTypeCode) {
      case 'EG03': // Enfermedad con goce
      case 'DG06': // Duelo
      case 'AG09': // Paternidad
      case 'OG10': // Matrimonio
        if (requestedQuantity > ((licenseType as any).maxDaysPerRequest || 3)) {
          throw new Error(`No se pueden solicitar más de ${(licenseType as any).maxDaysPerRequest || 3} días para este tipo de licencia`);
        }
        break;
        
      case 'MG07': // Maternidad
        if (requestedQuantity > remaining) {
          throw new Error(`No hay suficientes días disponibles. Disponible: ${remaining} días`);
        }
        break;
        
      case 'LG08': // Lactancia materna
        if (requestedQuantity > 180) {
          throw new Error('La licencia por lactancia materna no puede exceder 6 meses (180 días)');
        }
        break;
        
      case 'OM14': // Olvido de marcación
        if (remaining < 1) {
          throw new Error('No hay olvidos de marcación disponibles este mes');
        }
        break;
        
      case 'CT15': // Cambio de turno
        if (remaining < 1) {
          throw new Error('No hay cambios de turno disponibles este mes');
        }
        break;
        
      default:
        // Para licencias con período de control
        if ((licenseType as any).periodControl !== 'none' && requestedQuantity > remaining) {
          throw new Error(`No hay suficientes ${(licenseType as any).unitControl} disponibles. Disponible: ${remaining}`);
        }
    }

    return {
      valid: true,
      availability,
      message: 'Solicitud válida'
    };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Error de validación',
      availability: null
    };
  }
}
