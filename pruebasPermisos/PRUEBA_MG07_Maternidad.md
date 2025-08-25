# 🧪 PRUEBA: MG07 - Licencia por Maternidad

## 📋 **INFORMACIÓN DEL PERMISO**
- **Código**: MG07
- **Nombre**: Licencia por Maternidad
- **Categoría**: DIAS
- **Control**: Por evento (112 días por embarazo)
- **Filtro**: Solo género femenino
- **Cálculo**: Automático de fecha fin

## 🎯 **OBJETIVO DE LA PRUEBA**
Verificar que el permiso MG07 funcione correctamente con cálculo automático de fechas y filtro por género.

## 📝 **PASOS DE PRUEBA**

### **1. PREPARACIÓN**
- [ ] Crear empleada femenina con disponibilidad completa
- [ ] Crear empleado masculino para verificar filtro
- [ ] Verificar que tenga 112 días disponibles en MG07
- [ ] Confirmar que no tenga embarazos activos

### **2. PRUEBA DE FILTRO POR GÉNERO**
- [ ] Ir a "Nueva Licencia" para empleado masculino
- [ ] Verificar que NO aparezca "MG07 - Licencia por Maternidad"
- [ ] Ir a "Nueva Licencia" para empleada femenina
- [ ] Verificar que SÍ aparezca "MG07 - Licencia por Maternidad"

### **3. PRUEBA DE FORMULARIO**
- [ ] Seleccionar "MG07 - Licencia por Maternidad"
- [ ] Verificar que aparezca campo de fecha inicio
- [ ] Confirmar que NO aparezca campo de fecha fin (se calcula automáticamente)
- [ ] Verificar que muestre "112 días disponibles"

### **4. PRUEBA DE CÁLCULO AUTOMÁTICO**
- [ ] Ingresar fecha inicio: 01/02/2025
- [ ] Verificar que calcule automáticamente fecha fin: 25/05/2025
- [ ] Confirmar que calcule 112 días por calendario
- [ ] Verificar que no permita modificar la fecha fin

### **5. PRUEBA DE CÁLCULO DETALLADO**
- [ ] Fecha inicio: 01/02/2025
- [ ] Días en febrero: 28 - 1 = 27 días
- [ ] Días en marzo: 31 días
- [ ] Días en abril: 30 días
- [ ] Días en mayo: 24 días
- [ ] Total: 27 + 31 + 30 + 24 = 112 días
- [ ] Fecha fin esperada: 25/05/2025

### **6. PRUEBA DE SOLAPAMIENTO**
- [ ] Crear solicitud de maternidad: 01/02/2025 - 25/05/2025
- [ ] Intentar crear segunda solicitud: 15/03/2025 - 05/07/2025
- [ ] Verificar que muestre error: "No se permiten fechas solapadas"
- [ ] Confirmar que no permita crear solicitudes superpuestas

### **7. PRUEBA DE DISPONIBILIDAD**
- [ ] Solicitar maternidad completa (112 días)
- [ ] Verificar que la disponibilidad se reduzca a 0 días
- [ ] Confirmar que se marque como "embarazo_activo: true"
- [ ] Verificar que se actualice "fecha_ultimo_embarazo"

### **8. PRUEBA DE NUEVO EMBARAZO**
- [ ] Completar embarazo anterior
- [ ] Verificar que se resetee disponibilidad a 112 días
- [ ] Confirmar que permita solicitar nuevo embarazo
- [ ] Verificar que se actualice historial de embarazos

## ✅ **RESULTADOS ESPERADOS**

### **Formulario**
- ✅ Solo visible para empleadas femeninas
- ✅ Campo fecha inicio visible
- ✅ Campo fecha fin NO visible (automático)
- ✅ Cálculo automático de 112 días

### **Cálculos**
- ✅ 01/02/2025 → 25/05/2025 = 112 días
- ✅ 15/03/2025 → 03/07/2025 = 112 días
- ✅ 01/12/2025 → 22/03/2026 = 112 días

### **Disponibilidad**
- ✅ Inicial: 112 días
- ✅ Después de solicitud: 0 días
- ✅ Después de completar: 112 días (nuevo embarazo)

### **Validaciones**
- ✅ Solo género femenino
- ✅ No permite solapamiento
- ✅ Cálculo automático obligatorio
- ✅ 112 días exactos por embarazo

## 🚨 **CASOS ESPECIALES**

### **Año Bisiesto**
- [ ] Probar con fecha inicio en año bisiesto
- [ ] Verificar cálculo correcto con 29 de febrero

### **Cambio de Año**
- [ ] Probar fecha inicio: 01/12/2025
- [ ] Verificar que calcule correctamente en 2026

### **Múltiples Embarazos**
- [ ] Completar primer embarazo
- [ ] Solicitar segundo embarazo
- [ ] Verificar que se resetee disponibilidad
- [ ] Confirmar historial de embarazos

## 📊 **DATOS DE PRUEBA**

### **Empleada de Prueba**
```json
{
  "nombre": "María González",
  "genero": "F",
  "disponibilidad": {
    "licencias_dias": {
      "MG07": {
        "disponible_embarazo_actual": 112,
        "embarazo_activo": false,
        "fecha_ultimo_embarazo": null
      }
    }
  }
}
```

### **Solicitudes de Prueba**
1. **Embarazo 1**: 01/02/2025 - 25/05/2025 (112 días)
2. **Embarazo 2**: 15/06/2025 - 05/10/2025 (112 días)
3. **Embarazo 3**: 01/12/2025 - 22/03/2026 (112 días)

## 🔍 **VERIFICACIONES FINALES**

- [ ] Filtro por género funciona correctamente
- [ ] Cálculo automático es preciso
- [ ] No permite solapamiento de fechas
- [ ] Disponibilidad se actualiza correctamente
- [ ] Historial de embarazos se mantiene
- [ ] Formulario es intuitivo y claro

## 📝 **NOTAS ADICIONALES**

- Este permiso es crítico para empleadas embarazadas
- El cálculo automático debe ser 100% preciso
- No debe permitir errores de fechas
- El filtro por género es obligatorio
- Debe mantener historial completo de embarazos

## 🚨 **CASOS CRÍTICOS**

### **Validación de Fechas**
- [ ] No permitir fechas pasadas
- [ ] No permitir fechas muy futuras (más de 9 meses)
- [ ] Validar que sea fecha válida

### **Cálculo de Días**
- [ ] Incluir día de inicio
- [ ] Incluir día de fin
- [ ] Contar días por calendario (no hábiles)

---
**Fecha de prueba**: 24/08/2025
**Estado**: Pendiente
**Resultado**: Por definir
