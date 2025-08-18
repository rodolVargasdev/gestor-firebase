# 📋 DISPONIBILIDAD DE PERMISOS PARA EMPLEADOS

## 🔄 **PROCESO DE DISPONIBILIDAD AL IMPORTAR EMPLEADOS**

### **📋 Situación Actual:**

**✅ PROBLEMA RESUELTO:** 
Cuando se importan empleados por CSV, ahora **SÍ se inicializa automáticamente** la disponibilidad de permisos para cada empleado importado.

---

## 🚀 **PROCESO COMPLETO DE IMPORTACIÓN**

### **1. Importación desde CSV:**
```javascript
// Usuario sube archivo CSV con empleados
const importedEmployees = [
  {
    employeeId: 'EMP001',
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@empresa.com',
    gender: 'male',
    department: 'Tecnología',
    position: 'Desarrollador',
    employeeType: 'operativo',
    hireDate: '2024-01-15'
  },
  // ... más empleados
];
```

### **2. Creación de Empleados:**
```javascript
// Se crean los empleados en la base de datos
const result = await importEmployees(mappedEmployees);
// ✅ Ahora incluye: { success: 5, failed: 0, total: 5 }
```

### **3. Inicialización Automática de Disponibilidad:**
```javascript
// ✅ NUEVO: Se inicializa automáticamente la disponibilidad
if (result.success > 0) {
  // Obtener empleados recién creados
  const recentEmployees = allEmployees.slice(-result.success);
  
  // Inicializar disponibilidad para cada uno
  for (const employee of recentEmployees) {
    await initializeEmployeeAvailability(employee.id);
  }
}
```

---

## 🏗️ **ESTRUCTURA DE DISPONIBILIDAD CREADA**

### **Para cada empleado se crea:**
```javascript
disponibilidad: {
  año_actual: 2025,
  mes_actual: 8,
  ultima_renovacion_anual: "2025-01-01T00:00:00Z",
  ultima_renovacion_mensual: "2025-08-01T00:00:00Z",
  
  // LICENCIAS POR HORAS
  licencias_horas: {
    "PG01": {
      codigo: "PG01",
      nombre: "Permiso Personal con Goce de Salario",
      categoria: "HORAS",
      periodo_control: "anual",
      asignada_anual: 40,
      utilizada_anual: 0,
      disponible_anual: 40,
      unidad: "horas",
      solicitudes_activas: [],
      ultima_actualizacion: "2025-08-15T10:30:00Z"
    },
    "PS02": {
      // ... configuración similar
    }
  },
  
  // LICENCIAS POR DÍAS
  licencias_dias: {
    "GG05": {
      codigo: "GG05",
      nombre: "Licencia por Enfermedad Gravísima de Pariente",
      categoria: "DIAS",
      periodo_control: "anual",
      asignada_anual: 17,
      utilizada_anual: 0,
      disponible_anual: 17,
      unidad: "dias",
      solicitudes_activas: [],
      ultima_actualizacion: "2025-08-15T10:30:00Z"
    },
    "VG11": {
      // ... configuración similar
    }
  },
  
  // LICENCIAS POR OCASIÓN
  licencias_ocasion: {
    "OM14": {
      codigo: "OM14",
      nombre: "Licencia por Olvido de Marcación",
      categoria: "OCASION",
      periodo_control: "mensual",
      asignada_mensual: 2,
      utilizada_mes_actual: 0,
      disponible_mes_actual: 2,
      unidad: "olvidos",
      max_por_solicitud: 1,
      historial_uso: [],
      total_dias_año: 0,
      total_solicitudes_año: 0,
      solicitudes_activas: [],
      ultima_actualizacion: "2025-08-15T10:30:00Z"
    },
    "CT15": {
      // ... configuración similar
    },
    "LG08": {
      // ... configuración similar
    }
  }
}
```

---

## 🎯 **CÁLCULOS AUTOMÁTICOS**

