import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useEmployeeStore } from '../../stores/employeeStore';
import { type Employee } from '../../types';

interface EmployeeFormData {
  userId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  position: string;
  hireDate: string;
  salary: number;
  currency: string;
  isActive: boolean;
  managerId: string;
  notes: string;
}

interface EmployeeFormProps {
  employee?: Employee;
  onClose: () => void;
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onClose }) => {
  const { createEmployee, updateEmployee, departments, loading, error } = useEmployeeStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EmployeeFormData>({
    defaultValues: {
      userId: '',
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      departmentId: '',
      position: '',
      hireDate: '',
      salary: 0,
      currency: 'EUR',
      isActive: true,
      managerId: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (employee) {
      setValue('userId', employee.userId || '');
      setValue('employeeId', employee.employeeId);
      setValue('firstName', employee.firstName);
      setValue('lastName', employee.lastName);
      setValue('email', employee.email);
      setValue('phone', employee.phone || '');
      setValue('departmentId', employee.departmentId);
      setValue('position', employee.position);
      setValue('hireDate', employee.hireDate.toISOString().split('T')[0]);
      setValue('salary', employee.salary || 0);
      setValue('currency', employee.currency || 'EUR');
      setValue('isActive', employee.isActive);
      setValue('managerId', employee.managerId || '');
      setValue('notes', employee.notes || '');
    }
  }, [employee, setValue]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
             const employeeData = {
         ...data,
         hireDate: new Date(data.hireDate),
         phone: data.phone || undefined,
         managerId: data.managerId || undefined,
         notes: data.notes || undefined,
         salary: data.salary || 0,
         currency: data.currency || 'EUR',
         gender: 'both' as const,
         personalType: 'permanent' as const,
       };

      if (employee) {
        await updateEmployee(employee.id, employeeData);
             } else {
         await createEmployee(employeeData);
       }
      
      onClose();
    } catch (error) {
      console.error('Error al guardar empleado:', error);
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-xl">
            {employee ? 'Editar Empleado' : 'Nuevo Empleado'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID de Usuario *
                </label>
                <Input
                  {...register('userId', { required: 'El ID de usuario es requerido' })}
                  placeholder="user-123"
                />
                {errors.userId && (
                  <p className="text-red-600 text-sm mt-1">{errors.userId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID de Empleado *
                </label>
                <Input
                  {...register('employeeId', { required: 'El ID de empleado es requerido' })}
                  placeholder="EMP001"
                />
                {errors.employeeId && (
                  <p className="text-red-600 text-sm mt-1">{errors.employeeId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <Input
                  {...register('firstName', { required: 'El nombre es requerido' })}
                  placeholder="Juan"
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellido *
                </label>
                <Input
                  {...register('lastName', { required: 'El apellido es requerido' })}
                  placeholder="Pérez"
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm mt-1">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  {...register('email', { 
                    required: 'El email es requerido',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  placeholder="juan.perez@empresa.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <Input
                  {...register('phone')}
                  placeholder="+34 600 123 456"
                />
              </div>
            </div>

            {/* Información laboral */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento *
                </label>
                <select
                  {...register('departmentId', { required: 'El departamento es requerido' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar departamento</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                {errors.departmentId && (
                  <p className="text-red-600 text-sm mt-1">{errors.departmentId.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posición *
                </label>
                <Input
                  {...register('position', { required: 'La posición es requerida' })}
                  placeholder="Desarrollador Senior"
                />
                {errors.position && (
                  <p className="text-red-600 text-sm mt-1">{errors.position.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Contratación *
                </label>
                <Input
                  type="date"
                  {...register('hireDate', { required: 'La fecha de contratación es requerida' })}
                />
                {errors.hireDate && (
                  <p className="text-red-600 text-sm mt-1">{errors.hireDate.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager ID
                </label>
                <Input
                  {...register('managerId')}
                  placeholder="EMP001"
                />
              </div>
            </div>

            {/* Información salarial */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salario
                </label>
                <Input
                  type="number"
                  step="0.01"
                  {...register('salary', { 
                    min: { value: 0, message: 'El salario debe ser positivo' }
                  })}
                  placeholder="45000"
                />
                {errors.salary && (
                  <p className="text-red-600 text-sm mt-1">{errors.salary.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moneda
                </label>
                <select
                  {...register('currency')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EUR">EUR (Euro)</option>
                  <option value="USD">USD (Dólar)</option>
                  <option value="GBP">GBP (Libra)</option>
                </select>
              </div>

              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Empleado Activo</span>
                </label>
              </div>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas
              </label>
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Información adicional sobre el empleado..."
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
                {loading ? 'Guardando...' : (employee ? 'Actualizar' : 'Crear')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
