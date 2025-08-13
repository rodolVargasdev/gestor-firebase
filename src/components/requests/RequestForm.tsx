import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useRequestStore } from '../../stores/requestStore';
import { useEmployeeStore } from '../../stores/employeeStore';
import { useLicenseStore } from '../../stores/licenseStore';
import { type LicenseRequest, type RequestPriority } from '../../types';

interface RequestFormData {
  employeeId: string;
  licenseTypeId: string;
  departmentId: string;
  startDate: string;
  endDate: string;
  quantity: number;
  reason: string;
  priority: RequestPriority;
  notes?: string;
  estimatedCost?: number;
}

interface RequestFormProps {
  request?: LicenseRequest;
  onClose: () => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({ request, onClose }) => {
  const { createRequest, updateRequest, loading, error } = useRequestStore();
  const { employees, departments, loadEmployees, loadDepartments } = useEmployeeStore();
  const { licenseTypes, loadLicenseTypes } = useLicenseStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<RequestFormData>({
    defaultValues: {
      employeeId: '',
      licenseTypeId: '',
      departmentId: '',
      startDate: '',
      endDate: '',
      quantity: 1,
      reason: '',
      priority: 'medium',
      notes: '',
      estimatedCost: 0,
    },
  });

  const selectedLicenseType = watch('licenseTypeId');
  const selectedEmployee = watch('employeeId');

  useEffect(() => {
    loadEmployees();
    loadDepartments();
    loadLicenseTypes();
  }, [loadEmployees, loadDepartments, loadLicenseTypes]);

  useEffect(() => {
    if (request) {
      setValue('employeeId', request.employeeId);
      setValue('licenseTypeId', request.licenseTypeId);
      setValue('departmentId', request.departmentId);
      setValue('startDate', request.startDate.toISOString().split('T')[0]);
      setValue('endDate', request.endDate.toISOString().split('T')[0]);
      setValue('quantity', request.quantity);
      setValue('reason', request.reason);
      setValue('priority', request.priority);
      setValue('notes', request.notes || '');
      // setValue('estimatedCost', request.estimatedCost || 0); // Removido - no aplica para licencias laborales
    }
  }, [request, setValue]);

  // Auto-completar departamento cuando se selecciona un empleado
  useEffect(() => {
    if (selectedEmployee) {
      const employee = employees.find(e => e.id === selectedEmployee);
      if (employee) {
        setValue('departmentId', employee.departmentId);
      }
    }
  }, [selectedEmployee, employees, setValue]);

  // Calcular costo estimado cuando cambia la licencia o cantidad
  useEffect(() => {
    if (selectedLicenseType && watch('quantity')) {
      const licenseType = licenseTypes.find(lt => lt.id === selectedLicenseType);
      if (licenseType) {
        // const estimatedCost = licenseType.costPerUnit * watch('quantity'); // Removido - no aplica para licencias laborales
        // setValue('estimatedCost', estimatedCost); // Removido - no aplica para licencias laborales
      }
    }
  }, [selectedLicenseType, watch('quantity'), licenseTypes, setValue]);

  const onSubmit = async (data: RequestFormData) => {
    try {
      const requestData = {
        ...data,
        requestDate: new Date(),
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        status: 'pending' as const,
        estimatedCost: data.estimatedCost || 0,
        notes: data.notes || undefined,
      };

      if (request) {
        await updateRequest(request.id, requestData);
      } else {
        await createRequest(requestData);
      }
      
      onClose();
    } catch (error) {
      console.error('Error al guardar solicitud:', error);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName} (${employee.employeeId})` : '';
  };

  const getLicenseTypeInfo = (licenseTypeId: string) => {
    const licenseType = licenseTypes.find(lt => lt.id === licenseTypeId);
    return licenseType ? `${licenseType.name} - ${licenseType.unitControl}` : '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-xl">
            {request ? 'Editar Solicitud' : 'Nueva Solicitud de Licencia'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información del empleado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Empleado *
                </label>
                <select
                  {...register('employeeId', { required: 'El empleado es requerido' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar empleado</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {getEmployeeName(employee.id)}
                    </option>
                  ))}
                </select>
                {errors.employeeId && (
                  <p className="text-red-600 text-sm mt-1">{errors.employeeId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento
                </label>
                <select
                  {...register('departmentId')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                >
                  <option value="">Se auto-completa con el empleado</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Información de la licencia */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Licencia *
                </label>
                <select
                  {...register('licenseTypeId', { required: 'El tipo de licencia es requerido' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar tipo de licencia</option>
                  {licenseTypes.map((licenseType) => (
                    <option key={licenseType.id} value={licenseType.id}>
                      {licenseType.name} - {licenseType.unitControl}
                    </option>
                  ))}
                </select>
                {errors.licenseTypeId && (
                  <p className="text-red-600 text-sm mt-1">{errors.licenseTypeId.message}</p>
                )}
                {selectedLicenseType && (
                  <p className="text-sm text-gray-500 mt-1">
                    {getLicenseTypeInfo(selectedLicenseType)}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad *
                </label>
                <Input
                  type="number"
                  min="1"
                  {...register('quantity', { 
                    required: 'La cantidad es requerida',
                    min: { value: 1, message: 'La cantidad debe ser al menos 1' }
                  })}
                  placeholder="1"
                />
                {errors.quantity && (
                  <p className="text-red-600 text-sm mt-1">{errors.quantity.message}</p>
                )}
              </div>
            </div>

            {/* Período de uso */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio *
                </label>
                <Input
                  type="date"
                  {...register('startDate', { required: 'La fecha de inicio es requerida' })}
                />
                {errors.startDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.startDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin *
                </label>
                <Input
                  type="date"
                  {...register('endDate', { required: 'La fecha de fin es requerida' })}
                />
                {errors.endDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.endDate.message}</p>
                )}
              </div>
            </div>

            {/* Prioridad y motivo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prioridad *
                </label>
                <select
                  {...register('priority', { required: 'La prioridad es requerida' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Baja</option>
                  <option value="medium">Media</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
                {errors.priority && (
                  <p className="text-red-600 text-sm mt-1">{errors.priority.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Costo Estimado
                </label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('estimatedCost')}
                  placeholder="0.00"
                  disabled
                />
                <p className="text-sm text-gray-500 mt-1">
                  Se calcula automáticamente
                </p>
              </div>
            </div>

            {/* Motivo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo de la Solicitud *
              </label>
              <textarea
                {...register('reason', { 
                  required: 'El motivo es requerido',
                  minLength: { value: 10, message: 'El motivo debe tener al menos 10 caracteres' }
                })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describe el motivo de la solicitud de licencia..."
              />
              {errors.reason && (
                <p className="text-red-600 text-sm mt-1">{errors.reason.message}</p>
              )}
            </div>

            {/* Notas adicionales */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                {...register('notes')}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Información adicional o comentarios..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button
                type="button"
                onClick={handleCancel}
                variant="outline"
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Guardando...' : (request ? 'Actualizar' : 'Crear')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
