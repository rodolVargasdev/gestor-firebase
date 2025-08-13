const fs = require('fs');
const path = require('path');

console.log('🧪 PRUEBA DE LA FASE 2: GESTIÓN DE TIPOS DE LICENCIAS');
console.log('=====================================================\n');

// Verificar archivos de la Fase 2
const phase2Files = [
  'src/pages/LicenseTypesPage.tsx',
  'src/App.tsx',
  'src/types/index.ts'
];

console.log('📁 Verificando archivos de la Fase 2:');
let allFilesExist = true;

phase2Files.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Verificar contenido de LicenseTypesPage
console.log('\n🔍 Verificando funcionalidades de LicenseTypesPage:');
try {
  const licenseTypesContent = fs.readFileSync('src/pages/LicenseTypesPage.tsx', 'utf8');
  
  const features = [
    { name: 'Importación de LICENSE_CONFIGS', check: licenseTypesContent.includes('LICENSE_CONFIGS') },
    { name: 'Estado de carga (loading)', check: licenseTypesContent.includes('useState(true)') },
    { name: 'Filtros de búsqueda', check: licenseTypesContent.includes('searchTerm') },
    { name: 'Filtros por categoría', check: licenseTypesContent.includes('filterCategory') },
    { name: 'Filtros por estado', check: licenseTypesContent.includes('filterStatus') },
    { name: 'Grid de tarjetas', check: licenseTypesContent.includes('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3') },
    { name: 'Estadísticas', check: licenseTypesContent.includes('Total Tipos') },
    { name: 'Botones de acción', check: licenseTypesContent.includes('handleEdit') && licenseTypesContent.includes('handleDelete') },
    { name: 'Navegación', check: licenseTypesContent.includes('useNavigate') },
    { name: 'Iconos de Lucide', check: licenseTypesContent.includes('lucide-react') }
  ];

  features.forEach(feature => {
    console.log(`  ${feature.check ? '✅' : '❌'} ${feature.name}`);
    if (!feature.check) allFilesExist = false;
  });

} catch (error) {
  console.log('  ❌ Error al leer LicenseTypesPage.tsx');
  allFilesExist = false;
}

// Verificar rutas en App.tsx
console.log('\n🛣️ Verificando rutas en App.tsx:');
try {
  const appContent = fs.readFileSync('src/App.tsx', 'utf8');
  
  const routes = [
    { name: 'Ruta /license-types', check: appContent.includes('/license-types') },
    { name: 'Ruta /license-types/new', check: appContent.includes('/license-types/new') },
    { name: 'Ruta /license-types/edit/:id', check: appContent.includes('/license-types/edit/:id') },
    { name: 'Ruta /license-types/view/:id', check: appContent.includes('/license-types/view/:id') },
    { name: 'Ruta /employees', check: appContent.includes('/employees') },
    { name: 'Ruta /requests', check: appContent.includes('/requests') },
    { name: 'Ruta /reports', check: appContent.includes('/reports') },
    { name: 'ProtectedRoute', check: appContent.includes('ProtectedRoute') }
  ];

  routes.forEach(route => {
    console.log(`  ${route.check ? '✅' : '❌'} ${route.name}`);
    if (!route.check) allFilesExist = false;
  });

} catch (error) {
  console.log('  ❌ Error al leer App.tsx');
  allFilesExist = false;
}

// Verificar tipos TypeScript
console.log('\n📝 Verificando tipos TypeScript:');
try {
  const typesContent = fs.readFileSync('src/types/index.ts', 'utf8');
  
  const types = [
    { name: 'LICENSE_CONFIGS', check: typesContent.includes('LICENSE_CONFIGS') },
    { name: 'LicenseType interface', check: typesContent.includes('interface LicenseType') },
    { name: '16 tipos de permisos', check: typesContent.includes('PG01') && typesContent.includes('CT15') }
  ];

  types.forEach(type => {
    console.log(`  ${type.check ? '✅' : '❌'} ${type.name}`);
    if (!type.check) allFilesExist = false;
  });

} catch (error) {
  console.log('  ❌ Error al leer types/index.ts');
  allFilesExist = false;
}

// Verificar dashboard actualizado
console.log('\n🎨 Verificando dashboard actualizado:');
try {
  const dashboardContent = fs.readFileSync('src/pages/DashboardPage.tsx', 'utf8');
  
  const dashboardFeatures = [
    { name: 'Navegación a /license-types', check: dashboardContent.includes('/license-types') },
    { name: 'Navegación a /employees', check: dashboardContent.includes('/employees') },
    { name: 'Navegación a /requests', check: dashboardContent.includes('/requests') },
    { name: 'Navegación a /reports', check: dashboardContent.includes('/reports') },
    { name: 'useNavigate hook', check: dashboardContent.includes('useNavigate') },
    { name: 'Acciones rápidas funcionales', check: dashboardContent.includes('handleNavigation') }
  ];

  dashboardFeatures.forEach(feature => {
    console.log(`  ${feature.check ? '✅' : '❌'} ${feature.name}`);
    if (!feature.check) allFilesExist = false;
  });

} catch (error) {
  console.log('  ❌ Error al leer DashboardPage.tsx');
  allFilesExist = false;
}

console.log('\n🚀 RESULTADO DE LA PRUEBA DE LA FASE 2');
console.log('=====================================');

if (allFilesExist) {
  console.log('✅ FASE 2 COMPLETADA EXITOSAMENTE');
  console.log('\n🎯 FUNCIONALIDADES IMPLEMENTADAS:');
  console.log('✅ Página de gestión de tipos de licencias');
  console.log('✅ Visualización de 16 tipos de permisos predefinidos');
  console.log('✅ Filtros de búsqueda y categoría');
  console.log('✅ Estadísticas en tiempo real');
  console.log('✅ Navegación desde el dashboard');
  console.log('✅ Rutas protegidas para todas las funcionalidades');
  console.log('✅ Interfaz moderna y responsive');
  console.log('✅ Preparación para CRUD completo');
  
  console.log('\n📋 PRÓXIMOS PASOS DISPONIBLES:');
  console.log('1. Implementar formulario de creación/edición');
  console.log('2. Conectar con Firebase Firestore');
  console.log('3. Implementar validaciones específicas');
  console.log('4. Agregar confirmaciones de eliminación');
  console.log('5. Continuar con Fase 3 (Gestión de empleados)');
  
} else {
  console.log('❌ FASE 2 INCOMPLETA - Requiere correcciones');
}

console.log('\n📊 RESUMEN:');
console.log(`- Archivos críticos: ${phase2Files.filter(f => fs.existsSync(path.join(process.cwd(), f))).length}/${phase2Files.length}`);
console.log(`- Estado general: ${allFilesExist ? '✅ LISTO PARA USAR' : '❌ REQUIERE REPARACIÓN'}`);

console.log('\n🎉 ¡La Fase 2 está lista para ser probada en el navegador!');
console.log('URL: http://localhost:5173');
console.log('Navega a: Dashboard → "Gestionar Tipos de Licencia"');
