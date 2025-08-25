// ========================================
// COLECCIÓN: empleados
// ========================================
// Documento por cada empleado con disponibilidad integrada
{
  // Información básica del empleado
  empleado_id: "EMP001",
  nombre_completo: "Juan Pérez",
  email: "juan.perez@telemedicina.com",
  telefono: "7777-1234",
  
  // Información laboral
  departamento: "Sistemas",
  cargo: "Desarrollador Senior",
  tipo_personal: "Administrativo", // Administrativo | Operativo
  fecha_ingreso: "2024-03-15T00:00:00Z",
  salario_base: 1200.00,
  activo: true,
  
  // Información personal
  fecha_nacimiento: "1985-06-20T00:00:00Z",
  genero: "M", // M | F
  estado_civil: "Soltero",
  direccion: "Col. San Benito, San Salvador",
  
  // Jefatura
  jefe_inmediato_id: "EMP002",
  jefe_inmediato_nombre: "María González",
  
  // ========================================
  // DISPONIBILIDAD DE LICENCIAS
  // ========================================
  disponibilidad: {
    // Año actual de referencia
    año_actual: 2025,
    mes_actual: 8,
    
    // Fecha de última actualización de disponibilidades
    ultima_renovacion_anual: "2025-01-01T00:00:00Z",
    ultima_renovacion_mensual: "2025-08-01T00:00:00Z",
    
    // LICENCIAS POR HORAS
    licencias_horas: {
      "PG01": {
        codigo: "PG01",
        nombre: "Permiso Personal con Goce de Salario",
        categoria: "HORAS",
        periodo_control: "anual",
        asignada_anual: 40, // horas por año
        utilizada_anual: 8,
        disponible_anual: 32,
        unidad: "horas",
        solicitudes_activas: ["SOL-2025-001234"],
        ultima_actualizacion: "2025-08-15T10:30:00Z"
      },
      "PS02": {
        codigo: "PS02",
        nombre: "Permiso Personal sin Goce de Salario",
        categoria: "HORAS",
        periodo_control: "anual",
        asignada_anual: 480, // 60 días x 8 horas
        utilizada_anual: 0,
        disponible_anual: 480,
        unidad: "horas",
        solicitudes_activas: [],
        ultima_actualizacion: "2025-01-01T00:00:00Z"
      },
      "LG08": {
        codigo: "LG08",
        nombre: "Licencia por Lactancia Materna",
        categoria: "HORAS",
        periodo_control: "ninguno", // se controla por evento
        aplica_genero: "F",
        asignada_actual: 0, // se asigna cuando nace el bebé
        utilizada_actual: 0,
        disponible_actual: 0,
        unidad: "horas_diarias", // 1 hora diaria por 6 meses
        periodo_activo: null, // se llena cuando está activa
        fecha_inicio_periodo: null,
        fecha_fin_periodo: null,
        solicitudes_activas: [],
        ultima_actualizacion: "2025-01-01T00:00:00Z"
      }
    },
    
    // LICENCIAS POR DÍAS (CON DISPONIBILIDAD FIJA)
    licencias_dias: {
      "GG05": {
        codigo: "GG05",
        nombre: "Licencia por Enfermedad Gravísima de Pariente",
        categoria: "DIAS",
        periodo_control: "anual",
        asignada_anual: 17,
        utilizada_anual: 3,
        disponible_anual: 14,
        unidad: "dias",
        solicitudes_activas: [],
        ultima_actualizacion: "2025-06-10T14:20:00Z"
      },
      "MG07": {
        codigo: "MG07",
        nombre: "Licencia por Maternidad",
        categoria: "DIAS",
        periodo_control: "ninguno", // por evento de embarazo
        aplica_genero: "F",
        asignada_por_embarazo: 112,
        utilizada_embarazo_actual: 0,
        disponible_embarazo_actual: 112,
        unidad: "dias",
        embarazo_activo: false,
        fecha_ultimo_embarazo: null,
        solicitudes_activas: [],
        ultima_actualizacion: "2025-01-01T00:00:00Z"
      },
      "VG11": {
        codigo: "VG11",
        nombre: "Vacaciones Anuales",
        categoria: "DIAS",
        periodo_control: "anual",
        asignada_anual: 15,
        utilizada_anual: 5,
        disponible_anual: 10,
        unidad: "dias",
        solicitudes_activas: ["SOL-2025-000987"],
        ultima_actualizacion: "2025-07-20T09:15:00Z"
      },
      "OM14": {
        codigo: "OM14",
        nombre: "Licencia por Olvido de Marcación",
        categoria: "DIAS",
        periodo_control: "mensual",
        // Control mensual - se resetea cada mes
        asignada_mensual: 2,
        utilizada_mes_actual: 1,
        disponible_mes_actual: 1,
        unidad: "olvidos",
        // Historial de uso mensual
        uso_mensual: {
          "2025-07": { utilizada: 0, disponible: 2 },
          "2025-08": { utilizada: 1, disponible: 1 }
        },
        solicitudes_activas: [],
        ultima_actualizacion: "2025-08-10T11:30:00Z"
      },
      "CT15": {
        codigo: "CT15",
        nombre: "Licencia por Cambio de Turno",
        categoria: "DIAS",
        periodo_control: "mensual",
        asignada_mensual: 3,
        utilizada_mes_actual: 2,
        disponible_mes_actual: 1,
        unidad: "cambios",
        uso_mensual: {
          "2025-07": { utilizada: 1, disponible: 2 },
          "2025-08": { utilizada: 2, disponible: 1 }
        },
        solicitudes_activas: [],
        ultima_actualizacion: "2025-08-12T16:45:00Z"
      }
    },
    
    // LICENCIAS POR OCASIÓN (SIN DISPONIBILIDAD FIJA)
    licencias_ocasion: {
      "EG03": {
        codigo: "EG03",
        nombre: "Licencia por Enfermedad con Goce de Salario",
        categoria: "OCASION",
        periodo_control: "ninguno",
        max_por_solicitud: 3,
        unidad: "dias",
        // Solo registro histórico
        historial_uso: [
          {
            solicitud_id: "SOL-2025-000456",
            fecha_inicio: "2025-07-15",
            fecha_fin: "2025-07-17",
            dias_utilizados: 3,
            estado: "APROBADA"
          },
          {
            solicitud_id: "SOL-2025-000678",
            fecha_inicio: "2025-08-05",
            fecha_fin: "2025-08-06",
            dias_utilizados: 2,
            estado: "APROBADA"
          }
        ],
        total_dias_año: 5, // días usados en el año actual
        total_solicitudes_año: 2,
        solicitudes_activas: [],
        ultima_actualizacion: "2025-08-05T08:00:00Z"
      },
      "ES04": {
        codigo: "ES04",
        nombre: "Licencia por Enfermedad sin Goce de Salario",
        categoria: "OCASION",
        periodo_control: "ninguno",
        unidad: "dias",
        historial_uso: [],
        total_dias_año: 0,
        total_solicitudes_año: 0,
        solicitudes_activas: [],
        ultima_actualizacion: "2025-01-01T00:00:00Z"
      },
      "DG06": {
        codigo: "DG06",
        nombre: "Licencia por Duelo",
        categoria: "OCASION",
        periodo_control: "ninguno",
        max_por_solicitud: 3,
        unidad: "dias",
        historial_uso: [],
        total_dias_año: 0,
        total_solicitudes_año: 0,
        solicitudes_activas: [],
        ultima_actualizacion: "2025-01-01T00:00:00Z"
      },
      "AG09": {
        codigo: "AG09",
        nombre: "Licencia por Paternidad/Adopción",
        categoria: "OCASION",
        periodo_control: "ninguno",
        max_por_solicitud: 3,
        unidad: "dias",
        historial_uso: [
          {
            solicitud_id: "SOL-2025-000234",
            fecha_inicio: "2025-05-20",
            fecha_fin: "2025-05-22",
            dias_utilizados: 3,
            estado: "APROBADA",
            motivo: "Nacimiento de hijo"
          }
        ],
        total_dias_año: 3,
        total_solicitudes_año: 1,
        solicitudes_activas: [],
        ultima_actualizacion: "2025-05-20T06:00:00Z"
      },
      "JRV12": {
        codigo: "JRV12",
        nombre: "Licencia por Juntas Receptoras de Votos",
        categoria: "OCASION",
        periodo_control: "ninguno",
        unidad: "dias",
        historial_uso: [],
        total_dias_año: 0,
        total_solicitudes_año: 0,
        solicitudes_activas: [],
        ultima_actualizacion: "2025-01-01T00:00:00Z"
      },
      "JU13": {
        codigo: "JU13",
        nombre: "Licencia por Conformar Jurado",
        categoria: "OCASION",
        periodo_control: "ninguno",
        unidad: "dias",
        historial_uso: [],
        total_dias_año: 0,
        total_solicitudes_año: 0,
        solicitudes_activas: [],
        ultima_actualizacion: "2025-01-01T00:00:00Z"
      },
      "RH16": {
        codigo: "RH16",
        nombre: "Movimiento de Recurso Humano",
        categoria: "OCASION",
        periodo_control: "ninguno",
        unidad: "dias",
        historial_uso: [],
        total_dias_año: 0,
        total_solicitudes_año: 0,
        solicitudes_activas: [],
        ultima_actualizacion: "2025-01-01T00:00:00Z"
      }
    }
  },
  
  // Metadatos
  fecha_creacion: "2024-03-15T08:00:00Z",
  fecha_actualizacion: "2025-08-15T10:30:00Z",
  creado_por: "admin",
  version: 3
}

