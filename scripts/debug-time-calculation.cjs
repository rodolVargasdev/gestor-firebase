#!/usr/bin/env node

/**
 * Script para diagnosticar el problema del cálculo de tiempo
 * 
 * Este script simula el cálculo de tiempo que se hace en el formulario
 * para identificar por qué 1 hora se convierte en 10 horas
 */

console.log('🔍 DIAGNÓSTICO DEL CÁLCULO DE TIEMPO\n');

// Simular los valores que vienen del formulario
const testCases = [
  { horas: 1, minutos: 0 },
  { horas: 0, minutos: 30 },
  { horas: 2, minutos: 30 },
  { horas: 10, minutos: 0 },
  { horas: 0, minutos: 0 }
];

// Función que replica exactamente la lógica del formulario
function formatTimeTotal(horas, minutos) {
  console.log(`📊 Valores de entrada: horas=${horas} (tipo: ${typeof horas}), minutos=${minutos} (tipo: ${typeof minutos})`);
  
  // Convertir a números si son strings
  const horasNum = Number(horas) || 0;
  const minutosNum = Number(minutos) || 0;
  
  console.log(`🔄 Después de conversión: horas=${horasNum}, minutos=${minutosNum}`);
  
  const totalHoras = horasNum + (minutosNum / 60);
  console.log(`📈 Total en horas: ${totalHoras}`);
  
  const horasEnteras = Math.floor(totalHoras);
  const minutosRestantes = Math.round((totalHoras - horasEnteras) * 60);
  
  console.log(`🔢 Horas enteras: ${horasEnteras}, Minutos restantes: ${minutosRestantes}`);
  
  if (horasEnteras === 0 && minutosRestantes === 0) {
    return '0 minutos';
  }
  
  let resultado = '';
  if (horasEnteras > 0) {
    resultado += `${horasEnteras} hora${horasEnteras !== 1 ? 's' : ''}`;
  }
  if (minutosRestantes > 0) {
    if (resultado) resultado += ' y ';
    resultado += `${minutosRestantes} minuto${minutosRestantes !== 1 ? 's' : ''}`;
  }
  
  console.log(`✅ Resultado final: "${resultado}"\n`);
  return resultado;
}

// Probar cada caso
testCases.forEach((testCase, index) => {
  console.log(`🧪 CASO DE PRUEBA ${index + 1}:`);
  formatTimeTotal(testCase.horas, testCase.minutos);
});

// Probar con valores que podrían venir como strings del formulario
console.log('🧪 PRUEBAS CON VALORES COMO STRINGS:');
formatTimeTotal('1', '0');
formatTimeTotal('10', '0');
formatTimeTotal('1', '0');

console.log('🔍 DIAGNÓSTICO COMPLETADO');
