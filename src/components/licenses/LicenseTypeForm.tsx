import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import { useLicenseStore } from '../../stores/licenseStore';
import { type LicenseType, LICENSE_CONFIGS, type Gender, type PersonalType } from '../../types';

interface LicenseTypeFormData {
  code: string;
  name: string;
  description: string;
  category: string;
  periodControl: 'monthly' | 'annual' | 'quarterly' | 'none';
  unitControl: 'hours' | 'days' | 'uses';
  totalAvailable: number;
  maxDaysPerRequest?: number;
  requiresJustification: boolean;
  hasSalary: boolean;
  isAccumulable: boolean;
  isTransferable: boolean;
  genderRestriction?: Gender;
  minSeniority?: number;
  minAge?: number;
  maxAge?: number;
  departmentRestriction?: string[];
  positionRestriction?: string[];
  personalTypeRestriction?: PersonalType[];
  autoRenewal: boolean;
  isActive: boolean;
}

interface LicenseTypeFormProps {
  licenseType?: LicenseType;
  onClose: () => void;
}

export const LicenseTypeForm: React.FC<LicenseTypeFormProps> = ({
  licenseType,
  onClose,
}) => {
  const { createLicenseType, updateLicenseType, error } = useLicenseStore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LicenseTypeFormData>({
    defaultValues: {
      code: '',
      name: '',
      description: '',
      category: '',
      periodControl: 'annual',
      unitControl: 'days',
      totalAvailable: 0,
      maxDaysPerRequest: undefined,
      requiresJustification: true,
      hasSalary: true,
      isAccumulable: false,
      isTransferable: false,
      genderRestriction: 'both',
      minSeniority: undefined,
      minAge: undefined,
      maxAge: undefined,
      departmentRestriction: undefined,
      positionRestriction: undefined,
      personalTypeRestriction: undefined,
      autoRenewal: false,
      isActive: true,
    },
  });

  const watchedCategory = watch('category');
  const watchedPeriodControl = watch('periodControl');

  // Cargar datos si estamos editando
  useEffect(() => {
    if (licenseType) {
      reset({
        code: licenseType.code,
        name: licenseType.name,
        description: licenseType.description,
        category: licenseType.category,
        periodControl: licenseType.periodControl,
        unitControl: licenseType.unitControl,
        totalAvailable: licenseType.totalAvailable,
        maxDaysPerRequest: licenseType.maxDaysPerRequest,
        requiresJustification: licenseType.requiresJustification,
        hasSalary: licenseType.hasSalary,
        isAccumulable: licenseType.isAccumulable,
        isTransferable: licenseType.isTransferable,
        genderRestriction: licenseType.genderRestriction,
        minSeniority: licenseType.minSeniority,
        minAge: licenseType.minAge,
        maxAge: licenseType.maxAge,
        departmentRestriction: licenseType.departmentRestriction,
        positionRestriction: licenseType.positionRestriction,
        personalTypeRestriction: licenseType.personalTypeRestriction,
        autoRenewal: licenseType.autoRenewal,
        isActive: licenseType.isActive,
      });
    }
  }, [licenseType, reset]);

  // Aplicar configuración predefinida cuando cambia la categoría
  useEffect(() => {
    const config = (LICENSE_CONFIGS as any)[watchedCategory];
    if (config) {
      setValue('periodControl', config.periodControl);
      setValue('unitControl', config.unitControl);
      setValue('totalAvailable', config.totalAvailable);
      setValue('maxDaysPerRequest', config.maxDaysPerRequest);
      setValue('autoRenewal', config.autoRenewal);
    }
  }, [watchedCategory, setValue]);

  const onSubmit = async (data: LicenseTypeFormData) => {
    try {
      const licenseData = {
        ...data,
        genderRestriction: data.genderRestriction || 'both',
      };
      
      if (licenseType) {
        await updateLicenseType(licenseType.id, licenseData);
      } else {
        await createLicenseType(licenseData);
      }
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const getCategoryDescription = (category: string) => {
    switch (category) {
      case 'software':
        return 'Aplicaciones y programas informáticos';
      case 'hardware':
        return 'Equipos físicos y dispositivos';
      case 'service':
        return 'Servicios externos y consultoría';
      case 'subscription':
        return 'Suscripciones y servicios en la nube';
      default:
        return '';
    }
  };

  const getPeriodDescription = (period: string) => {
    switch (period) {
      case 'monthly':
        return 'Renovación mensual';
      case 'annual':
        return 'Renovación anual';
      case 'quarterly':
        return 'Renovación trimestral';
      case 'none':
        return 'Sin renovación automática';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>
            {licenseType ? 'Editar Tipo de Licencia' : 'Nuevo Tipo de Licencia'}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Información Básica</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <Input
                  {...register('name', { required: 'El nombre es requerido' })}
                  placeholder="Ej: Microsoft Office 365"
                />
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción *
                </label>
                <textarea
                  {...register('description', { required: 'La descripción es requerida' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Describe el tipo de licencia..."
                />
                {errors.description && (
                  <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría *
                </label>
                <select
                  {...register('category', { required: 'La categoría es requerida' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="software">Software</option>
                  <option value="hardware">Hardware</option>
                  <option value="service">Servicio</option>
                  <option value="subscription">Suscripción</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  {getCategoryDescription(watchedCategory)}
                </p>
              </div>
            </div>

            {/* Configuración de períodos */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Configuración de Períodos</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Control de Período *
                  </label>
                  <select
                    {...register('periodControl', { required: 'El control de período es requerido' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="monthly">Mensual</option>
                    <option value="annual">Anual</option>
                    <option value="quarterly">Trimestral</option>
                    <option value="none">Ninguno</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">
                    {getPeriodDescription(watchedPeriodControl)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unidad de Control *
                  </label>
                  <select
                    {...register('unitControl', { required: 'La unidad de control es requerida' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hours">Horas</option>
                    <option value="days">Días</option>
                    <option value="uses">Usos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Disponible *
                  </label>
                  <Input
                    type="number"
                    {...register('totalAvailable', { 
                      required: 'El total disponible es requerido',
                      min: { value: 1, message: 'Debe ser mayor a 0' }
                    })}
                    placeholder="100"
                  />
                  {errors.totalAvailable && (
                    <p className="text-red-600 text-sm mt-1">{errors.totalAvailable.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Máximo Días por Solicitud *
                  </label>
                  <Input
                    type="number"
                    {...register('maxDaysPerRequest', { 
                      required: 'El máximo de días es requerido',
                      min: { value: 1, message: 'Debe ser mayor a 0' }
                    })}
                    placeholder="365"
                  />
                  {errors.maxDaysPerRequest && (
                    <p className="text-red-600 text-sm mt-1">{errors.maxDaysPerRequest.message}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('autoRenewal')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Renovación automática
                </label>
              </div>
            </div>

            {/* Configuración de precios - Removido para licencias laborales */}

            {/* Estado */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Estado</h3>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('isActive')}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  Tipo de licencia activo
                </label>
              </div>
            </div>

            {/* Errores */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Guardando...' : licenseType ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
