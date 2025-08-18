# 🔄 MANEJO DE PERMISOS ANUALES RETROACTIVOS

## 📋 **PROBLEMA RESUELTO**

### **❌ Comportamiento Anterior (INCORRECTO):**
Cuando se reportaba un permiso anual de un año anterior, el sistema afectaba incorrectamente la disponibilidad del año actual.

### **✅ Comportamiento Actual (CORRECTO):**
Los permisos anuales retroactivos ahora afectan correctamente el año correspondiente al permiso, no el año actual.

---

## 🎯 **ESCENARIO DE EJEMPLO**

### **Situación:**
- **Fecha actual:** Enero 2025
- **Permiso a reportar:** Diciembre 2024 (año anterior)
- **Pregunta:** ¿Afecta la disponibilidad actual?

### **Respuesta:**
- ✅ **NO afecta** la disponibilidad de 2025
- ✅ **SÍ afecta** el historial de 2024
- ✅ **Mantiene** la disponibilidad actual intacta

---

## 🔧 **FUNCIONAMIENTO TÉCNICO**

### **1. Detección de Permiso Anual Retroactivo:**
```javascript
// Cuando se reporta un permiso anual
if (licenseType.periodo_control === 'anual' && startDate) {
  const permisoYear = startDate.getFullYear();
  const currentYear = getCurrentDateInElSalvador().getFullYear();
  
  // ✅ Verificar si es retroactivo
  if (permisoYear < currentYear) {
    // Es un permiso anual retroactivo
  }
}
```

### **2. Actualización del Historial Anual:**
```javascript
// Para permisos anuales retroactivos
if (permisoYear < currentYear) {
  const yearKey = permisoYear.toString();
  
  // Inicializar historial anual si no existe
  if (!licencia.uso_anual) {
    licencia.uso_anual = {};
  }
  
  // Actualizar el año del permiso
  if (!licencia.uso_anual[yearKey]) {
    licencia.uso_anual[yearKey] = { 
      utilizada: 0, 
      disponible: licencia.asignada_anual || 40,
      asignada: licencia.asignada_anual || 40 
    };
  }
  
  licencia.uso_anual[yearKey].utilizada += quantity;
  licencia.uso_anual[yearKey].disponible -= quantity;
}
```

### **3. Preservación de Disponibilidad Actual:**
```javascript
// Para permisos del año actual
else {
  // Si es del año actual, afectar disponibilidad actual
  licencia.utilizada_anual += quantity;
  licencia.disponible_anual -= quantity;
}
```

---

## 📊 **ESTRUCTURA DE DATOS RESULTANTE**

### **Antes del Permiso Retroactivo:**
```javascript
"PG01": {
  asignada_anual: 40,    // 2025: 40 horas
  utilizada_anual: 0,    // 2025: 0 utilizadas
  disponible_anual: 40,  // 2025: 40 disponibles
  uso_anual: {
    "2024": { utilizada: 0, disponible: 40, asignada: 40 }  // 2024: 0 utilizadas
  }
}
```

### **Después del Permiso Retroactivo (Diciembre 2024):**
```javascript
"PG01": {
  asignada_anual: 40,    // ✅ 2025: NO se afecta
  utilizada_anual: 0,    // ✅ 2025: Mantiene 0
  disponible_anual: 40,  // ✅ 2025: Mantiene 40 disponibles
  uso_anual: {
    "2024": { utilizada: 8, disponible: 32, asignada: 40 }  // ✅ 2024: Se actualiza
  }
}
```

---

## 🎯 **PERMISOS QUE APLICAN**

### **✅ Permisos Anuales con Manejo Retroactivo:**

#### **HORAS (Anuales):**
- **PG01** - Permiso Personal con Goce de Salario
- **PS02** - Permiso Personal sin Goce de Salario

#### **DIAS (Anuales):**
- **GG05** - Licencia por Enfermedad Gravísima de Pariente
- **VG11** - Vacaciones Anuales

### **❌ Permisos que NO Aplican:**
- **OM14, CT15** - Permisos mensuales (ya tienen manejo mensual)
- **EG03, ES04, DG06, AG09, JRV12, JU13, RH16** - Permisos por evento

---

## 🎯 **CASOS DE USO**

### **1. Permiso del Año Actual:**
- **Fecha permiso:** 15 de enero 2025
- **Fecha reporte:** 15 de enero 2025
- **Resultado:** Afecta disponibilidad de 2025

### **2. Permiso Retroactivo:**
- **Fecha permiso:** 15 de diciembre 2024
- **Fecha reporte:** 15 de enero 2025
- **Resultado:** Afecta historial de 2024, NO afecta 2025

### **3. Permiso de Años Anteriores:**
- **Fecha permiso:** 15 de junio 2023
- **Fecha reporte:** 15 de enero 2025
- **Resultado:** Afecta historial de 2023, NO afecta 2025

---

## ✅ **BENEFICIOS DEL SISTEMA**

### **1. Precisión Histórica:**
- ✅ Mantiene registro exacto por año
- ✅ Permite auditoría completa
- ✅ Preserva integridad de datos

### **2. Flexibilidad Operativa:**
- ✅ Permite reportes tardíos
- ✅ No penaliza disponibilidad actual
- ✅ Facilita correcciones administrativas

### **3. Trazabilidad Completa:**
- ✅ Historial detallado por año
- ✅ Registro de fechas de reporte
- ✅ Información para análisis

---

## 🔍 **VERIFICACIÓN DEL SISTEMA**

### **Cómo Verificar que Funciona:**
1. **Reportar permiso anual retroactivo** (ej: diciembre 2024 en enero 2025)
2. **Verificar disponibilidad actual** (2025 debe mantener disponibilidad original)
3. **Revisar historial** (2024 debe mostrar cantidad utilizada)
4. **Confirmar que no afecta** el año actual

### **Indicadores de Éxito:**
- ✅ Disponibilidad actual no se reduce
- ✅ Historial del año anterior se actualiza
- ✅ Logs muestran "Permiso anual retroactivo registrado"
- ✅ Auditoría mantiene consistencia

---

## 🚀 **RESULTADO FINAL**

**El sistema ahora maneja correctamente:**
- ✅ **Permisos anuales retroactivos** sin afectar disponibilidad actual
- ✅ **Historial preciso** por año
- ✅ **Auditoría completa** de todos los permisos anuales
- ✅ **Flexibilidad total** para reportes tardíos

**¡Los permisos anuales retroactivos ya no afectan la disponibilidad actual!** 🎉

---

## 📋 **RESUMEN COMPLETO**

### **Permisos con Manejo Retroactivo:**

#### **Mensuales (OM14, CT15):**
- ✅ Historial por mes (`uso_mensual`)
- ✅ Afecta mes correspondiente al permiso

#### **Anuales (PG01, PS02, GG05, VG11):**
- ✅ Historial por año (`uso_anual`)
- ✅ Afecta año correspondiente al permiso

#### **Por Evento (EG03, ES04, DG06, etc.):**
- ✅ Solo historial de eventos
- ✅ No tienen manejo retroactivo

**¡El sistema ahora es completamente consistente y preciso!** 🎉