// ========================================
// FUNCIONES PARA MANEJO DE DISPONIBILIDAD
// ========================================

/**
 * Inicializar disponibilidad al crear nuevo empleado
 */
async function inicializarDisponibilidadEmpleado(empleadoData) {
  const añoActual = new Date().getFullYear();
  const mesActual = new Date().getMonth() + 1;
  
  // Obtener todos los tipos de licencias activas
  const tiposLicenciasSnapshot = await db.collection('licencias_tipos')
    .where('activo', '==', true)
    .get();
  
  const disponibilidad = {
    año_actual: añoActual,
    mes_actual: mesActual,
    ultima_renovacion_anual: admin.firestore.FieldValue.serverTimestamp(),
    ultima_renovacion_mensual: admin.firestore.FieldValue.serverTimestamp(),
    licencias_horas: {},
    licencias_dias: {},
    licencias_ocasion: {}
  };
  
  // Procesar cada tipo de licencia
  tiposLicenciasSnapshot.docs.forEach(doc => {
    const tipoLicencia = doc.data();
    
    // Validar si el empleado es elegible
    if (esEmpleadoElegible(tipoLicencia, empleadoData)) {
      const licenciaData = crearLicenciaDisponibilidad(tipoLicencia, empleadoData);
      
      // Clasificar por categoría
      if (tipoLicencia.categoria === 'HORAS') {
        disponibilidad.licencias_horas[tipoLicencia.codigo] = licenciaData;
      } else if (tipoLicencia.categoria === 'DIAS') {
        disponibilidad.licencias_dias[tipoLicencia.codigo] = licenciaData;
      } else if (tipoLicencia.categoria === 'OCASION') {
        disponibilidad.licencias_ocasion[tipoLicencia.codigo] = licenciaData;
      }
    }
  });
  
  return disponibilidad;
}

