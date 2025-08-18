import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC3zx8GWpHQ3SSlhrZiF4e3kgjGbraEt8g",
  authDomain: "gestor-licencias-firebas-76c57.firebaseapp.com",
  projectId: "gestor-licencias-firebas-76c57",
  storageBucket: "gestor-licencias-firebas-76c57.firebasestorage.app",
  messagingSenderId: "548549101547",
  appId: "1:548549101547:web:9682a066fb0dc42c437bae",
  measurementId: "G-F5YTZ695P3"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function updateNewPermissions() {
  console.log('🔧 ACTUALIZANDO NUEVOS PERMISOS - OLVIDOS Y CAMBIOS DE TURNO');
  console.log('============================================================');
  
  try {
    const licenseTypesSnapshot = await getDocs(collection(db, 'licenseTypes'));
    const licenses = licenseTypesSnapshot.docs;
    console.log(`✅ Total de licencias encontradas: ${licenses.length}`);

    // Configuración específica para los nuevos permisos
    const newPermissionsConfig: Record<string, any> = {
      // OL01 - Olvido de Marcación (Entrada o Salida)
      'OL01': {
        specialFields: {
          type: 'ol01',
          fields: [
            {
              name: 'fechaOlvido',
              type: 'date',
              label: 'Fecha del Olvido',
              required: true
            },
            {
              name: 'tipoOlvido',
              type: 'select',
              label: 'Tipo de Olvido',
              required: true,
              options: [
                { value: 'entrada', label: 'Olvido de Entrada' },
                { value: 'salida', label: 'Olvido de Salida' }
              ]
            },
            {
              name: 'justificacion',
              type: 'textarea',
              label: 'Justificación del Olvido',
              required: true,
              placeholder: 'Explique detalladamente por qué olvidó marcar...'
            }
          ]
        },
        requiresJustification: true,
        unitControl: 'uses',
        periodControl: 'monthly',
        totalAvailable: 2, // 2 olvidos mensuales
        maxDaysPerRequest: 1,
        category: 'Administrativa',
        hasSalary: true,
        isAccumulable: false,
        isTransferable: false,
        autoRenewal: true
      },
      // CT01 - Cambio de Turno
      'CT01': {
        specialFields: {
          type: 'ct01',
          fields: [
            {
              name: 'turnoActual',
              type: 'select',
              label: 'Turno Actual',
              required: true,
              options: [
                { value: 'matutino', label: 'Matutino (6:00 - 14:00)' },
                { value: 'vespertino', label: 'Vespertino (14:00 - 22:00)' },
                { value: 'nocturno', label: 'Nocturno (22:00 - 6:00)' },
                { value: 'administrativo', label: 'Administrativo (8:00 - 17:00)' }
              ]
            },
            {
              name: 'turnoSolicitado',
              type: 'select',
              label: 'Turno Solicitado',
              required: true,
              options: [
                { value: 'matutino', label: 'Matutino (6:00 - 14:00)' },
                { value: 'vespertino', label: 'Vespertino (14:00 - 22:00)' },
                { value: 'nocturno', label: 'Nocturno (22:00 - 6:00)' },
                { value: 'administrativo', label: 'Administrativo (8:00 - 17:00)' }
              ]
            },
            {
              name: 'fechaCambio',
              type: 'date',
              label: 'Fecha de Cambio de Turno',
              required: true
            },
            {
              name: 'justificacion',
              type: 'textarea',
              label: 'Justificación del Cambio',
              required: true,
              placeholder: 'Explique el motivo del cambio de turno...'
            }
          ]
        },
        requiresJustification: true,
        unitControl: 'uses',
        periodControl: 'monthly',
        totalAvailable: 3, // 3 cambios mensuales
        maxDaysPerRequest: 1,
        category: 'Administrativa',
        hasSalary: true,
        isAccumulable: false,
        isTransferable: false,
        autoRenewal: true
      },
      // IT01 - Intercambio de Turnos
      'IT01': {
        specialFields: {
          type: 'it01',
          fields: [
            {
              name: 'empleadoIntercambio',
              type: 'text',
              label: 'Empleado para Intercambio',
              required: true,
              placeholder: 'Código o nombre del empleado'
            },
            {
              name: 'turnoEmpleado',
              type: 'select',
              label: 'Turno del Empleado',
              required: true,
              options: [
                { value: 'matutino', label: 'Matutino (6:00 - 14:00)' },
                { value: 'vespertino', label: 'Vespertino (14:00 - 22:00)' },
                { value: 'nocturno', label: 'Nocturno (22:00 - 6:00)' },
                { value: 'administrativo', label: 'Administrativo (8:00 - 17:00)' }
              ]
            },
            {
              name: 'turnoSolicitante',
              type: 'select',
              label: 'Turno del Solicitante',
              required: true,
              options: [
                { value: 'matutino', label: 'Matutino (6:00 - 14:00)' },
                { value: 'vespertino', label: 'Vespertino (14:00 - 22:00)' },
                { value: 'nocturno', label: 'Nocturno (22:00 - 6:00)' },
                { value: 'administrativo', label: 'Administrativo (8:00 - 17:00)' }
              ]
            },
            {
              name: 'fechaIntercambio',
              type: 'date',
              label: 'Fecha de Intercambio',
              required: true
            },
            {
              name: 'justificacion',
              type: 'textarea',
              label: 'Justificación del Intercambio',
              required: true,
              placeholder: 'Explique el motivo del intercambio de turnos...'
            }
          ]
        },
        requiresJustification: true,
        unitControl: 'uses',
        periodControl: 'monthly',
        totalAvailable: 3, // 3 intercambios mensuales
        maxDaysPerRequest: 1,
        category: 'Administrativa',
        hasSalary: true,
        isAccumulable: false,
        isTransferable: false,
        autoRenewal: true
      }
    };

    let updatedCount = 0;
    for (const licenseDoc of licenses) {
      const data = licenseDoc.data();
      const code = data.code;
      const newPermissionUpdate = newPermissionsConfig[code];

      if (newPermissionUpdate) {
        console.log(`🔄 Actualizando ${code} con nuevos permisos...`);
        await updateDoc(doc(db, 'licenseTypes', licenseDoc.id), newPermissionUpdate);
        updatedCount++;
        console.log(`✅ ${code} actualizado correctamente`);
      }
    }

    console.log(`\n🎉 ACTUALIZACIÓN DE NUEVOS PERMISOS COMPLETADA!`);
    console.log(`✅ Licencias actualizadas: ${updatedCount}`);
    console.log(`📋 Permisos configurados:`);
    
    // Mostrar resumen de las licencias actualizadas
    for (const [code, config] of Object.entries(newPermissionsConfig)) {
      console.log(`   - ${code}: ${config.specialFields.type === 'ol01' ? 'Olvido de Marcación' : config.specialFields.type === 'ct01' ? 'Cambio de Turno' : 'Intercambio de Turnos'}`);
      console.log(`     Campos especiales: ${config.specialFields.fields.length} campos`);
      console.log(`     Límite mensual: ${config.totalAvailable} usos`);
      config.specialFields.fields.forEach((field: any) => {
        console.log(`       • ${field.label} (${field.type})${field.required ? ' *' : ''}`);
      });
    }

  } catch (error) {
    console.error('❌ Error durante la actualización:', error);
  }
}

if (typeof window !== 'undefined') {
  (window as any).updateNewPermissions = updateNewPermissions;
}
