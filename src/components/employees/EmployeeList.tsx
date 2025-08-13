import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useEmployeeStore } from '../../stores/employeeStore';
import { type Employee } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const EmployeeList: React.FC = () => {
  const {
    employees,
    departments,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    loadEmployees,
    loadDepartments,
    openForm,
    deleteEmployee,
    setFilters,
    setPage,
  } = useEmployeeStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    loadEmployees();
    loadDepartments();
  }, [loadEmployees, loadDepartments]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ search: value, departmentId: selectedDepartment });
  };

  const handleDepartmentFilter = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    setFilters({ search: searchTerm, departmentId });
  };

  const handleDelete = async (employee: Employee) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${employee.firstName} ${employee.lastName}?`)) {
      await deleteEmployee(employee.id);
    }
  };

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    return department?.name || 'Departamento no encontrado';
  };

  const formatSalary = (salary?: number, currency?: string) => {
    if (!salary) return 'No especificado';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency || 'EUR',
    }).format(salary);
  };

  if (loading && employees.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando empleados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header y controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Empleados</h2>
          <p className="text-gray-600">
            Total: {totalItems} empleados
          </p>
        </div>
        <Button onClick={() => openForm()} className="bg-blue-600 hover:bg-blue-700">
          + Nuevo Empleado
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar por nombre
              </label>
              <Input
                placeholder="Buscar empleados..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departamento
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedDepartment}
                onChange={(e) => handleDepartmentFilter(e.target.value)}
              >
                <option value="">Todos los departamentos</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedDepartment('');
                  setFilters({});
                }}
                variant="outline"
                className="w-full"
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de empleados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Empleados</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {employees.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron empleados</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm || selectedDepartment 
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando un nuevo empleado'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        <Badge variant={employee.isActive ? "default" : "secondary"}>
                          {employee.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">ID:</span> {employee.employeeId}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {employee.email}
                        </div>
                        <div>
                          <span className="font-medium">Departamento:</span> {getDepartmentName(employee.departmentId)}
                        </div>
                        <div>
                          <span className="font-medium">Posición:</span> {employee.position}
                        </div>
                        <div>
                          <span className="font-medium">Teléfono:</span> {employee.phone || 'No especificado'}
                        </div>
                        <div>
                          <span className="font-medium">Salario:</span> {formatSalary(employee.salary, employee.currency)}
                        </div>
                        <div>
                          <span className="font-medium">Fecha de contratación:</span> {format(employee.hireDate, 'dd/MM/yyyy', { locale: es })}
                        </div>
                        <div>
                          <span className="font-medium">Manager:</span> {employee.managerId || 'No asignado'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => openForm(employee)}
                        variant="outline"
                        size="sm"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDelete(employee)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <div className="flex gap-2">
                <Button
                  onClick={() => setPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Anterior
                </Button>
                
                <span className="flex items-center px-3 py-2 text-sm text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                
                <Button
                  onClick={() => setPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
