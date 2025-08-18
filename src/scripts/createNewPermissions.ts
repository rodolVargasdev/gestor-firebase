import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

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

export async function createNewPermissions() {
  console.log('🔧 CREANDO NUEVOS PERMISOS - OLVIDOS Y CAMBIOS DE TURNO');
  console.log('========================================================');
  
  try {
    // Configuración de los nuevos permisos
    const newPermissions = [
      {
        // OL01 - Olvido de Marcación
        code: 'OL01',
        name: 'Olvido de Marcación',
        description: 'Permiso para olvidos de marcación de entrada o salida',
        category: 'Administrativa',
        unitControl: 'uses',
        periodControl: 'monthly',
        totalAvailable: 2, // 2 olvidos mensuales
        maxDaysPerRequest: 1,
        requiresJustification: true,
        hasSalary: true,
        isAccumulable: false,
        isTransferable: false,
        autoRenewal: true,
        isActive: true,
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        // CT01 - Cambio de Turno
        code: 'CT01',
        name: 'Cambio de Turno',
        description: 'Permiso para cambio de turno de trabajo',
        category: 'Administrativa',
        unitControl: 'uses',
        periodControl: 'monthly',
        totalAvailable: 3, // 3 cambios mensuales
        maxDaysPerRequest: 1,
        requiresJustification: true,
        hasSalary: true,
        isAccumulable: false,
        isTransferable: false,
        autoRenewal: true,
        isActive: true,
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
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        // IT01 - Intercambio de Turnos
        code: 'IT01',
        name: 'Intercambio de Turnos',
        description: 'Permiso para intercambio de turnos entre empleados',
        category: 'Administrativa',
        unitControl: 'uses',
        periodControl: 'monthly',
        totalAvailable: 3, // 3 intercambios mensuales
        maxDaysPerRequest: 1,
        requiresJustification: true,
        hasSalary: true,
        isAccumulable: false,
        isTransferable: false,
        autoRenewal: true,
        isActive: true,
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
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    let createdCount = 0;
    for (const permission of newPermissions) {
      console.log(`🔄 Creando ${permission.code}: ${permission.name}...`);
      
      try {
        await addDoc(collection(db, 'licenseTypes'), permission);
        createdCount++;
        console.log(`✅ ${permission.code} creado correctamente`);
      } catch (error) {
        console.error(`❌ Error al crear ${permission.code}:`, error);
      }
    }

    console.log(`\n🎉 CREACIÓN DE NUEVOS PERMISOS COMPLETADA!`);
    console.log(`✅ Permisos creados: ${createdCount}/${newPermissions.length}`);
    
    if (createdCount > 0) {
      console.log(`📋 Permisos creados:`);
      newPermissions.forEach(permission => {
        console.log(`   - ${permission.code}: ${permission.name}`);
        console.log(`     Campos especiales: ${permission.specialFields.fields.length} campos`);
        console.log(`     Límite mensual: ${permission.totalAvailable} usos`);
        permission.specialFields.fields.forEach((field: any) => {
          console.log(`       • ${field.label} (${field.type})${field.required ? ' *' : ''}`);
        });
      });
    }

  } catch (error) {
    console.error('❌ Error durante la creación:', error);
  }
}

if (typeof window !== 'undefined') {
  (window as any).createNewPermissions = createNewPermissions;
}
