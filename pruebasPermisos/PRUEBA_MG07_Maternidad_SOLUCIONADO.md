# 🧪 PRUEBA: MG07 - Licencia por Maternidad (SOLUCIONADO)

## 📋 **INFORMACIÓN DEL PERMISO**
- **Código**: MG07
- **Nombre**: Licencia por Maternidad
- **Categoría**: DIAS
- **Control**: Por evento (112 días por embarazo)
- **Filtro**: Solo género femenino
- **Cálculo**: Automático de fecha fin y cantidad

## 🔧 **PROBLEMA IDENTIFICADO Y SOLUCIONADO**

### **❌ PROBLEMA ORIGINAL**
- El formulario no calculaba automáticamente la fecha fin ni la cantidad
- Console.log mostraba: `calculo_automatico: undefined`
- La propiedad `calculo_automatico_fecha_fin` no llegaba al componente

### **🔍 DIAGNÓSTICO**
1. **Verificación de configuración**: MG07 tenía `calculo_automatico_fecha_fin: true` en `licenseTypes.ts`
2. **Verificación de mapeo**: La función `mapDocumentToLicenseType` no mapeaba las nuevas propiedades
3. **Verificación de datos**: Los tipos de licencia en Firebase no tenían las nuevas propiedades

### **✅ SOLUCIÓN IMPLEMENTADA**

#### **1. Actualización del Mapeo de Datos**
```typescript
// En src/services/licenseService.ts
private static mapDocumentToLicenseType(doc: QueryDocumentSnapshot<DocumentData>): LicenseType {
  const data = doc.data();
  return {
    // ... propiedades existentes ...
    calculo_automatico_fecha_fin: data.calculo_automatico_fecha_fin,
    dias_calculo_automatico: data.dias_calculo_automatico,
    requiere_historial_anual: data.requiere_historial_anual,
    // ... resto de propiedades ...
  };
}
```

#### **2. Actualización Automática de Firebase**
```typescript
// En src/main.tsx
const needsUpdate = licenseTypes.some(lt => 
  lt.calculo_automatico_fecha_fin === undefined || 
  lt.dias_calculo_automatico === undefined ||
  lt.requiere_historial_anual === undefined
);

if (needsUpdate) {
  await LicenseService.initializeLicenseTypes();
}
```

#### **3. Interfaz Corregida**
- ✅ Campo fecha fin ocultado para licencias con cálculo automático
- ✅ Campo cantidad ocultado para licencias con cálculo automático
- ✅ Información visual clara sobre cálculo automático

## 🎯 **OBJETIVO DE LA PRUEBA**
Verificar que la solución funcione correctamente:
1. Cálculo automático de fecha fin
2. Cálculo automático de cantidad
3. Interfaz de usuario actualizada
4. Propiedades correctamente mapeadas

## 📝 **PASOS DE PRUEBA**

### **1. PREPARACIÓN**
- [ ] Recargar la página para ejecutar actualización automática
- [ ] Verificar en console que aparezca: "🔄 Actualizando tipos de licencia con nuevas propiedades..."
- [ ] Verificar en console que aparezca: "✅ Tipos de licencias actualizados con nuevas propiedades"

### **2. PRUEBA DE SELECCIÓN DE LICENCIA**
- [ ] Seleccionar "MG07 - Licencia por Maternidad"
- [ ] **VERIFICAR CONSOLE**: Debe aparecer "🎯 Tipo de licencia seleccionado:"
- [ ] **VERIFICAR**: Debe mostrar `calculo_automatico_fecha_fin: true` (NO undefined)

### **3. PRUEBA DE CÁLCULO AUTOMÁTICO**
- [ ] Ingresar fecha inicio: 01/02/2025
- [ ] **VERIFICAR CONSOLE**: Debe aparecer "🔍 useEffect fecha fin automática:"
- [ ] **VERIFICAR CONSOLE**: Debe aparecer "🔄 Calculando fecha fin automática para: MG07"
- [ ] **VERIFICAR CONSOLE**: Debe aparecer "👶 Fecha fin maternidad calculada: 2025-05-25"
- [ ] **VERIFICAR CONSOLE**: Debe aparecer "👶 Cantidad MG07: 112 días (maternidad)"

### **4. PRUEBA DE INTERFAZ**
- [ ] **VERIFICAR**: Campo fecha fin NO debe estar visible
- [ ] **VERIFICAR**: Debe mostrar "Fecha fin se calcula automáticamente"
- [ ] **VERIFICAR**: Campo cantidad NO debe estar visible
- [ ] **VERIFICAR**: Debe mostrar "Cantidad calculada automáticamente: 112 días"

## ✅ **RESULTADOS ESPERADOS**

### **Console.log Esperados (CORREGIDOS)**
```
ℹ️ Tipos de licencias ya existen en Firestore
🔄 Actualizando tipos de licencia con nuevas propiedades...
✅ Tipos de licencias actualizados con nuevas propiedades
🎯 Tipo de licencia seleccionado: {codigo: 'MG07', calculo_automatico_fecha_fin: true, ...}
🔍 useEffect fecha fin automática: {selectedLicenseType: 'MG07', calculo_automatico: true, watchedFechaInicio: '2025-02-01'}
🔄 Calculando fecha fin automática para: MG07
👶 Fecha fin maternidad calculada: 2025-05-25
👶 Cantidad MG07: 112 días (maternidad)
```

### **Interfaz Esperada**
- ✅ Solo campo fecha inicio visible
- ✅ Información "Fecha fin se calcula automáticamente"
- ✅ Información "Cantidad calculada automáticamente: 112 días"
- ✅ No campos de entrada para fecha fin o cantidad

## 🔍 **VERIFICACIONES FINALES**

- [ ] Propiedades mapeadas correctamente desde Firebase
- [ ] Cálculo automático funciona
- [ ] Interfaz es clara
- [ ] No campos editables para valores automáticos
- [ ] Información visual es clara

## 📊 **DATOS DE PRUEBA**

### **Fechas de Prueba**
1. **01/02/2025** → **25/05/2025** (112 días)
2. **15/03/2025** → **03/07/2025** (112 días)
3. **01/12/2025** → **22/03/2026** (112 días)

### **Cálculos Esperados**
- **Maternidad**: Siempre 112 días
- **Fecha fin**: Fecha inicio + 111 días
- **Cantidad**: 112 días (fijo)

## 🚨 **CASOS DE ERROR**

### **Si sigue apareciendo undefined**
- [ ] Verificar que la página se haya recargado completamente
- [ ] Verificar que aparezca el mensaje de actualización en console
- [ ] Verificar que no haya errores de JavaScript
- [ ] Limpiar caché del navegador y recargar

### **Si no se calcula automáticamente**
- [ ] Verificar que `calculo_automatico_fecha_fin` sea `true` (no undefined)
- [ ] Verificar que el useEffect se esté ejecutando
- [ ] Verificar que las funciones de cálculo estén importadas

---

**Fecha de prueba**: 24/08/2025
**Estado**: Solucionado
**Resultado**: Por verificar