/**
 * Crear estructura de disponibilidad para una licencia específica
 */
function crearLicenciaDisponibilidad(tipoLicencia, empleadoData) {
  const base = {
    codigo: tipoLicencia.codigo,
    nombre: tipoLicencia.nombre,
    categoria: tipoLicencia.categoria,
    periodo_control: tipoLicencia.periodo_control,
    unidad: tipoLicencia.unidad_control,
    solicitudes_activas: [],
    ultima_actualizacion: admin.firestore.FieldValue.serverTimestamp()
  };
  
  // Agregar campos específicos por género
  if (tipoLicencia.aplica_genero) {
    base.aplica_genero = tipoLicencia.aplica_genero;
  }
  
  if (tipoLicencia.categoria === 'HORAS') {
    if (tipoLicencia.periodo_control === 'anual') {
      const cantidadAsignada = calcularCantidadProporcional(tipoLicencia.cantidad_maxima, empleadoData.fecha_ingreso);
      return {
        ...base,
        asignada_anual: cantidadAsignada,
        utilizada_anual: 0,
        disponible_anual: cantidadAsignada
      };
    } else if (tipoLicencia.codigo === 'LG08') { // Lactancia
      return {
        ...base,
        asignada_actual: 0,
        utilizada_actual: 0,
        disponible_actual: 0,
        periodo_activo: null,
        fecha_inicio_periodo: null,
        fecha_fin_periodo: null
      };
    }
  }
  
  if (tipoLicencia.categoria === 'DIAS') {
    if (tipoLicencia.periodo_control === 'anual') {
      const cantidadAsignada = tipoLicencia.cantidad_maxima;
      return {
        ...base,
        asignada_anual: cantidadAsignada,
        utilizada_anual: 0,
        disponible_anual: cantidadAsignada
      };
    } else if (tipoLicencia.periodo_control === 'mensual') {
      return {
        ...base,
        asignada_mensual: tipoLicencia.cantidad_maxima,
        utilizada_mes_actual: 0,
        disponible_mes_actual: tipoLicencia.cantidad_maxima,
        uso_mensual: {}
      };
    } else if (tipoLicencia.codigo === 'MG07') { // Maternidad
      return {
        ...base,
        asignada_por_embarazo: 112,
        utilizada_embarazo_actual: 0,
        disponible_embarazo_actual: 112,
        embarazo_activo: false,
        fecha_ultimo_embarazo: null
      };
    }
  }
  
  if (tipoLicencia.categoria === 'OCASION') {
    return {
      ...base,
      max_por_solicitud: tipoLicencia.max_por_solicitud || null,
      historial_uso: [],
      total_dias_año: 0,
      total_solicitudes_año: 0
    };
  }
  
  return base;
}

