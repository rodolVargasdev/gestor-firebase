# 🧪 PRUEBA: PG01 - Permiso Personal con Goce de Salario

## 📋 **INFORMACIÓN DEL PERMISO**
- **Código**: PG01
- **Nombre**: Permiso Personal con Goce de Salario
- **Categoría**: HORAS
- **Control**: Anual (40 horas por año)
- **Renovación**: 1 de enero de cada año

## 🎯 **OBJETIVO DE LA PRUEBA**
Verificar que el permiso PG01 funcione correctamente con control anual de horas.

## 📝 **PASOS DE PRUEBA**

### **1. PREPARACIÓN**
- [ ] Crear empleado de prueba con disponibilidad completa
- [ ] Verificar que tenga 40 horas disponibles en PG01
- [ ] Confirmar que el año actual sea 2025

### **2. PRUEBA DE FORMULARIO**
- [ ] Ir a "Nueva Licencia" para el empleado
- [ ] Seleccionar "PG01 - Permiso Personal con Goce de Salario"
- [ ] Verificar que aparezcan campos de hora (inicio y fin)
- [ ] Confirmar que no aparezcan campos de fecha (solo hora)
- [ ] Verificar que muestre "40 horas disponibles"

### **3. PRUEBA DE CÁLCULO DE HORAS**
- [ ] Ingresar hora inicio: 09:00
- [ ] Ingresar hora fin: 13:00
- [ ] Verificar que calcule automáticamente: 4 horas
- [ ] Confirmar que permita solicitar hasta 40 horas

### **4. PRUEBA DE VALIDACIÓN DE LÍMITES**
- [ ] Intentar solicitar 41 horas (debería mostrar error)
- [ ] Verificar mensaje: "Excede el límite anual de 40 horas"
- [ ] Confirmar que permita solicitar exactamente 40 horas

### **5. PRUEBA DE DISPONIBILIDAD**
- [ ] Solicitar 8 horas (09:00 - 17:00)
- [ ] Verificar que la disponibilidad se reduzca a 32 horas
- [ ] Confirmar que se actualice en tiempo real

### **6. PRUEBA DE MÚLTIPLES SOLICITUDES**
- [ ] Solicitar 16 horas más (total: 24 horas)
- [ ] Verificar disponibilidad restante: 16 horas
- [ ] Intentar solicitar 20 horas (debería mostrar error)
- [ ] Confirmar que permita solicitar 16 horas exactas

### **7. PRUEBA DE RENOVACIÓN ANUAL**
- [ ] Simular cambio de año (2026)
- [ ] Verificar que la disponibilidad se resetee a 40 horas
- [ ] Confirmar que las solicitudes anteriores se mantengan en historial

## ✅ **RESULTADOS ESPERADOS**

### **Formulario**
- ✅ Campos de hora (inicio y fin) visibles
- ✅ Campo de fecha NO visible
- ✅ Cálculo automático de horas
- ✅ Validación de límite anual

### **Cálculos**
- ✅ 09:00 - 13:00 = 4 horas
- ✅ 08:00 - 18:00 = 10 horas
- ✅ 00:00 - 23:59 = 24 horas (máximo por día)

### **Disponibilidad**
- ✅ Inicial: 40 horas
- ✅ Después de 8h: 32 horas
- ✅ Después de 24h: 16 horas
- ✅ Después de 40h: 0 horas

### **Validaciones**
- ✅ Máximo 40 horas por año
- ✅ No permite exceder límite anual
- ✅ Mensajes de error claros

## 🚨 **CASOS ESPECIALES**

### **Horas Fraccionadas**
- [ ] Probar 1.5 horas (09:00 - 10:30)
- [ ] Probar 0.5 horas (09:00 - 09:30)
- [ ] Verificar que acepte decimales

### **Horarios Nocturnos**
- [ ] Probar 22:00 - 06:00 (8 horas)
- [ ] Verificar cálculo correcto

### **Múltiples Días**
- [ ] Probar solicitud de 48 horas (debería rechazar)
- [ ] Verificar que solo permita horas del mismo día

## 📊 **DATOS DE PRUEBA**

### **Empleado de Prueba**
```json
{
  "nombre": "Juan Pérez",
  "genero": "M",
  "disponibilidad": {
    "licencias_horas": {
      "PG01": {
        "disponible_anual": 40,
        "utilizada_anual": 0
      }
    }
  }
}
```

### **Solicitudes de Prueba**
1. **Solicitud 1**: 09:00 - 13:00 (4 horas)
2. **Solicitud 2**: 08:00 - 18:00 (10 horas)
3. **Solicitud 3**: 14:00 - 22:00 (8 horas)
4. **Solicitud 4**: 10:00 - 18:00 (8 horas)

## 🔍 **VERIFICACIONES FINALES**

- [ ] Todas las solicitudes se guardan correctamente
- [ ] La disponibilidad se actualiza en tiempo real
- [ ] El historial muestra todas las solicitudes
- [ ] Las validaciones funcionan correctamente
- [ ] El formulario es intuitivo y fácil de usar

## 📝 **NOTAS ADICIONALES**

- Este permiso es fundamental para permisos cortos
- Debe ser muy fácil de usar para solicitudes rápidas
- La validación de límites es crítica
- El cálculo de horas debe ser preciso

---
**Fecha de prueba**: 24/08/2025
**Estado**: Pendiente
**Resultado**: Por definir
