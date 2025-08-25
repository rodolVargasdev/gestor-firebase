# 🧪 PRUEBAS DE PERMISOS - GESTOR DE LICENCIAS

## 📋 **OBJETIVO**
Verificar que cada tipo de licencia funcione correctamente en el frontend, incluyendo:
- ✅ Formularios dinámicos
- ✅ Validaciones de límites
- ✅ Cálculo automático de fechas
- ✅ Control de disponibilidad
- ✅ Filtros por género

## 🎯 **ESTRUCTURA DE PRUEBAS**

### **1. LICENCIAS POR HORAS**
- **PG01** - Permiso Personal con Goce (40h/año)
- **PS02** - Permiso Personal sin Goce (480h/año)

### **2. LICENCIAS POR DÍAS**
- **GG05** - Enfermedad Gravísima (17 días/año)
- **MG07** - Maternidad (112 días/embarazo) ⚠️ **CÁLCULO AUTOMÁTICO**
- **VG11** - Vacaciones (15 días/año)

### **3. LICENCIAS POR OCASIÓN**
- **EG03** - Enfermedad con Goce (máx 3 días/solicitud)
- **ES04** - Enfermedad sin Goce (ilimitada)
- **DG06** - Duelo (máx 3 días/solicitud)
- **AG09** - Paternidad (máx 3 días/solicitud)
- **LG08** - Lactancia (6 meses) ⚠️ **CÁLCULO AUTOMÁTICO**
- **OM14** - Olvido de Marcación (2/mes) ⚠️ **HISTORIAL ANUAL**
- **CT15** - Cambio de Turno (3/mes) ⚠️ **HISTORIAL ANUAL**
- **JRV12** - Juntas Receptoras (ilimitada)
- **JU13** - Jurado (ilimitada)
- **RH16** - RRHH (ilimitada)

## 🔧 **CASOS DE PRUEBA ESPECIALES**

### **Cálculo Automático de Fechas**
1. **MG07 - Maternidad**: Fecha inicio → Fecha fin automática (112 días)
2. **LG08 - Lactancia**: Fecha inicio → Fecha fin automática (6 meses)

### **Validaciones de Límites**
1. **EG03, DG06, AG09**: Máximo 3 días por solicitud
2. **OM14**: Máximo 2 olvidos por mes
3. **CT15**: Máximo 3 cambios por mes

### **Filtros por Género**
1. **MG07, LG08**: Solo aplica a género femenino

### **Cálculo por Calendario**
- Todos los permisos calculan días por calendario (no hábiles)
- Ejemplo: 19/08/2025 - 21/08/2025 = 3 días

## 📝 **INSTRUCCIONES DE PRUEBA**

1. **Crear empleado de prueba** con disponibilidad completa
2. **Solicitar licencia** según el tipo
3. **Verificar formulario** se comporta correctamente
4. **Validar disponibilidad** se reduce apropiadamente
5. **Comprobar cálculos** automáticos funcionan
6. **Documentar resultados** en archivo correspondiente

## 🚨 **CASOS CRÍTICOS A VERIFICAR**

### **MG07 - Maternidad**
- ✅ Solo aparece para empleadas femeninas
- ✅ Fecha fin se calcula automáticamente
- ✅ No permite solapamiento de fechas
- ✅ Disponibilidad se resetea por embarazo

### **LG08 - Lactancia**
- ✅ Solo aparece para empleadas femeninas
- ✅ Fecha fin se calcula automáticamente (6 meses)
- ✅ No permite solapamiento de fechas

### **OM14 - Olvido de Marcación**
- ✅ Máximo 2 por mes
- ✅ Se resetea cada mes
- ✅ Mantiene historial anual

### **CT15 - Cambio de Turno**
- ✅ Máximo 3 por mes
- ✅ Se resetea cada mes
- ✅ Mantiene historial anual

## 📊 **RESULTADOS ESPERADOS**

Cada prueba debe documentar:
- ✅ **Formulario**: Campos correctos y validaciones
- ✅ **Cálculos**: Fechas y días calculados correctamente
- ✅ **Disponibilidad**: Se reduce apropiadamente
- ✅ **Validaciones**: Límites respetados
- ✅ **Filtros**: Género aplicado correctamente
- ✅ **Historial**: Registros guardados correctamente

## 🔄 **PROCESO DE PRUEBA**

1. **Preparación**: Empleado con disponibilidad completa
2. **Ejecución**: Solicitar licencia específica
3. **Verificación**: Comprobar comportamiento
4. **Documentación**: Registrar resultados
5. **Siguiente**: Pasar al siguiente tipo de licencia

---
**Fecha de creación**: 24/08/2025
**Versión**: 1.0
**Estado**: En desarrollo
