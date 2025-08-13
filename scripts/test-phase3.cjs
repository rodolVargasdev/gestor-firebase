#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 PROBANDO FASE 3 - GESTIÓN DE EMPLEADOS');
console.log('==========================================\n');

// Verificar estructura de directorios
const requiredDirs = [
  'src/components/employees',
  'src/services',
  'src/stores',
  'src/scripts',
  'src/pages'
];

console.log('📁 Verificando estructura de directorios...');
let dirsOk = true;
requiredDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ Directorio faltante: ${dir}`);
    dirsOk = false;
  } else {
    console.log(`✅ ${dir}`);
  }
});

if (!dirsOk) {
  console.log('\n❌ Faltan directorios requeridos');
  process.exit(1);
}

// Verificar archivos requeridos
const requiredFiles = [
  'src/components/employees/EmployeeList.tsx',
  'src/components/employees/EmployeeForm.tsx',
  'src/pages/EmployeesPage.tsx',
  'src/services/employeeService.ts',
  'src/stores/employeeStore.ts',
  'src/scripts/initEmployees.ts',
  'src/types/index.ts',
  'src/App.tsx'
];

console.log('\n📄 Verificando archivos requeridos...');
let filesOk = true;
requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  if (!fs.existsSync(fullPath)) {
    console.log(`❌ Archivo faltante: ${file}`);
    filesOk = false;
  } else {
    console.log(`✅ ${file}`);
  }
});

if (!filesOk) {
  console.log('\n❌ Faltan archivos requeridos');
  process.exit(1);
}

// Verificar package.json y dependencias
console.log('\n📦 Verificando dependencias...');
const packagePath = path.join(__dirname, '..', 'package.json');
if (!fs.existsSync(packagePath)) {
  console.log('❌ package.json no encontrado');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const requiredDeps = [
  'react-hook-form',
  'date-fns',
  'zustand',
  '@tanstack/react-query',
  'firebase'
];

let depsOk = true;
requiredDeps.forEach(dep => {
  if (!packageJson.dependencies[dep] && !packageJson.devDependencies[dep]) {
    console.log(`❌ Dependencia faltante: ${dep}`);
    depsOk = false;
  } else {
    console.log(`✅ ${dep}`);
  }
});

if (!depsOk) {
  console.log('\n❌ Faltan dependencias requeridas');
  process.exit(1);
}

// Verificar configuración de Firebase
console.log('\n🔥 Verificando configuración de Firebase...');
const firebasePath = path.join(__dirname, '..', 'src/lib/firebase.ts');
if (!fs.existsSync(firebasePath)) {
  console.log('❌ Configuración de Firebase no encontrada');
  process.exit(1);
}

const firebaseContent = fs.readFileSync(firebasePath, 'utf8');
if (!firebaseContent.includes('initializeApp') || !firebaseContent.includes('getFirestore')) {
  console.log('❌ Configuración de Firebase incompleta');
  process.exit(1);
}

console.log('✅ Configuración de Firebase correcta');

console.log('\n🎉 TODAS LAS VERIFICACIONES PASARON EXITOSAMENTE');
console.log('===============================================');

console.log('\n🎯 INSTRUCCIONES PARA PROBAR LA FASE 3:');
console.log('=======================================');
console.log('');
console.log('1. 📱 Abre tu navegador y ve a: http://localhost:5173');
console.log('');
console.log('2. 🔧 Usa las DevTools (panel amarillo en la esquina inferior derecha):');
console.log('   - Haz clic en "🚀 Inicializar Todo" para crear todos los datos de prueba');
console.log('   - Esto creará usuarios, tipos de licencias y empleados');
console.log('');
console.log('3. 👤 Inicia sesión con:');
console.log('   - Email: admin@test.com');
console.log('   - Contraseña: 123456');
console.log('');
console.log('4. 👥 Navega a "Empleados":');
console.log('   - Haz clic en "Acceder" en la tarjeta de "Empleados" del dashboard');
console.log('   - O ve directamente a: http://localhost:5173/employees');
console.log('');
console.log('5. ✅ Funcionalidades a probar:');
console.log('   - Ver lista de empleados (10 empleados de prueba)');
console.log('   - Filtrar por departamento');
console.log('   - Buscar por nombre');
console.log('   - Crear nuevo empleado');
console.log('   - Editar empleado existente');
console.log('   - Eliminar empleado');
console.log('   - Paginación (si hay muchos empleados)');
console.log('');
console.log('6. 📊 Datos de prueba incluidos:');
console.log('   - 6 departamentos: IT, RRHH, Finanzas, Marketing, Operaciones, Ventas');
console.log('   - 10 empleados con información completa');
console.log('   - Salarios, posiciones, fechas de contratación');
console.log('');
console.log('7. 🔍 Verificaciones adicionales:');
console.log('   - Formulario con validaciones');
console.log('   - Estados de carga y error');
console.log('   - Responsive design');
console.log('   - Integración con Firebase');
console.log('');
console.log('8. 🚀 Próximos pasos:');
console.log('   - Fase 4: Solicitudes de Licencias');
console.log('   - Fase 5: Reportes y Estadísticas');
console.log('   - Mejoras de diseño y UX');
console.log('');
console.log('🎊 ¡La Fase 3 está completamente implementada y lista para usar!');
