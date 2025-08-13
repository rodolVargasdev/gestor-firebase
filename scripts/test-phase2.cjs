#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 PROBANDO FASE 2 - TIPOS DE LICENCIAS');
console.log('=====================================\n');

// Verificar que estamos en el directorio correcto
const currentDir = process.cwd();
const packageJsonPath = path.join(currentDir, 'package.json');

if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Error: No se encontró package.json en el directorio actual');
  console.error('   Asegúrate de estar en el directorio del proyecto');
  process.exit(1);
}

console.log('✅ Directorio del proyecto verificado');

// Verificar archivos de la Fase 2
const requiredFiles = [
  'src/types/index.ts',
  'src/services/licenseService.ts',
  'src/stores/licenseStore.ts',
  'src/components/licenses/LicenseTypeList.tsx',
  'src/components/licenses/LicenseTypeForm.tsx',
  'src/pages/LicenseTypesPage.tsx',
  'src/scripts/initLicenseTypes.ts',
];

console.log('\n📁 Verificando archivos de la Fase 2...');

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(currentDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - NO ENCONTRADO`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.error('\n❌ Algunos archivos requeridos no existen');
  process.exit(1);
}

// Verificar dependencias
console.log('\n📦 Verificando dependencias...');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const requiredDeps = [
  '@tanstack/react-query',
  'recharts',
  'react-hook-form',
  '@hookform/resolvers',
  'date-fns'
];

let allDepsInstalled = true;
requiredDeps.forEach(dep => {
  if (packageJson.dependencies && packageJson.dependencies[dep]) {
    console.log(`✅ ${dep} - ${packageJson.dependencies[dep]}`);
  } else if (packageJson.devDependencies && packageJson.devDependencies[dep]) {
    console.log(`✅ ${dep} - ${packageJson.devDependencies[dep]} (dev)`);
  } else {
    console.log(`❌ ${dep} - NO INSTALADO`);
    allDepsInstalled = false;
  }
});

if (!allDepsInstalled) {
  console.error('\n❌ Algunas dependencias no están instaladas');
  console.error('   Ejecuta: npm install');
  process.exit(1);
}

// Verificar configuración de Firebase
console.log('\n🔥 Verificando configuración de Firebase...');
const firebaseConfigPath = path.join(currentDir, 'src/lib/firebase.ts');
if (fs.existsSync(firebaseConfigPath)) {
  const firebaseConfig = fs.readFileSync(firebaseConfigPath, 'utf8');
  if (firebaseConfig.includes('apiKey') && firebaseConfig.includes('projectId')) {
    console.log('✅ Configuración de Firebase encontrada');
  } else {
    console.log('⚠️  Configuración de Firebase incompleta');
  }
} else {
  console.log('❌ Archivo de configuración de Firebase no encontrado');
}

// Verificar que el servidor esté ejecutándose
console.log('\n🚀 Verificando servidor de desarrollo...');
console.log('   Si el servidor no está ejecutándose, inícialo con: npm run dev');

console.log('\n🎯 INSTRUCCIONES PARA PROBAR LA FASE 2:');
console.log('=====================================');
console.log('');
console.log('1. 📱 Abre tu navegador y ve a: http://localhost:5173');
console.log('');
console.log('2. 🔧 Usa las DevTools (panel amarillo en la esquina inferior derecha):');
console.log('   - Haz clic en "🚀 Inicializar Todo" para crear datos de prueba');
console.log('   - Esto creará usuarios y tipos de licencias de prueba');
console.log('');
console.log('3. 👤 Inicia sesión con:');
console.log('   - Email: admin@test.com');
console.log('   - Contraseña: 123456');
console.log('');
console.log('4. 📋 Navega a "Tipos de Licencias":');
console.log('   - Haz clic en "Acceder" en la tarjeta de "Tipos de Licencias"');
console.log('   - O ve directamente a: http://localhost:5173/license-types');
console.log('');
console.log('5. ✅ Funcionalidades a probar:');
console.log('   - Ver lista de tipos de licencias');
console.log('   - Crear nuevo tipo de licencia');
console.log('   - Editar tipo de licencia existente');
console.log('   - Eliminar tipo de licencia');
console.log('   - Ver detalles de cada licencia');
console.log('   - Filtrar por categoría y estado');
console.log('');
console.log('6. 🔍 Verifica que se muestren:');
console.log('   - 8 tipos de licencias de prueba');
console.log('   - Diferentes categorías (software, hardware, service, subscription)');
console.log('   - Configuraciones de períodos (mensual, anual, trimestral)');
console.log('   - Precios y monedas');
console.log('   - Estados activo/inactivo');
console.log('');
console.log('7. 🐛 Si hay errores:');
console.log('   - Revisa la consola del navegador (F12)');
console.log('   - Verifica que Firebase esté configurado correctamente');
console.log('   - Asegúrate de que Firestore esté habilitado');
console.log('');

console.log('🎉 ¡La Fase 2 está lista para probar!');
console.log('');
console.log('📊 Próximos pasos:');
console.log('   - Fase 3: Gestión de Empleados');
console.log('   - Fase 4: Solicitudes de Licencias');
console.log('   - Fase 5: Dashboard y Reportes');
console.log('');