/**
 * Actualizar disponibilidad cuando se aprueba una solicitud
 */
async function actualizarDisponibilidadEmpleado(empleadoId, solicitudData, accion) {
  const empleadoRef = db.collection('empleados').doc(empleadoId);
  const tipoLicencia = solicitudData.tipo_licencia_codigo;
  const cantidad = solicitudData.total_horas_solicitadas || solicitudData.total_dias_solicitados;
  
  const updates = {};
  
  if (accion === 'APROBAR') {
    // Reducir disponibilidad según la categoría
    if (solicitudData.categoria === 'HORAS') {
      if (solicitudData.periodo_control === 'anual') {
        updates[`disponibilidad.licencias_horas.${tipoLicencia}.utilizada_anual`] = admin.firestore.FieldValue.increment(cantidad);
        updates[`disponibilidad.licencias_horas.${tipoLicencia}.disponible_anual`] = admin.firestore.FieldValue.increment(-cantidad);
      }
    } else if (solicitudData.categoria === 'DIAS') {
      if (solicitudData.periodo_control === 'anual') {
        updates[`disponibilidad.licencias_dias.${tipoLicencia}.utilizada_anual`] = admin.firestore.FieldValue.increment(cantidad);
        updates[`disponibilidad.licencias_dias.${tipoLicencia}.disponible_anual`] = admin.firestore.FieldValue.increment(-cantidad);
      } else if (solicitudData.periodo_control === 'mensual') {
        updates[`disponibilidad.licencias_dias.${tipoLicencia}.utilizada_mes_actual`] = admin.firestore.FieldValue.increment(cantidad);
        updates[`disponibilidad.licencias_dias.${tipoLicencia}.disponible_mes_actual`] = admin.firestore.FieldValue.increment(-cantidad);
      }
    } else if (solicitudData.categoria === 'OCASION') {
      // Agregar al historial
      const registroHistorial = {
        solicitud_id: solicitudData.id,
        fecha_inicio: solicitudData.fecha_inicio,
        fecha_fin: solicitudData.fecha_fin,
        dias_utilizados: cantidad,
        estado: 'APROBADA'
      };
      
      updates[`disponibilidad.licencias_ocasion.${tipoLicencia}.historial_uso`] = admin.firestore.FieldValue.arrayUnion(registroHistorial);
      updates[`disponibilidad.licencias_ocasion.${tipoLicencia}.total_dias_año`] = admin.firestore.FieldValue.increment(cantidad);
      updates[`disponibilidad.licencias_ocasion.${tipoLicencia}.total_solicitudes_año`] = admin.firestore.FieldValue.increment(1);
    }
    
    // Agregar a solicitudes activas
    updates[`disponibilidad.licencias_${solicitudData.categoria.toLowerCase()}.${tipoLicencia}.solicitudes_activas`] = admin.firestore.FieldValue.arrayUnion(solicitudData.id);
  }
  
  // Actualizar timestamp
  updates[`disponibilidad.licencias_${solicitudData.categoria.toLowerCase()}.${tipoLicencia}.ultima_actualizacion`] = admin.firestore.FieldValue.serverTimestamp();
  
  await empleadoRef.update(updates);
}

