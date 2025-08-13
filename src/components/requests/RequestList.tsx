import React, { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useRequestStore } from '../../stores/requestStore';
import { useEmployeeStore } from '../../stores/employeeStore';
import { useLicenseStore } from '../../stores/licenseStore';
import { type LicenseRequest, type RequestStatus, type RequestPriority } from '../../types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const RequestList: React.FC = () => {
  const {
    requests,
    loading,
    error,
    currentPage,
    totalPages,
    totalItems,
    loadRequests,
    openForm,
    deleteRequest,
    approveRequest,
    rejectRequest,
    setFilters,
    setPage,
    loadRequestStats,
  } = useRequestStore();

  const { employees, departments, loadEmployees, loadDepartments } = useEmployeeStore();
  const { licenseTypes, loadLicenseTypes } = useLicenseStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | ''>('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<RequestPriority | ''>('');

  useEffect(() => {
    loadRequests();
    loadEmployees();
    loadDepartments();
    loadLicenseTypes();
    loadRequestStats();
  }, [loadRequests, loadEmployees, loadDepartments, loadLicenseTypes, loadRequestStats]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ search: value, status: selectedStatus || undefined, departmentId: selectedDepartment || undefined });
  };

  const handleStatusFilter = (status: RequestStatus | '') => {
    setSelectedStatus(status);
    setFilters({ search: searchTerm, status: status || undefined, departmentId: selectedDepartment || undefined });
  };

  const handleDepartmentFilter = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    setFilters({ search: searchTerm, status: selectedStatus || undefined, departmentId: departmentId || undefined });
  };

  const handlePriorityFilter = (priority: RequestPriority | '') => {
    setSelectedPriority(priority);
    setFilters({ search: searchTerm, status: selectedStatus || undefined, departmentId: selectedDepartment || undefined });
  };

  const handleDelete = async (request: LicenseRequest) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la solicitud ${request.id}?`)) {
      await deleteRequest(request.id);
    }
  };

  const handleApprove = async (request: LicenseRequest) => {
    const notes = prompt('Notas de aprobación (opcional):');
    await approveRequest(request.id, 'admin', notes || undefined);
  };

  const handleReject = async (request: LicenseRequest) => {
    const reason = prompt('Motivo del rechazo:');
    if (reason) {
      await rejectRequest(request.id, 'admin', reason);
    }
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = employees.find(e => e.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : 'Empleado no encontrado';
  };

  const getDepartmentName = (departmentId: string) => {
    const department = departments.find(d => d.id === departmentId);
    return department?.name || 'Departamento no encontrado';
  };

  const getLicenseTypeName = (licenseTypeId: string) => {
    const licenseType = licenseTypes.find(lt => lt.id === licenseTypeId);
    return licenseType?.name || 'Tipo de licencia no encontrado';
  };

  const getStatusBadgeVariant = (status: RequestStatus) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'cancelled': return 'outline';
      case 'in_progress': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusText = (status: RequestStatus) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'approved': return 'Aprobada';
      case 'rejected': return 'Rechazada';
      case 'cancelled': return 'Cancelada';
      case 'in_progress': return 'En Progreso';
      default: return status;
    }
  };

  const getPriorityBadgeVariant = (priority: RequestPriority) => {
    switch (priority) {
      case 'low': return 'secondary';
      case 'medium': return 'default';
      case 'high': return 'destructive';
      case 'urgent': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPriorityText = (priority: RequestPriority) => {
    switch (priority) {
      case 'low': return 'Baja';
      case 'medium': return 'Media';
      case 'high': return 'Alta';
      case 'urgent': return 'Urgente';
      default: return priority;
    }
  };

  if (loading && requests.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando solicitudes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header y controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Solicitudes de Licencias</h2>
          <p className="text-gray-600">
            Total: {totalItems} solicitudes
          </p>
        </div>
        <Button onClick={() => openForm()} className="bg-blue-600 hover:bg-blue-700">
          + Nueva Solicitud
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros y Búsqueda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <Input
                placeholder="Buscar solicitudes..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedStatus}
                onChange={(e) => handleStatusFilter(e.target.value as RequestStatus | '')}
              >
                <option value="">Todos los estados</option>
                <option value="pending">Pendiente</option>
                <option value="approved">Aprobada</option>
                <option value="rejected">Rechazada</option>
                <option value="cancelled">Cancelada</option>
                <option value="in_progress">En Progreso</option>
              </select>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prioridad
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={selectedPriority}
                onChange={(e) => handlePriorityFilter(e.target.value as RequestPriority | '')}
              >
                <option value="">Todas las prioridades</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedStatus('');
                  setSelectedDepartment('');
                  setSelectedPriority('');
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

      {/* Lista de solicitudes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Lista de Solicitudes</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {requests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron solicitudes</p>
              <p className="text-gray-400 text-sm mt-2">
                {searchTerm || selectedStatus || selectedDepartment || selectedPriority
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'Comienza agregando una nueva solicitud'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Solicitud #{request.id.slice(-6)}
                        </h3>
                        <Badge variant={getStatusBadgeVariant(request.status)}>
                          {getStatusText(request.status)}
                        </Badge>
                        <Badge variant={getPriorityBadgeVariant(request.priority)}>
                          {getPriorityText(request.priority)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Empleado:</span> {getEmployeeName(request.employeeId)}
                        </div>
                        <div>
                          <span className="font-medium">Licencia:</span> {getLicenseTypeName(request.licenseTypeId)}
                        </div>
                        <div>
                          <span className="font-medium">Departamento:</span> {getDepartmentName(request.departmentId)}
                        </div>
                        <div>
                          <span className="font-medium">Cantidad:</span> {request.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Fecha de solicitud:</span> {format(request.requestDate, 'dd/MM/yyyy', { locale: es })}
                        </div>
                        <div>
                          <span className="font-medium">Período:</span> {format(request.startDate, 'dd/MM/yyyy', { locale: es })} - {format(request.endDate, 'dd/MM/yyyy', { locale: es })}
                        </div>
                        <div>
                          <span className="font-medium">Motivo:</span> {request.reason}
                        </div>
                        {/* {request.estimatedCost && (
                          <div>
                            <span className="font-medium">Costo estimado:</span> ${request.estimatedCost}
                          </div>
                        )} */}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleApprove(request)}
                            variant="outline"
                            size="sm"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            Aprobar
                          </Button>
                          <Button
                            onClick={() => handleReject(request)}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Rechazar
                          </Button>
                        </>
                      )}
                      <Button
                        onClick={() => openForm(request)}
                        variant="outline"
                        size="sm"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDelete(request)}
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
