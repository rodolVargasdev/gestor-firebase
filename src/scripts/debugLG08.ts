import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

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

export async function debugLG08() {
  console.log('🔍 DIAGNÓSTICO ESPECÍFICO DE LG08');
  console.log('==================================');
  
  try {
    // Buscar específicamente LG08
    const q = query(collection(db, 'licenseTypes'), where('code', '==', 'LG08'));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log('❌ No se encontró LG08 en Firestore');
      return;
    }
    
    const lg08Doc = querySnapshot.docs[0];
    const data = lg08Doc.data();
    
    console.log('✅ LG08 encontrado:');
    console.log(`ID: ${lg08Doc.id}`);
    console.log(`Código: ${data.code}`);
    console.log(`Nombre: ${data.name}`);
    console.log(`autoCalculateEndDate: ${data.autoCalculateEndDate} (tipo: ${typeof data.autoCalculateEndDate})`);
    console.log(`autoCalculateDays: ${data.autoCalculateDays} (tipo: ${typeof data.autoCalculateDays})`);
    console.log(`maxDaysPerRequest: ${data.maxDaysPerRequest} (tipo: ${typeof data.maxDaysPerRequest})`);
    console.log(`isActive: ${data.isActive} (tipo: ${typeof data.isActive})`);
    
    // Verificar si las propiedades están configuradas correctamente
    const hasAutoCalculate = data.autoCalculateEndDate === true;
    const hasAutoCalculateDays = typeof data.autoCalculateDays === 'number' && data.autoCalculateDays === 180;
    
    console.log('\n📊 ANÁLISIS DE CONFIGURACIÓN:');
    console.log(`✅ autoCalculateEndDate configurado: ${hasAutoCalculate}`);
    console.log(`✅ autoCalculateDays configurado: ${hasAutoCalculateDays}`);
    
    if (hasAutoCalculate && hasAutoCalculateDays) {
      console.log('🎉 LG08 está correctamente configurado para cálculo automático');
    } else {
      console.log('⚠️ LG08 NO está correctamente configurado');
      console.log('🔧 Ejecutando corrección específica...');
      
      // Corregir LG08 específicamente
      const { doc, updateDoc } = await import('firebase/firestore');
      await updateDoc(doc(db, 'licenseTypes', lg08Doc.id), {
        autoCalculateEndDate: true,
        autoCalculateDays: 180,
        maxDaysPerRequest: 180,
        isActive: true
      });
      
      console.log('✅ LG08 corregido exitosamente');
    }
    
  } catch (error) {
    console.error('❌ Error durante el diagnóstico de LG08:', error);
  }
}

if (typeof window !== 'undefined') {
  (window as any).debugLG08 = debugLG08;
}