/**
 * Renovar disponibilidades al inicio del año
 */
async function renovarDisponibilidadesAnuales() {
  const añoNuevo = new Date().getFullYear();
  const empleadosSnapshot = await db.collection('empleados').where('activo', '==', true).get();
  
  const batch = db.batch();
  
  empleadosSnapshot.docs.forEach(doc => {
    const empleadoRef = doc.ref;
    
    // Resetear licencias anuales por horas
    batch.update(empleadoRef, {
      'disponibilidad.año_actual': añoNuevo,
      'disponibilidad.ultima_renovacion_anual': admin.firestore.FieldValue.serverTimestamp(),
      // Resetear cada licencia anual...
    });
  });
  
  await batch.commit();
}

/**
 * Renovar disponibilidades mensuales
 */
async function renovarDisponibilidadesMensuales() {
  const hoy = new Date();
  const año = hoy.getFullYear();
  const mes = hoy.getMonth() + 1;
  
  const empleadosSnapshot = await db.collection('empleados').where('activo', '==', true).get();
  
  const batch = db.batch();
  
  empleadosSnapshot.docs.forEach(doc => {
    const empleadoRef = doc.ref;
    const empleado = doc.data();
    
    // Resetear licencias mensuales
    const updates = {
      'disponibilidad.mes_actual': mes,
      'disponibilidad.ultima_renovacion_mensual': admin.firestore.FieldValue.serverTimestamp()
    };
    
    // Resetear olvidos de marcación
    if (empleado.disponibilidad?.licencias_dias?.OM14) {
      updates['disponibilidad.licencias_dias.OM14.utilizada_mes_actual'] = 0;
      updates['disponibilidad.licencias_dias.OM14.disponible_mes_actual'] = 2;
    }
    
    // Resetear cambios de turno
    if (empleado.disponibilidad?.licencias_dias?.CT15) {
      updates['disponibilidad.licencias_dias.CT15.utilizada_mes_actual'] = 0;
      updates['disponibilidad.licencias_dias.CT15.disponible_mes_actual'] = 3;
    }
    
    batch.update(empleadoRef, updates);
  });
  
  await batch.commit();
}

🎯 Ventajas de este enfoque:
✅ Simplicidad:

Un solo documento por empleado con toda su información
Consulta directa sin necesidad de joins
Disponibilidad inmediata visible en el documento del empleado

📊 Estructura organizada:

licencias_horas: PG01, PS02, LG08
licencias_dias: GG05, MG07, VG11, OM14, CT15
licencias_ocasion: EG03, ES04, DG06, AG09, JRV12, JU13, RH16

🔄 Control de períodos:
javascript// Olvido de marcación - Solo afecta el mes actual
"OM14": {
  asignada_mensual: 2,
  utilizada_mes_actual: 1,
  disponible_mes_actual: 1,
  uso_mensual: {
    "2025-07": { utilizada: 0 },
    "2025-08": { utilizada: 1 }  // ← Solo este mes se reduce
  }
}
📈 Ventajas específicas:

Rendimiento: Una sola consulta para ver toda la disponibilidad
Consistencia: No hay riesgo de documentos desfasados
Simplicidad: Lógica más directa para updates
Reportes: Fácil aggregation por departamento/cargo

🛠 Funciones principales:

inicializarDisponibilidadEmpleado(): Al crear empleado, setea todos los permisos al máximo
actualizarDisponibilidadEmpleado(): Reduce disponibilidad al aprobar licencia
renovarDisponibilidadesAnuales(): 1 enero - resetea licencias anuales
renovarDisponibilidadesMensuales(): Día 1 - resetea mensuales

💡 Casos especiales manejados:

Maternidad: 112 días que se resetean por embarazo
Lactancia: Período de 6 meses desde nacimiento
Olvidos: Solo 2 por mes, historial mensual
Ocasión: Historial completo sin límite fijo
