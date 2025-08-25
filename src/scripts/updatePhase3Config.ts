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

export async function updatePhase3Config() {
  console.log('🔧 ACTUALIZANDO CONFIGURACIÓN FASE 3 - CAMPOS ESPECIALES');
  console.log('========================================================');
  
  try {
    const licenseTypesSnapshot = await getDocs(collection(db, 'licenseTypes'));
    const licenses = licenseTypesSnapshot.docs;
    console.log(`✅ Total de licencias encontradas: ${licenses.length}`);

    // Configuración específica para FASE 3 - Campos especiales
    const phase3Config: Record<string, any> = {
      // OM14 - Otras Modalidades (campos especiales)
      'OM14': {
        specialFields: {
          type: 'om14',
          fields: [
            {
              name: 'modalidad',
              type: 'text',
              label: 'Especifique la Modalidad',
              required: true,
              placeholder: 'Ej: Trabajo remoto, Horario flexible, etc.'
            },
            {
              name: 'cantidad',
              type: 'number',
              label: 'Cantidad de Días/Horas',
              required: true,
              placeholder: 'Ingrese la cantidad',
              validation: {
                min: 1,
                max: 365
              }
            },
            {
              name: 'justificacion',
              type: 'textarea',
              label: 'Justificación Detallada',
              required: true,
              placeholder: 'Describa detalladamente el motivo y beneficios de esta modalidad...'
            }
          ]
        },
        requiresJustification: true,
        unitControl: 'days',
        periodControl: 'annual',
        totalAvailable: 30,
        maxDaysPerRequest: 15
      },
      // CT15 - Capacitación y Talleres (campos especiales)
      'CT15': {
        specialFields: {
          type: 'ct15',
          fields: [
            {
              name: 'cursoNombre',
              type: 'text',
              label: 'Nombre del Curso/Taller',
              required: true,
              placeholder: 'Ej: Curso de Liderazgo, Taller de Excel Avanzado'
            },
            {
              name: 'institucion',
              type: 'text',
              label: 'Institución/Organizador',
              required: true,
              placeholder: 'Ej: Universidad XYZ, Instituto ABC'
            },
            {
              name: 'fechaCertificacion',
              type: 'date',
              label: 'Fecha de Certificación',
              required: true
            },
            {
              name: 'justificacion',
              type: 'textarea',
              label: 'Justificación de la Capacitación',
              required: true,
              placeholder: 'Explique cómo esta capacitación beneficiará su desarrollo profesional y la organización...'
            }
          ]
        },
        requiresJustification: true,
        unitControl: 'days',
        periodControl: 'annual',
        totalAvailable: 20,
        maxDaysPerRequest: 10
      }
    };

    let updatedCount = 0;
    for (const licenseDoc of licenses) {
      const data = licenseDoc.data();
      const code = data.code;
      const phase3Update = phase3Config[code];

      if (phase3Update) {
        console.log(`🔄 Actualizando ${code} con campos especiales...`);
        await updateDoc(doc(db, 'licenseTypes', licenseDoc.id), phase3Update);
        updatedCount++;
        console.log(`✅ ${code} actualizado correctamente`);
      }
    }

    console.log(`\n🎉 ACTUALIZACIÓN FASE 3 COMPLETADA!`);
    console.log(`✅ Licencias actualizadas: ${updatedCount}`);
    console.log(`📋 Licencias configuradas:`);
    
    // Mostrar resumen de las licencias actualizadas
    for (const [code, config] of Object.entries(phase3Config)) {
      console.log(`   - ${code}: ${config.specialFields.type === 'om14' ? 'Otras Modalidades' : 'Capacitación'}`);
      console.log(`     Campos especiales: ${config.specialFields.fields.length} campos`);
      config.specialFields.fields.forEach((field: any) => {
        console.log(`       • ${field.label} (${field.type})${field.required ? ' *' : ''}`);
      });
    }

  } catch (error) {
    console.error('❌ Error durante la actualización:', error);
  }
}

if (typeof window !== 'undefined') {
  (window as any).updatePhase3Config = updatePhase3Config;
}
