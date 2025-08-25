# 🧪 PRUEBA: EG03 - Licencia por Enfermedad con Goce de Salario

## 📋 **INFORMACIÓN DEL PERMISO**
- **Código**: EG03
- **Nombre**: Licencia por Enfermedad con Goce de Salario
- **Categoría**: OCASIÓN
- **Control**: Ninguno (sin límite anual)
- **Límite**: Máximo 3 días por solicitud
- **Cálculo**: Días por calendario

## 🎯 **OBJETIVO DE LA PRUEBA**
Verificar que el permiso EG03 funcione correctamente con validación de límite por solicitud y cálculo por calendario.

## 📝 **PASOS DE PRUEBA**

### **1. PREPARACIÓN**
- [ ] Crear empleado de prueba
- [ ] Verificar que no tenga límite anual
- [ ] Confirmar que permita múltiples solicitudes

### **2. PRUEBA DE FORMULARIO**
- [ ] Ir a "Nueva Licencia" para el empleado
- [ ] Seleccionar "EG03 - Licencia por Enfermedad con Goce de Salario"
- [ ] Verificar que aparezcan campos de fecha (inicio y fin)
- [ ] Confirmar que muestre "Sin límite anual - Máximo 3 días por solicitud"

### **3. PRUEBA DE CÁLCULO POR CALENDARIO**
- [ ] Ingresar fecha inicio: 19/08/2025
- [ ] Ingresar fecha fin: 21/08/2025
- [ ] Verificar que calcule automáticamente: 3 días
- [ ] Confirmar que incluya ambos días (inicio y fin)

### **4. PRUEBA DE VALIDACIÓN DE LÍMITES**
- [ ] Intentar solicitar 4 días (19/08/2025 - 22/08/2025)
- [ ] Verificar que muestre error: "Máximo 3 días por solicitud"
- [ ] Confirmar que permita solicitar exactamente 3 días
- [ ] Verificar que permita solicitar 1, 2 o 3 días

### **5. PRUEBA DE MÚLTIPLES SOLICITUDES**
- [ ] Solicitar 3 días: 19/08/2025 - 21/08/2025
- [ ] Verificar que se guarde correctamente
- [ ] Solicitar 2 días: 25/08/2025 - 26/08/2025
- [ ] Verificar que se permita segunda solicitud
- [ ] Solicitar 1 día: 30/08/2025 - 30/08/2025
- [ ] Confirmar que se permita tercera solicitud

### **6. PRUEBA DE HISTORIAL**
- [ ] Verificar que todas las solicitudes aparezcan en historial
- [ ] Confirmar que muestre total de días por año
- [ ] Verificar que muestre total de solicitudes por año
- [ ] Confirmar que no haya límite en número de solicitudes

### **7. PRUEBA DE CÁLCULOS ESPECIALES**
- [ ] Probar 1 día: 15/08/2025 - 15/08/2025 = 1 día
- [ ] Probar 2 días: 15/08/2025 - 16/08/2025 = 2 días
- [ ] Probar 3 días: 15/08/2025 - 17/08/2025 = 3 días
- [ ] Probar límite: 15/08/2025 - 18/08/2025 = 4 días (debería rechazar)

## ✅ **RESULTADOS ESPERADOS**

### **Formulario**
- ✅ Campos de fecha (inicio y fin) visibles
- ✅ Cálculo automático de días
- ✅ Validación de límite por solicitud
- ✅ Sin límite anual

### **Cálculos**
- ✅ 19/08/2025 - 21/08/2025 = 3 días
- ✅ 15/08/2025 - 15/08/2025 = 1 día
- ✅ 15/08/2025 - 16/08/2025 = 2 días
- ✅ 15/08/2025 - 17/08/2025 = 3 días

### **Validaciones**
- ✅ Máximo 3 días por solicitud
- ✅ No permite 4 días o más
- ✅ Permite múltiples solicitudes
- ✅ Sin límite anual total

### **Historial**
- ✅ Registra todas las solicitudes
- ✅ Muestra total de días por año
- ✅ Muestra total de solicitudes por año
- ✅ No tiene límite de registros

## 🚨 **CASOS ESPECIALES**

### **Días Consecutivos**
- [ ] Probar solicitudes consecutivas
- [ ] Verificar que no haya restricción de tiempo entre solicitudes

### **Múltiples Solicitudes en el Mismo Mes**
- [ ] Solicitar 3 días en agosto
- [ ] Solicitar 2 días en agosto
- [ ] Solicitar 1 día en agosto
- [ ] Verificar que todas se permitan

### **Solicitudes en Diferentes Meses**
- [ ] Solicitar en agosto
- [ ] Solicitar en septiembre
- [ ] Solicitar en octubre
- [ ] Verificar que no haya restricción

## 📊 **DATOS DE PRUEBA**

### **Empleado de Prueba**
```json
{
  "nombre": "Carlos Rodríguez",
  "genero": "M",
  "disponibilidad": {
    "licencias_ocasion": {
      "EG03": {
        "historial_uso": [],
        "total_dias_año": 0,
        "total_solicitudes_año": 0
      }
    }
  }
}
```

### **Solicitudes de Prueba**
1. **Solicitud 1**: 19/08/2025 - 21/08/2025 (3 días)
2. **Solicitud 2**: 25/08/2025 - 26/08/2025 (2 días)
3. **Solicitud 3**: 30/08/2025 - 30/08/2025 (1 día)
4. **Solicitud 4**: 05/09/2025 - 07/09/2025 (3 días)
5. **Solicitud 5**: 15/09/2025 - 15/09/2025 (1 día)

## 🔍 **VERIFICACIONES FINALES**

- [ ] Validación de límite funciona correctamente
- [ ] Cálculo por calendario es preciso
- [ ] Múltiples solicitudes se permiten
- [ ] Historial se mantiene correctamente
- [ ] No hay límite anual
- [ ] Formulario es claro y fácil de usar

## 📝 **NOTAS ADICIONALES**

- Este permiso es común para enfermedades cortas
- La validación de 3 días por solicitud es crítica
- Debe permitir múltiples solicitudes sin restricción
- El cálculo por calendario es importante
- El historial debe ser completo y detallado

## 🚨 **CASOS CRÍTICOS**

### **Validación de Límites**
- [ ] No permitir más de 3 días por solicitud
- [ ] Permitir exactamente 3 días
- [ ] Permitir menos de 3 días
- [ ] Mensajes de error claros

### **Cálculo de Días**
- [ ] Incluir día de inicio
- [ ] Incluir día de fin
- [ ] Contar días por calendario
- [ ] No contar días hábiles

### **Múltiples Solicitudes**
- [ ] No restringir número de solicitudes
- [ ] No restringir tiempo entre solicitudes
- [ ] Mantener historial completo
- [ ] Calcular totales correctamente

---
**Fecha de prueba**: 24/08/2025
**Estado**: Pendiente
**Resultado**: Por definir
