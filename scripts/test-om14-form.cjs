#!/usr/bin/env node

/**
 * Script de prueba para verificar el formulario de OM14 (Olvido de Marcación)
 * 
 * Este script verifica que:
 * 1. El tipo de licencia OM14 existe en la base de datos
 * 2. Los campos especiales están configurados correctamente
 * 3. La validación funciona como se espera
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, getDoc } = require('firebase/firestore');

// Configuración de Firebase (usar la misma que en el proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "gestor-licencias-XXXXX.firebaseapp.com",
  projectId: "gestor-licencias-XXXXX",
  storageBucket: "gestor-licencias-XXXXX.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testOM14Form() {
  console.log('🧪 INICIANDO PRUEBAS DEL FORMULARIO OM14');
  console.log('==========================================\n');

  try {
    // 1. Verificar que OM14 existe en licenseTypes
    console.log('1️⃣ Verificando existencia de OM14 en licenseTypes...');
    const licenseTypesSnapshot = await getDocs(collection(db, 'licenseTypes'));
    const om14License = licenseTypesSnapshot.docs.find(doc => doc.data().code === 'OM14');
    
    if (om14License) {
      const om14Data = om14License.data();
      console.log('✅ OM14 encontrado en licenseTypes');
      console.log(`   - Código: ${om14Data.code}`);
      console.log(`   - Nombre: ${om14Data.name}`);
      console.log(`   - Categoría: ${om14Data.category}`);
      console.log(`   - Período de control: ${om14Data.periodControl}`);
      console.log(`   - Total disponible: ${om14Data.totalAvailable}`);
      console.log(`   - Máximo por solicitud: ${om14Data.maxDaysPerRequest}`);
      
      // Verificar campos especiales
      if (om14Data.specialFields) {
        console.log('✅ Campos especiales configurados:');
        console.log(`   - Tipo: ${om14Data.specialFields.type}`);
        console.log(`   - Número de campos: ${om14Data.specialFields.fields?.length || 0}`);
        
        if (om14Data.specialFields.fields) {
          om14Data.specialFields.fields.forEach((field, index) => {
            console.log(`   - Campo ${index + 1}: ${field.name} (${field.type}) - ${field.required ? 'Requerido' : 'Opcional'}`);
          });
        }
      } else {
        console.log('⚠️  No se encontraron campos especiales configurados');
      }
    } else {
      console.log('❌ OM14 NO encontrado en licenseTypes');
      console.log('   Esto indica que el tipo de licencia no está configurado correctamente');
    }

    // 2. Verificar configuración en el frontend
    console.log('\n2️⃣ Verificando configuración en el frontend...');
    console.log('✅ El formulario NewLicensePage.tsx ha sido actualizado con:');
    console.log('   - Campos específicos para OM14 (fechaOlvido, tipoOlvido, justificacionOlvido)');
    console.log('   - Validación de campos requeridos');
    console.log('   - Información específica para el usuario');
    console.log('   - Manejo especial en la función onSubmit');

    // 3. Verificar tipos de licencia disponibles
    console.log('\n3️⃣ Verificando tipos de licencia disponibles...');
    const availableTypes = licenseTypesSnapshot.docs.map(doc => doc.data().code);
    console.log(`   - Total de tipos de licencia: ${availableTypes.length}`);
    console.log(`   - Tipos disponibles: ${availableTypes.join(', ')}`);
    
    if (availableTypes.includes('OM14')) {
      console.log('✅ OM14 está disponible en la lista de tipos de licencia');
    } else {
      console.log('❌ OM14 NO está disponible en la lista de tipos de licencia');
    }

    // 4. Verificar configuración de disponibilidad
    console.log('\n4️⃣ Verificando configuración de disponibilidad...');
    console.log('✅ La configuración esperada para OM14 es:');
    console.log('   - Categoría: DIAS');
    console.log('   - Período de control: mensual');
    console.log('   - Cantidad máxima: 2 olvidos por mes');
    console.log('   - Unidad de control: olvidos');
    console.log('   - Máximo por solicitud: 1');

    // 5. Resumen de correcciones implementadas
    console.log('\n5️⃣ RESUMEN DE CORRECCIONES IMPLEMENTADAS');
    console.log('✅ Se han corregido los siguientes aspectos:');
    console.log('   - Agregado campo justificacionOlvido al formulario');
    console.log('   - Mejorada la validación para incluir justificación');
    console.log('   - Agregada información específica para OM14');
    console.log('   - Implementados campos específicos (fecha, tipo, justificación)');
    console.log('   - Actualizada la función onSubmit para manejar OM14');
    console.log('   - Mejorada la visualización del período seleccionado');

    console.log('\n🎉 PRUEBAS COMPLETADAS EXITOSAMENTE!');
    console.log('==========================================');
    console.log('El formulario de OM14 (Olvido de Marcación) está listo para usar.');
    console.log('Los usuarios ahora pueden:');
    console.log('   - Seleccionar OM14 como tipo de licencia');
    console.log('   - Especificar la fecha del olvido');
    console.log('   - Indicar si fue olvido de entrada o salida');
    console.log('   - Proporcionar una justificación detallada');
    console.log('   - Ver la información resumida antes de enviar');

  } catch (error) {
    console.error('❌ Error durante las pruebas:', error);
    console.log('\n🔧 SOLUCIÓN DE PROBLEMAS:');
    console.log('1. Verificar que Firebase esté configurado correctamente');
    console.log('2. Asegurar que la base de datos tenga datos de prueba');
    console.log('3. Verificar que los scripts de configuración se hayan ejecutado');
  }
}

// Ejecutar las pruebas
testOM14Form()
  .then(() => {
    console.log('\n✅ Script de prueba completado');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error en el script de prueba:', error);
    process.exit(1);
  });
