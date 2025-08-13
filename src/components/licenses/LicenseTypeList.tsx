import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useLicenseStore } from '../../stores/licenseStore';
import { type LicenseType } from '../../types';

export const LicenseTypeList: React.FC = () => {
  const {
    licenseTypes,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    loadLicenseTypes,
    openForm,
    deleteLicenseType,
    setPage,
  } = useLicenseStore();

  useEffect(() => {
    loadLicenseTypes();
  }, [loadLicenseTypes]);

  const handleEdit = (licenseType: LicenseType) => {
    openForm(licenseType);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este tipo de licencia?')) {
      await deleteLicenseType(id);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'software':
        return 'bg-blue-100 text-blue-800';
      case 'hardware':
        return 'bg-green-100 text-green-800';
      case 'service':
        return 'bg-purple-100 text-purple-800';
      case 'subscription':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Activo
      </Badge>
    ) : (
      <Badge variant="secondary" className="bg-red-100 text-red-800">
        Inactivo
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tipos de Licencias</h2>
          <p className="text-gray-600">
            {totalItems} tipos de licencias encontrados
          </p>
        </div>
        <Button onClick={() => openForm()}>
          + Nuevo Tipo de Licencia
        </Button>
      </div>

      {/* Lista de licencias */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {licenseTypes.map((licenseType) => (
          <Card key={licenseType.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{licenseType.name}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {licenseType.description}
                  </p>
                </div>
                {getStatusBadge(licenseType.isActive)}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3">
                {/* Categoría */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Categoría:</span>
                  <Badge className={getCategoryColor(licenseType.category)}>
                    {licenseType.category}
                  </Badge>
                </div>

                {/* Período */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Período:</span>
                  <span className="text-sm text-gray-600 capitalize">
                    {licenseType.periodControl}
                  </span>
                </div>

                {/* Unidad */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Unidad:</span>
                  <span className="text-sm text-gray-600 capitalize">
                    {licenseType.unitControl}
                  </span>
                </div>

                {/* Disponibilidad */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Disponible:</span>
                  <span className="text-sm text-gray-600">
                    {licenseType.totalAvailable.toLocaleString()}
                  </span>
                </div>

                {/* Precio */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Precio:</span>
                  <span className="text-sm text-gray-600">
                    {/* {licenseType.costPerUnit.toLocaleString()} {licenseType.currency} */}
                  </span>
                </div>

                {/* Renovación automática */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Renovación:</span>
                  <Badge variant={licenseType.autoRenewal ? 'default' : 'secondary'}>
                    {licenseType.autoRenewal ? 'Automática' : 'Manual'}
                  </Badge>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(licenseType)}
                  className="flex-1"
                >
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(licenseType.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Eliminar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}

      {/* Estado vacío */}
      {licenseTypes.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No hay tipos de licencias
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando tu primer tipo de licencia.
          </p>
          <div className="mt-6">
            <Button onClick={() => openForm()}>
              + Crear Tipo de Licencia
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
