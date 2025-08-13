const fs = require('fs');
const path = require('path');

console.log('🔍 VERIFICACIÓN DEL SISTEMA GESTOR DE LICENCIAS');
console.log('================================================\n');

// Verificar archivos críticos
const criticalFiles = [
  'src/App.tsx',
  'src/pages/LoginPage.tsx',
  'src/pages/DashboardPage.tsx',
  'src/components/auth/LoginForm.tsx',
  'src/components/auth/ProtectedRoute.tsx',
  'src/services/authService.ts',
  'src/stores/authStore.ts',
  'src/lib/firebase.ts',
  'src/lib/utils.ts',
  'src/types/index.ts',
  'src/components/ui/button.tsx',
  'src/components/ui/input.tsx',
  'tailwind.config.js',
  'postcss.config.js',
  'src/index.css',
  'package.json',
  'vite.config.ts'
];

console.log('📁 Verificando archivos críticos:');
let allFilesExist = true;

criticalFiles.forEach(file => {
  const exists = fs.existsSync(path.join(process.cwd(), file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('\n📦 Verificando package.json:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`  ✅ Nombre: ${packageJson.name}`);
  console.log(`  ✅ Versión: ${packageJson.version}`);
  console.log(`  ✅ Scripts disponibles:`);
  Object.keys(packageJson.scripts).forEach(script => {
    console.log(`    - ${script}: ${packageJson.scripts[script]}`);
  });
} catch (error) {
  console.log('  ❌ Error al leer package.json');
  allFilesExist = false;
}

console.log('\n🔧 Verificando configuración de Vite:');
try {
  const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
  if (viteConfig.includes('react') && viteConfig.includes('@vitejs/plugin-react')) {
    console.log('  ✅ Plugin React configurado');
  } else {
    console.log('  ❌ Plugin React no encontrado');
    allFilesExist = false;
  }
} catch (error) {
  console.log('  ❌ Error al leer vite.config.ts');
  allFilesExist = false;
}

console.log('\n🎨 Verificando configuración de Tailwind:');
try {
  const tailwindConfig = fs.readFileSync('tailwind.config.js', 'utf8');
  if (tailwindConfig.includes('content') && tailwindConfig.includes('src/**/*')) {
    console.log('  ✅ Tailwind configurado correctamente');
  } else {
    console.log('  ❌ Configuración de Tailwind incompleta');
    allFilesExist = false;
  }
} catch (error) {
  console.log('  ❌ Error al leer tailwind.config.js');
  allFilesExist = false;
}

console.log('\n📋 Verificando tipos TypeScript:');
try {
  const typesFile = fs.readFileSync('src/types/index.ts', 'utf8');
  const requiredTypes = ['User', 'Employee', 'LicenseType', 'LicenseRequest', 'LICENSE_CONFIGS'];
  requiredTypes.forEach(type => {
    if (typesFile.includes(type)) {
      console.log(`  ✅ ${type} definido`);
    } else {
      console.log(`  ❌ ${type} no encontrado`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('  ❌ Error al leer tipos TypeScript');
  allFilesExist = false;
}

console.log('\n🚀 ESTADO DEL SISTEMA:');
if (allFilesExist) {
  console.log('✅ SISTEMA LISTO PARA USAR');
  console.log('\n📝 PRÓXIMOS PASOS:');
  console.log('1. Abre http://localhost:5173 en tu navegador');
  console.log('2. Verás la página de login con el nuevo diseño');
  console.log('3. Puedes hacer login con:');
  console.log('   - Email: admin@test.com');
  console.log('   - Password: 123456');
  console.log('4. O usar el botón "Continuar con Google"');
  console.log('5. Después del login serás redirigido al dashboard');
} else {
  console.log('❌ SISTEMA INCOMPLETO - Faltan archivos críticos');
  console.log('\n🔧 ACCIONES REQUERIDAS:');
  console.log('1. Verifica que todos los archivos críticos existan');
  console.log('2. Ejecuta "npm install" para instalar dependencias');
  console.log('3. Ejecuta "npm run dev" para iniciar el servidor');
}

console.log('\n📊 RESUMEN:');
console.log(`- Archivos críticos: ${criticalFiles.filter(f => fs.existsSync(path.join(process.cwd(), f))).length}/${criticalFiles.length}`);
console.log(`- Estado general: ${allFilesExist ? '✅ LISTO' : '❌ INCOMPLETO'}`);
