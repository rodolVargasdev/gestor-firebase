import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useLicenseStore } from '../stores/licenseStore';
import { useEmployeeStore } from '../stores/employeeStore';
import { type LicenseType } from '../types/licenseTypes';
import { formatTimeTotal, formatInputDate } from '../utils/formUtils';

// Esquema dinámico según la categoría de licencia
const createEditLicenseSchema = (licenseTypes: LicenseType[]) => {
  return z.object({
    licenseTypeCode: z.string().min(1, 'Tipo de licencia es requerido'),
    fechaInicio: z.string().min(1, 'Fecha de inicio es requerida'),
    fechaFin: z.string().min(1, 'Fecha de fin es requerida'),
    horas: z.coerce.number().min(0, 'Mínimo 0 horas'),
    minutos: z.coerce.number().min(0, 'Mínimo 0 minutos').max(59, 'Máximo 59 minutos'),
    razon: z.string().min(1, 'Motivo es requerido'),
    observaciones: z.string().optional(),
  }).refine((data) => {
    const startDate = new Date(data.fechaInicio);
    const endDate = new Date(data.fechaFin);
    return endDate >= startDate;
  }, {
    message: 'La fecha de fin debe ser posterior o igual a la fecha de inicio',
    path: ['fechaFin'],
  }).refine((data) => {
    // Validación específica para licencias de horas
    const licenseType = licenseTypes.find(type => type.codigo === data.licenseTypeCode);
    if (licenseType?.categoria === 'HORAS') {
      const totalHours = data.horas + (data.minutos / 60);
      return totalHours > 0;
    }
    return true;
  }, {
    message: 'Debe ingresar al menos 1 hora o 1 minuto para licencias por horas',
    path: ['horas'],
  });
};

type EditLicenseFormData = z.infer<ReturnType<typeof createEditLicenseSchema>>;

