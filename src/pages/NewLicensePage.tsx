import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  AlertCircle,
  Save,
  Loader2,
  Info
} from 'lucide-react';
import { useLicenseStore } from '../stores/licenseStore';
import { useEmployeeStore } from '../stores/employeeStore';
import { type LicenseType } from '../types/licenseTypes';
import { formatTimeTotal, formatInputDate, calculateTotalHours } from '../utils/formUtils';

interface NewLicenseFormData {
  tipoLicencia: string;
  fechaInicio: string;
  fechaFin: string;
  fechaOlvido?: string; // OM14
  tipoOlvido?: 'entrada' | 'salida'; // OM14
  justificacionOlvido?: string; // OM14
  fechaNoTrabajara?: string; // CT15
  fechaSiTrabajara?: string;  // CT15
  horas?: number;
  minutos?: number;
  cantidad?: number;
  motivo: string;
  observaciones?: string;
}

export function NewLicensePage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [selectedLicenseType, setSelectedLicenseType] = useState<LicenseType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    licenseTypes,
    employeeAvailability,
    loading,
    loadLicenseTypes,
    loadEmployeeAvailability,
    createLicenseRequest
  } = useLicenseStore();

  const { currentEmployee, loadEmployeeById } = useEmployeeStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm<NewLicenseFormData>({
    mode: 'onChange'
  });

  const watchedTipoLicencia = watch('tipoLicencia');
  const watchedFechaInicio = watch('fechaInicio');
  const watchedFechaFin = watch('fechaFin');
  const watchedFechaNoTrabajara = watch('fechaNoTrabajara');
  const watchedFechaSiTrabajara = watch('fechaSiTrabajara');
  const watchedFechaOlvido = watch('fechaOlvido');
  const watchedTipoOlvido = watch('tipoOlvido');
  const watchedJustificacionOlvido = watch('justificacionOlvido');
  const watchedHoras = watch('horas');
  const watchedMinutos = watch('minutos');

  useEffect(() => {
    if (employeeId) {
      loadEmployeeById(employeeId);
      loadLicenseTypes();
      loadEmployeeAvailability(employeeId);
    }
  }, [employeeId, loadEmployeeById, loadLicenseTypes, loadEmployeeAvailability]);

  useEffect(() => {
    if (watchedTipoLicencia && licenseTypes.length > 0) {
      const licenseType = licenseTypes.find(lt => lt.codigo === watchedTipoLicencia);
      setSelectedLicenseType(licenseType || null);
    }
  }, [watchedTipoLicencia, licenseTypes]);

  // Calcular cantidad máxima disponible
  const getAvailableQuantity = (): number => {
    if (!selectedLicenseType || !employeeAvailability) return 0;

    switch (selectedLicenseType.categoria) {
      case 'HORAS': {
        const horaLicencia = employeeAvailability.licencias_horas?.[selectedLicenseType.codigo];
        return horaLicencia?.disponible_anual || 0;
      }
      
      case 'DIAS': {
        const diaLicencia = employeeAvailability.licencias_dias?.[selectedLicenseType.codigo];
        if (selectedLicenseType.periodo_control === 'anual') {
          return diaLicencia?.disponible_anual || 0;
        } else if (selectedLicenseType.periodo_control === 'mensual') {
          return diaLicencia?.disponible_mes_actual || 0;
        }
        return 0;
      }
      
      case 'OCASION':
        return selectedLicenseType.max_por_solicitud || 999;
      
      default:
        return 0;
    }
  };

  // Función para calcular cantidad automáticamente para OCASIÓN
  const calcularCantidadAutomatica = (data: NewLicenseFormData): number => {
    if (!selectedLicenseType) return 0;

    switch (selectedLicenseType.codigo) {
      case 'OM14':
        return 1; // Siempre 1 olvido
      
      case 'CT15':
        return 1; // Siempre 1 cambio de turno
      
      case 'LG08':
        if (data.fechaInicio && data.fechaFin) {
          const inicio = new Date(data.fechaInicio);
          const fin = new Date(data.fechaFin);
          return Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
        }
        return 0;
      
      default: // Otros OCASIÓN
        if (data.fechaInicio && data.fechaFin) {
          const inicio = new Date(data.fechaInicio);
          const fin = new Date(data.fechaFin);
          return Math.ceil((fin.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
        }
        return 0;
    }
  };

  // Validar fechas (sin restricciones de horarios, permitir 24/7/365)
  const validateDates = (): boolean => {
    // Para CT15 y OM14, no validar fechas normales
    if (selectedLicenseType?.codigo === 'CT15' || selectedLicenseType?.codigo === 'OM14') {
      return true;
    }
    
    if (!watchedFechaInicio || !watchedFechaFin) return false;
    
    const startDate = new Date(watchedFechaInicio);
    const endDate = new Date(watchedFechaFin);
    
    // Solo validar que la fecha de fin no sea anterior a la fecha de inicio
    return endDate >= startDate;
  };

  const onSubmit = async (data: NewLicenseFormData) => {
    if (!employeeId || !selectedLicenseType) return;

    setIsSubmitting(true);
    setError(null);

    try {
      let cantidadTotal = 0;
      let errorMessage = '';

      // Calcular cantidad según el tipo de licencia
      switch (selectedLicenseType.categoria) {
        case 'HORAS':
          cantidadTotal = calculateTotalHours(data.horas || 0, data.minutos || 0);
          if (cantidadTotal <= 0) {
            errorMessage = 'Debe ingresar al menos 1 hora o 1 minuto';
          }
          break;
        
        case 'DIAS':
          cantidadTotal = data.cantidad || 0;
          if (cantidadTotal <= 0) {
            errorMessage = 'Debe ingresar una cantidad válida de días';
          }
          break;
        
        case 'OCASION':
          // Calcular cantidad automáticamente para OCASIÓN
          cantidadTotal = calcularCantidadAutomatica(data);
          
          // Validaciones específicas por tipo de OCASIÓN
          if (selectedLicenseType.codigo === 'OM14') {
            if (!data.fechaOlvido || !data.tipoOlvido || !data.justificacionOlvido) {
              errorMessage = 'Debe especificar la fecha del olvido, el tipo de olvido y la justificación';
            }
          } else if (selectedLicenseType.codigo === 'CT15') {
            if (!data.fechaNoTrabajara || !data.fechaSiTrabajara) {
              errorMessage = 'Debe especificar ambas fechas para el cambio de turno';
            }
          } else {
            // Para otros tipos de OCASIÓN
            if (!data.fechaInicio || !data.fechaFin) {
              errorMessage = 'Debe especificar las fechas de inicio y fin';
            } else if (cantidadTotal <= 0) {
              errorMessage = 'Las fechas seleccionadas no son válidas';
            }
          }
          break;
        
        default:
          errorMessage = 'Tipo de licencia no válido';
      }

      if (errorMessage) {
        setError(errorMessage);
        setIsSubmitting(false);
        return;
      }

      // Validar disponibilidad
      const availableQuantity = getAvailableQuantity();
      if (cantidadTotal > availableQuantity) {
        const unidad = selectedLicenseType.categoria === 'HORAS' ? 'horas' : 'días';
        setError(`Cantidad solicitada (${cantidadTotal} ${unidad}) excede la disponibilidad (${availableQuantity} ${unidad})`);
        setIsSubmitting(false);
        return;
      }

      // Validar fechas
      if (!validateDates()) {
        setError('Las fechas seleccionadas no son válidas');
        setIsSubmitting(false);
        return;
      }

      // Crear la solicitud de licencia
      let startDate, endDate;
      
      if (selectedLicenseType.codigo === 'CT15') {
        // Para CT15, usar las fechas específicas del cambio de turno
        startDate = new Date(data.fechaNoTrabajara + 'T00:00:00');
        endDate = new Date(data.fechaSiTrabajara + 'T23:59:59');
      } else if (selectedLicenseType.codigo === 'OM14') {
        // Para OM14, usar la fecha del olvido (mismo día)
        startDate = new Date(data.fechaOlvido + 'T00:00:00');
        endDate = new Date(data.fechaOlvido + 'T23:59:59');
      } else {
        // Para otros tipos, usar las fechas normales
        startDate = new Date(data.fechaInicio + 'T00:00:00');
        endDate = new Date(data.fechaFin + 'T23:59:59');
      }

      // Preparar observaciones adicionales para tipos especiales
      let additionalObservations = data.observaciones || '';
      
      if (selectedLicenseType.codigo === 'OM14') {
        const olvidoInfo = `Tipo de olvido: ${data.tipoOlvido === 'entrada' ? 'Entrada' : 'Salida'}. Justificación: ${data.justificacionOlvido}`;
        additionalObservations = additionalObservations ? `${additionalObservations}\n\n${olvidoInfo}` : olvidoInfo;
      }

      await createLicenseRequest({
        employeeId,
        licenseTypeCode: selectedLicenseType.codigo,
        startDate,
        endDate,
        quantity: cantidadTotal,
        reason: data.motivo,
        observations: additionalObservations
      });

      // Redirigir al historial
      navigate(`/employees/${employeeId}/license-history`);
    } catch (err) {
      setError('Error al crear la licencia. Intente nuevamente.');
      console.error('Error creating license:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (available: number, requested: number) => {
    if (requested > available) return 'destructive';
    if (requested > available * 0.8) return 'secondary';
    return 'default';
  };



  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!currentEmployee || !employeeAvailability) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Empleado no encontrado</h3>
          <p className="text-gray-600 mb-4">
            No se pudo cargar la información del empleado.
          </p>
          <Button onClick={() => navigate('/employees')}>
            Volver a Empleados
          </Button>
        </div>
      </div>
    );
  }

  const availableQuantity = getAvailableQuantity();

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/employees/${employeeId}/availability`)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              Nueva Licencia
            </h1>
            <p className="text-gray-600">
              {currentEmployee.firstName} {currentEmployee.lastName}
            </p>
          </div>
        </div>
      </div>

      {/* Información del empleado */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Información del Empleado</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">ID de Empleado</p>
              <p className="font-semibold">{currentEmployee.employeeId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Departamento</p>
              <p className="font-semibold">{currentEmployee.department}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cargo</p>
              <p className="font-semibold">{currentEmployee.position}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Selección de tipo de licencia */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Tipo de Licencia</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Seleccionar tipo de licencia *
                </label>
                <select
                  {...register('tipoLicencia', { required: 'Debe seleccionar un tipo de licencia' })}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seleccionar...</option>
                  {licenseTypes.map((licenseType) => (
                    <option key={licenseType.codigo} value={licenseType.codigo}>
                      {licenseType.codigo} - {licenseType.nombre}
                    </option>
                  ))}
                </select>
                {errors.tipoLicencia && (
                  <p className="text-red-500 text-sm mt-1">{errors.tipoLicencia.message}</p>
                )}
              </div>

              {selectedLicenseType && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{selectedLicenseType.nombre}</h4>
                    <Badge variant="outline">{selectedLicenseType.codigo}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{selectedLicenseType.descripcion}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Categoría:</span>
                      <span className="ml-2">{selectedLicenseType.categoria}</span>
                    </div>
                    <div>
                      <span className="font-medium">Período:</span>
                      <span className="ml-2">{selectedLicenseType.periodo_control}</span>
                    </div>
                    <div>
                      <span className="font-medium">Unidad:</span>
                      <span className="ml-2">{selectedLicenseType.unidad_control}</span>
                    </div>
                    <div>
                      <span className="font-medium">Disponible:</span>
                      <Badge 
                        variant={getStatusColor(availableQuantity, 0)}
                        className="ml-2"
                      >
                        {availableQuantity} {selectedLicenseType.unidad_control}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fechas y cantidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Detalles de la Licencia</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Información específica según el tipo de licencia */}
            {selectedLicenseType?.categoria === 'HORAS' && (
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Información para licencias por horas:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ingrese las horas y minutos por separado</li>
                      <li>Si no ingresa horas, se asume 0 horas</li>
                      <li>Si no ingresa minutos, se asume 0 minutos</li>
                      <li>Debe ingresar al menos 1 hora o 1 minuto</li>
                      <li>Los minutos se convierten automáticamente a horas (ej: 30 min = 0.5 horas)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedLicenseType?.categoria === 'DIAS' && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Información para licencias por días:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ingrese la cantidad de días completos</li>
                      <li>Se calcula automáticamente desde la fecha de inicio hasta la fecha de fin</li>
                      <li>La cantidad debe coincidir con el período seleccionado</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedLicenseType?.categoria === 'OCASION' && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-start space-x-2">
                  <Info className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-green-800">
                    <p className="font-medium mb-1">Información para licencias por ocasión:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Puede solicitar este permiso en cualquier momento</li>
                      <li>Se aceptan solicitudes para fechas pasadas, presentes o futuras</li>
                      <li>No hay restricciones de horarios o días específicos</li>
                      <li>La cantidad se calcula automáticamente según las fechas</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedLicenseType?.codigo === 'OM14' && (
              <div className="mb-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-indigo-800">
                    <p className="font-medium mb-1">Información para olvido de marcación:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Especifique la fecha en que olvidó marcar</li>
                      <li>Indique si fue olvido de entrada o salida</li>
                      <li>Proporcione una justificación detallada del olvido</li>
                      <li>Esto cuenta como 1 olvido mensual</li>
                      <li>Se puede reportar retroactivamente</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {selectedLicenseType?.codigo === 'CT15' && (
              <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-purple-800">
                    <p className="font-medium mb-1">Información para cambio de turno:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Especifique la fecha en que NO trabajará</li>
                      <li>Especifique la fecha en que SÍ trabajará</li>
                      <li>Esto cuenta como 1 cambio de turno mensual</li>
                      <li>Se puede solicitar con anticipación</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Campos de fecha según el tipo de licencia */}
            {selectedLicenseType?.codigo === 'OM14' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Fecha del Olvido *
                    </label>
                    <Input
                      type="date"
                      {...register('fechaOlvido', { required: 'Fecha del olvido es requerida' })}
                    />
                    {errors.fechaOlvido && (
                      <p className="text-red-500 text-sm mt-1">{errors.fechaOlvido.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Tipo de Olvido *
                    </label>
                    <select
                      {...register('tipoOlvido', { required: 'Tipo de olvido es requerido' })}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Seleccionar...</option>
                      <option value="entrada">Olvido de Entrada</option>
                      <option value="salida">Olvido de Salida</option>
                    </select>
                    {errors.tipoOlvido && (
                      <p className="text-red-500 text-sm mt-1">{errors.tipoOlvido.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Justificación del Olvido *
                  </label>
                  <textarea
                    {...register('justificacionOlvido', { required: 'Justificación del olvido es requerida' })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Explique detalladamente por qué olvidó marcar la entrada/salida..."
                  />
                  {errors.justificacionOlvido && (
                    <p className="text-red-500 text-sm mt-1">{errors.justificacionOlvido.message}</p>
                  )}
                </div>
              </div>
            ) : selectedLicenseType?.codigo === 'CT15' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fecha que NO trabajará *
                  </label>
                  <Input
                    type="date"
                    {...register('fechaNoTrabajara', { required: 'Fecha que no trabajará es requerida' })}
                  />
                  {errors.fechaNoTrabajara && (
                    <p className="text-red-500 text-sm mt-1">{errors.fechaNoTrabajara.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fecha que SÍ trabajará *
                  </label>
                  <Input
                    type="date"
                    {...register('fechaSiTrabajara', { required: 'Fecha que sí trabajará es requerida' })}
                  />
                  {errors.fechaSiTrabajara && (
                    <p className="text-red-500 text-sm mt-1">{errors.fechaSiTrabajara.message}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fecha de inicio *
                  </label>
                  <Input
                    type="date"
                    {...register('fechaInicio', { required: 'Fecha de inicio es requerida' })}
                  />
                  {errors.fechaInicio && (
                    <p className="text-red-500 text-sm mt-1">{errors.fechaInicio.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Fecha de fin *
                  </label>
                  <Input
                    type="date"
                    {...register('fechaFin', { required: 'Fecha de fin es requerida' })}
                  />
                  {errors.fechaFin && (
                    <p className="text-red-500 text-sm mt-1">{errors.fechaFin.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Campos de cantidad según el tipo de licencia */}
            {selectedLicenseType?.categoria === 'HORAS' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Horas
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max={Math.floor(availableQuantity)}
                    step="1"
                    placeholder="0"
                    {...register('horas', { 
                      min: { value: 0, message: 'Mínimo 0 horas' },
                      max: { value: Math.floor(availableQuantity), message: `Máximo ${Math.floor(availableQuantity)} horas` }
                    })}
                  />
                  {errors.horas && (
                    <p className="text-red-500 text-sm mt-1">{errors.horas.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Minutos
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    step="1"
                    placeholder="0"
                    {...register('minutos', { 
                      min: { value: 0, message: 'Mínimo 0 minutos' },
                      max: { value: 59, message: 'Máximo 59 minutos' }
                    })}
                  />
                  {errors.minutos && (
                    <p className="text-red-500 text-sm mt-1">{errors.minutos.message}</p>
                  )}
                </div>
              </div>
            )}

            {selectedLicenseType?.categoria === 'DIAS' && (
              <div className="mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cantidad de días *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max={availableQuantity}
                    step="1"
                    placeholder="1"
                    {...register('cantidad', { 
                      required: 'Cantidad es requerida',
                      min: { value: 1, message: 'Mínimo 1 día' },
                      max: { value: availableQuantity, message: `Máximo ${availableQuantity} días` }
                    })}
                  />
                  {errors.cantidad && (
                    <p className="text-red-500 text-sm mt-1">{errors.cantidad.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* NO mostrar campo cantidad para OCASIÓN - se calcula automáticamente */}

            {/* Mostrar período según el tipo de licencia */}
            {selectedLicenseType?.codigo === 'CT15' ? (
              watchedFechaNoTrabajara && watchedFechaSiTrabajara && (
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-purple-700">
                      Cambio de turno: No trabaja {formatInputDate(watchedFechaNoTrabajara)} → Trabaja {formatInputDate(watchedFechaSiTrabajara)}
                    </span>
                  </div>
                </div>
              )
            ) : selectedLicenseType?.codigo === 'OM14' ? (
              watchedFechaOlvido && watchedTipoOlvido && (
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium text-indigo-700">
                      Olvido de marcación: {formatInputDate(watchedFechaOlvido)} - {watchedTipoOlvido === 'entrada' ? 'Entrada' : 'Salida'}
                    </span>
                  </div>
                  {watchedJustificacionOlvido && (
                    <div className="mt-2 text-sm text-indigo-600">
                      <strong>Justificación:</strong> {watchedJustificacionOlvido}
                    </div>
                  )}
                </div>
              )
            ) : (
              watchedFechaInicio && watchedFechaFin && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-blue-700">
                      Período: {formatInputDate(watchedFechaInicio)} - {formatInputDate(watchedFechaFin)}
                    </span>
                  </div>
                  {selectedLicenseType?.categoria === 'OCASION' && (
                    <div className="mt-2 text-sm text-blue-600">
                      <strong>Días calculados automáticamente:</strong> {calcularCantidadAutomatica({ fechaInicio: watchedFechaInicio, fechaFin: watchedFechaFin } as NewLicenseFormData)} días
                    </div>
                  )}
                </div>
              )
            )}

            {/* Mostrar cantidad total calculada para HORAS */}
            {(watchedHoras || watchedMinutos) && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-700">
                    Tiempo total: {formatTimeTotal(watchedHoras || 0, watchedMinutos || 0)}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Motivo y observaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Información Adicional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Motivo de la licencia *
                </label>
                <textarea
                  {...register('motivo', { required: 'Motivo es requerido' })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describa el motivo de la licencia..."
                />
                {errors.motivo && (
                  <p className="text-red-500 text-sm mt-1">{errors.motivo.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Observaciones (opcional)
                </label>
                <textarea
                  {...register('observaciones')}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error message */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Botones de acción */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/employees/${employeeId}/availability`)}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            disabled={!isValid || isSubmitting}
            className="flex items-center space-x-2"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{isSubmitting ? 'Creando...' : 'Crear Licencia'}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