### **1. Cantidades Asignadas:**
- **HORAS Anuales**: Se asigna la cantidad máxima del tipo de licencia
- **DÍAS Anuales**: Se asigna la cantidad máxima del tipo de licencia
- **DÍAS Mensuales**: Se asigna la cantidad máxima del tipo de licencia
- **OCASIÓN**: Se configura con límites específicos por tipo

### **2. Cálculos Proporcionales:**
```javascript
// Para empleados que ingresan a mitad de año
const cantidadAsignada = calcularCantidadProporcional(
  tipoLicencia.cantidad_maxima, 
  empleadoData.fecha_ingreso
);
```

### **3. Validaciones por Género:**
```javascript
// Solo se asignan licencias que aplican al género del empleado
if (tipoLicencia.aplica_genero === 'F' && empleado.gender !== 'female') {
  // No asignar licencia de maternidad a hombres
  return;
}
```

---

## 🔧 **HERRAMIENTAS DISPONIBLES**

### **1. Script de Inicialización:**
```bash
# Inicializar disponibilidad para empleados existentes
node scripts/initialize-employee-availability.cjs
```

### **2. Función Manual:**
```javascript
// Inicializar disponibilidad para un empleado específico
await initializeEmployeeAvailability(employeeId);
```

### **3. Verificación:**
```javascript
// Verificar si un empleado tiene disponibilidad
const employee = await getEmployeeById(employeeId);
if (!employee.disponibilidad) {
  // Empleado sin disponibilidad configurada
}
```

---

## 📊 **TIPOS DE LICENCIAS INCLUIDAS**

### **HORAS (Anuales):**
- **PG01**: Permiso Personal con Goce (40 horas/año)
- **PS02**: Permiso Personal sin Goce (480 horas/año)

### **DÍAS (Anuales):**
- **GG05**: Enfermedad Gravísima Pariente (17 días/año)
- **VG11**: Vacaciones Anuales (15 días/año)

### **DÍAS (Mensuales):**
- **MG07**: Maternidad (112 días por embarazo)

### **OCASIÓN:**
- **OM14**: Olvido de Marcación (2 por mes)
- **CT15**: Cambio de Turno (3 por mes)
- **LG08**: Lactancia Materna (1 período por nacimiento)
- **EG03**: Enfermedad con Goce (máx 3 días por solicitud)
- **ES04**: Enfermedad sin Goce (sin límite)
- **DG06**: Duelo (máx 3 días por solicitud)
- **AG09**: Paternidad/Adopción (máx 3 días por solicitud)
- **JRV12**: Juntas Receptoras (sin límite)
- **JU13**: Jurado (sin límite)
- **RH16**: Movimiento RH (sin límite)

---

## ✅ **BENEFICIOS DEL SISTEMA**

### **1. Automatización Completa:**
- ✅ No requiere configuración manual
- ✅ Se aplica a todos los empleados importados
- ✅ Incluye todas las licencias activas

### **2. Flexibilidad:**
- ✅ Respeta restricciones por género
- ✅ Calcula proporciones según fecha de ingreso
- ✅ Maneja diferentes períodos de control

### **3. Trazabilidad:**
- ✅ Registra fechas de renovación
- ✅ Mantiene historial de uso
- ✅ Actualiza timestamps automáticamente

### **4. Escalabilidad:**
- ✅ Funciona con cualquier cantidad de empleados
- ✅ Se adapta a nuevos tipos de licencias
- ✅ Permite actualizaciones futuras

---

## 🚀 **RESULTADO FINAL**

**¡Ahora todos los empleados importados por CSV tendrán automáticamente:**
- ✅ Disponibilidad completa de permisos
- ✅ Cantidades correctas según el lineamiento
- ✅ Configuración específica por tipo de licencia
- ✅ Validaciones apropiadas por género
- ✅ Estructura lista para uso inmediato

**El sistema está completamente automatizado y listo para producción!** 🎉