export function EditLicensePage() {
  const { employeeId, requestId } = useParams<{ employeeId: string; requestId: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [licenseRequest, setLicenseRequest] = useState<any>(null);

  const {
    licenseRequests,
    licenseTypes,
    loading,
    loadLicenseTypes,
    updateLicenseRequest
  } = useLicenseStore();

  const { currentEmployee, loadEmployeeById } = useEmployeeStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<EditLicenseFormData>({
    resolver: zodResolver(createEditLicenseSchema(licenseTypes)),
    defaultValues: {
      horas: 0,
      minutos: 0,
    }
  });

  useEffect(() => {
    if (employeeId) {
      loadEmployeeById(employeeId);
    }
    loadLicenseTypes();
  }, [employeeId, loadEmployeeById, loadLicenseTypes]);

  useEffect(() => {
    if (requestId && licenseRequests.length > 0) {
      const request = licenseRequests.find(req => req.id === requestId);
      if (request) {
        setLicenseRequest(request);
        const hours = Math.floor(request.quantity);
        const minutes = Math.round((request.quantity - hours) * 60);
        
        setValue('licenseTypeCode', request.licenseTypeCode);
        setValue('fechaInicio', request.startDate.toISOString().split('T')[0]);
        setValue('fechaFin', request.endDate.toISOString().split('T')[0]);
        setValue('horas', hours);
        setValue('minutos', minutes);
        setValue('razon', request.reason);
        setValue('observaciones', request.observations || '');
      }
    }
  }, [requestId, licenseRequests, setValue]);

  const watchedFechaInicio = watch('fechaInicio');
  const watchedFechaFin = watch('fechaFin');
  const watchedHoras = watch('horas');
  const watchedMinutos = watch('minutos');
  const watchedLicenseTypeCode = watch('licenseTypeCode');
  
  // Obtener el tipo de licencia seleccionado
  const selectedLicenseType = licenseTypes.find(type => type.codigo === watchedLicenseTypeCode);
  const isHourBasedLicense = selectedLicenseType?.categoria === 'HORAS';
  const isDayBasedLicense = selectedLicenseType?.categoria === 'DIAS';
  const isOccasionBasedLicense = selectedLicenseType?.categoria === 'OCASION';





  const onSubmit = async (data: EditLicenseFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Obtener el tipo de licencia para determinar cómo calcular la cantidad
      const licenseType = licenseTypes.find(type => type.codigo === data.licenseTypeCode);
      let cantidadTotal = 0;

      if (licenseType?.categoria === 'HORAS') {
        // ✅ CONVERTIR EXPLÍCITAMENTE A NÚMEROS PARA LICENCIAS DE HORAS
        const horas = typeof data.horas === 'string' ? parseFloat(data.horas) || 0 : (data.horas || 0);
        const minutos = typeof data.minutos === 'string' ? parseFloat(data.minutos) || 0 : (data.minutos || 0);
        cantidadTotal = horas + (minutos / 60);

        console.log('🔍 DEBUG EDICIÓN HORAS:', {
          horasOriginal: data.horas,
          minutosOriginal: data.minutos,
          horasConvertidas: horas,
          minutosConvertidos: minutos,
          cantidadTotal: cantidadTotal
        });

        if (cantidadTotal <= 0) {
          setError('Debe ingresar al menos 1 hora o 1 minuto');
          setIsSubmitting(false);
          return;
        }
      } else if (licenseType?.categoria === 'DIAS') {
        // Calcular días basado en las fechas para licencias de días
        const startDate = new Date(data.fechaInicio);
        const endDate = new Date(data.fechaFin);
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        cantidadTotal = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir ambos días

        console.log('🔍 DEBUG EDICIÓN DIAS:', {
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
          cantidadTotal: cantidadTotal
        });
      } else if (licenseType?.categoria === 'OCASION') {
        // Para licencias de ocasión, usar 1 como cantidad por defecto
        cantidadTotal = 1;
        console.log('🔍 DEBUG EDICIÓN OCASION:', {
          cantidadTotal: cantidadTotal
        });
      }

      await updateLicenseRequest(requestId!, {
        licenseTypeCode: data.licenseTypeCode,
        startDate: new Date(data.fechaInicio),
        endDate: new Date(data.fechaFin),
        quantity: cantidadTotal,
        reason: data.razon,
        observations: data.observaciones
      });

      navigate(`/employees/${employeeId}/license-history`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al actualizar la licencia.';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !licenseRequest) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Cargando licencia...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/employees/${employeeId}/license-history`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Editar Licencia</h1>
              <p className="text-gray-600">
                {currentEmployee ? `${currentEmployee.firstName} ${currentEmployee.lastName}` : 'Empleado'}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle>Información de la Licencia</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">Información importante:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Ingrese las horas y minutos por separado</li>
                      <li>Si no ingresa horas, se asume 0 horas</li>
                      <li>Si no ingresa minutos, se asume 0 minutos</li>
                      <li>Debe ingresar al menos 1 hora o 1 minuto</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo de Licencia *</label>
                  <Select
                    value={watch('licenseTypeCode')}
                    onValueChange={(value: string) => setValue('licenseTypeCode', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo de licencia" />
                    </SelectTrigger>
                    <SelectContent>
                      {licenseTypes.map((type: LicenseType) => (
                        <SelectItem key={type.codigo} value={type.codigo}>
                          {type.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.licenseTypeCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.licenseTypeCode.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Fecha de Inicio *</label>
                  <Input
                    type="date"
                    {...register('fechaInicio', { required: 'Fecha de inicio es requerida' })}
                  />
                  {errors.fechaInicio && (
                    <p className="text-red-500 text-sm mt-1">{errors.fechaInicio.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Fecha de Fin *</label>
                  <Input
                    type="date"
                    {...register('fechaFin', { required: 'Fecha de fin es requerida' })}
                  />
                  {errors.fechaFin && (
                    <p className="text-red-500 text-sm mt-1">{errors.fechaFin.message}</p>
                  )}
                </div>

                {/* Campos de horas y minutos solo para licencias de tipo HORAS */}
                {isHourBasedLicense && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-2">Horas</label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="0"
                        {...register('horas', {
                          min: { value: 0, message: 'Mínimo 0 horas' }
                        })}
                      />
                      {errors.horas && (
                        <p className="text-red-500 text-sm mt-1">{errors.horas.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Minutos</label>
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
                  </>
                )}

                {/* Información de cantidad calculada para licencias de días */}
                {isDayBasedLicense && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Cantidad (días)</label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <span className="text-sm text-gray-600">
                        La cantidad se calcula automáticamente basada en las fechas seleccionadas
                      </span>
                    </div>
                  </div>
                )}

                {/* Información para licencias de ocasión */}
                {isOccasionBasedLicense && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Cantidad (eventos)</label>
                    <div className="p-3 bg-gray-50 rounded-md border">
                      <span className="text-sm text-gray-600">
                        Para licencias de ocasión, la cantidad se calcula automáticamente
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {watchedFechaInicio && watchedFechaFin && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-700">
                      Período: {formatInputDate(watchedFechaInicio)} - {formatInputDate(watchedFechaFin)}
                    </span>
                  </div>
                </div>
              )}

              {/* Mostrar tiempo total solo para licencias de horas */}
              {isHourBasedLicense && (watchedHoras || watchedMinutos) && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-green-700">
                      Tiempo total: {formatTimeTotal(watchedHoras || 0, watchedMinutos || 0)}
                    </span>
                  </div>
                </div>
              )}

              {/* Mostrar información de días para licencias de días */}
              {isDayBasedLicense && watchedFechaInicio && watchedFechaFin && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-blue-700">
                      Cantidad calculada: {Math.ceil((new Date(watchedFechaFin).getTime() - new Date(watchedFechaInicio).getTime()) / (1000 * 60 * 60 * 24)) + 1} días
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <label className="block text-sm font-medium mb-2">Motivo *</label>
                <Textarea
                  placeholder="Ingrese el motivo de la licencia"
                  {...register('razon', { required: 'Motivo es requerido' })}
                />
                {errors.razon && (
                  <p className="text-red-500 text-sm mt-1">{errors.razon.message}</p>
                )}
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Observaciones</label>
                <Textarea
                  placeholder="Observaciones adicionales (opcional)"
                  {...register('observaciones')}
                />
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/employees/${employeeId}/license-history`)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Actualizando...
                    </>
                  ) : (
                    'Actualizar Licencia'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
