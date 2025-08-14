import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Calendar,
  User,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Eye,
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  calculateLicenseBalance, 
  generateBalanceMessage, 
  getBalanceStatusColor,
  type LicenseBalance 
} from '../utils/licenseUtils';

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'on_leave';
  hireDate: Date;
}

interface LicenseType {
  id: string;
  name: string;
  code: string;
  category: string;
  unitControl: 'days' | 'hours' | 'uses';
  periodControl: 'annual' | 'monthly' | 'quarterly' | 'none';
  totalAvailable: number;
  maxDaysPerRequest: number;
  isActive: boolean;
}

interface EmployeeAvailability {
  employeeId: string;
  employeeName: string;
  employeeDepartment: string;
  licenseTypeId: string;
  licenseTypeName: string;
  licenseTypeCode: string;
  totalAvailable: number;
  used: number;
  available: number;
  pending: number;
  lastUpdated: Date;
  periodStart: Date;
  periodEnd: Date;
  status: 'available' | 'low' | 'exhausted' | 'pending';
  balance: LicenseBalance;
}

// Datos de ejemplo
const SAMPLE_EMPLOYEES: Employee[] = [
  { id: '1', employeeId: 'EMP0001', firstName: 'María', lastName: 'González', email: 'maria.gonzalez@empresa.com', department: 'Tecnología', position: 'Desarrollador Senior', status: 'active', hireDate: new Date('2022-03-15') },
  { id: '2', employeeId: 'EMP0002', firstName: 'Juan', lastName: 'Rodríguez', email: 'juan.rodriguez@empresa.com', department: 'Recursos Humanos', position: 'Analista de RH', status: 'active', hireDate: new Date('2021-08-10') },
  { id: '3', employeeId: 'EMP0003', firstName: 'Carmen', lastName: 'López', email: 'carmen.lopez@empresa.com', department: 'Finanzas', position: 'Contadora', status: 'active', hireDate: new Date('2023-01-20') },
  { id: '4', employeeId: 'EMP0004', firstName: 'Luis', lastName: 'Martínez', email: 'luis.martinez@empresa.com', department: 'Ventas', position: 'Gerente de Ventas', status: 'active', hireDate: new Date('2020-11-05') },
  { id: '5', employeeId: 'EMP0005', firstName: 'Sofia', lastName: 'Hernández', email: 'sofia.hernandez@empresa.com', department: 'Tecnología', position: 'Diseñadora UX/UI', status: 'active', hireDate: new Date('2023-06-12') }
];

const SAMPLE_LICENSE_TYPES: LicenseType[] = [
  { id: 'LT001', name: 'Vacaciones Anuales', code: 'VAC', category: 'Personal', unitControl: 'days', periodControl: 'annual', totalAvailable: 15, maxDaysPerRequest: 15, isActive: true },
  { id: 'LT002', name: 'Licencia por Enfermedad', code: 'ENF', category: 'Enfermedad', unitControl: 'days', periodControl: 'annual', totalAvailable: 30, maxDaysPerRequest: 30, isActive: true },
  { id: 'LT003', name: 'Licencia Personal', code: 'PER', category: 'Personal', unitControl: 'days', periodControl: 'annual', totalAvailable: 5, maxDaysPerRequest: 3, isActive: true },
  { id: 'LT004', name: 'Licencia por Maternidad', code: 'MAT', category: 'Maternidad', unitControl: 'days', periodControl: 'none', totalAvailable: 84, maxDaysPerRequest: 84, isActive: true },
  { id: 'LT005', name: 'Licencia por Paternidad', code: 'PAT', category: 'Familiar', unitControl: 'days', periodControl: 'none', totalAvailable: 10, maxDaysPerRequest: 10, isActive: true },
  { id: 'LT006', name: 'Licencia Administrativa', code: 'ADM', category: 'Administrativa', unitControl: 'hours', periodControl: 'monthly', totalAvailable: 40, maxDaysPerRequest: 8, isActive: true }
];

// Generar disponibilidad de ejemplo
const generateSampleAvailability = (): EmployeeAvailability[] => {
  const availability: EmployeeAvailability[] = [];
  
  SAMPLE_EMPLOYEES.forEach(employee => {
    SAMPLE_LICENSE_TYPES.forEach(licenseType => {
      // Generar datos aleatorios pero realistas
      const usedCurrent = Math.floor(Math.random() * licenseType.totalAvailable);
      const usedPrevious = Math.floor(Math.random() * 3); // Licencias usadas del período anterior
      const pending = Math.floor(Math.random() * 5);
      
             // Calcular balance usando las utilidades
       const balance = calculateLicenseBalance(
         licenseType.periodControl,
         licenseType.totalAvailable,
         usedCurrent,
         usedPrevious,
         5, // maxCarryOver: máximo 5 días transferibles
         0  // maxAccumulation: 0 = sin límite de acumulación
       );
      
      let status: 'available' | 'low' | 'exhausted' | 'pending';
      if (balance.available === 0) status = 'exhausted';
      else if (balance.available <= licenseType.totalAvailable * 0.2) status = 'low';
      else if (pending > 0) status = 'pending';
      else status = 'available';
      
      availability.push({
        employeeId: employee.employeeId,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        employeeDepartment: employee.department,
        licenseTypeId: licenseType.id,
        licenseTypeName: licenseType.name,
        licenseTypeCode: licenseType.code,
        totalAvailable: licenseType.totalAvailable,
        used: usedCurrent,
        available: balance.available,
        pending,
        lastUpdated: new Date(),
        periodStart: new Date(new Date().getFullYear(), 0, 1), // 1 de enero del año actual
        periodEnd: new Date(new Date().getFullYear(), 11, 31), // 31 de diciembre del año actual
        status,
        balance
      });
    });
  });
  
  return availability;
};

export const AvailabilityPage: React.FC = () => {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState<EmployeeAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLicenseType, setFilterLicenseType] = useState('all');

  // Simular carga de datos
  useEffect(() => {
    const loadData = () => {
      setAvailability(generateSampleAvailability());
      setLoading(false);
    };

    setTimeout(loadData, 1000);
  }, []);

  const filteredAvailability = availability.filter(item => {
    const employeeName = item.employeeName.toLowerCase();
    const employeeId = item.employeeId.toLowerCase();
    const licenseTypeName = item.licenseTypeName.toLowerCase();
    
    const matchesSearch = employeeName.includes(searchTerm.toLowerCase()) ||
                         employeeId.includes(searchTerm.toLowerCase()) ||
                         licenseTypeName.includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || item.employeeDepartment === filterDepartment;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesLicenseType = filterLicenseType === 'all' || item.licenseTypeId === filterLicenseType;

    return matchesSearch && matchesDepartment && matchesStatus && matchesLicenseType;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'low': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'exhausted': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-blue-600" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'low': return 'Baja Disponibilidad';
      case 'exhausted': return 'Agotado';
      case 'pending': return 'Pendiente';
      default: return status;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'available': return 'default';
      case 'low': return 'outline';
      case 'exhausted': return 'secondary';
      case 'pending': return 'outline';
      default: return 'default';
    }
  };

  const getProgressColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage <= 20) return 'bg-red-500';
    if (percentage <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setAvailability(generateSampleAvailability());
      setLoading(false);
    }, 1000);
  };

  const handleViewEmployee = (employeeId: string) => {
    // En el futuro, navegar a vista detallada del empleado
    console.log('Ver empleado:', employeeId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando disponibilidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Disponibilidad de Licencias
                </h1>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{SAMPLE_EMPLOYEES.length}</div>
                <p className="text-xs text-muted-foreground">
                  Empleados activos
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disponibilidad Baja</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {availability.filter(a => a.status === 'low').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Necesitan atención
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Agotados</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {availability.filter(a => a.status === 'exhausted').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Sin disponibilidad
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tipos de Licencia</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {SAMPLE_LICENSE_TYPES.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Configurados
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filtros</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por empleado o tipo de licencia..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Departamento
                  </label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="all">Todos los departamentos</option>
                    <option value="Tecnología">Tecnología</option>
                    <option value="Recursos Humanos">Recursos Humanos</option>
                    <option value="Finanzas">Finanzas</option>
                    <option value="Ventas">Ventas</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operaciones">Operaciones</option>
                    <option value="Legal">Legal</option>
                    <option value="Administración">Administración</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="available">Disponible</option>
                    <option value="low">Baja Disponibilidad</option>
                    <option value="exhausted">Agotado</option>
                    <option value="pending">Pendiente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Licencia
                  </label>
                  <select
                    value={filterLicenseType}
                    onChange={(e) => setFilterLicenseType(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="all">Todos los tipos</option>
                    {SAMPLE_LICENSE_TYPES.map(licenseType => (
                      <option key={licenseType.id} value={licenseType.id}>
                        {licenseType.code} - {licenseType.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Availability Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvailability.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          {item.employeeId}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(item.status)}>
                          {getStatusLabel(item.status)}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {item.employeeName}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {item.employeeDepartment}
                      </CardDescription>
                    </div>
                    <div className="text-xs text-gray-500">
                      {getStatusIcon(item.status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* License Type Info */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          {item.licenseTypeCode} - {item.licenseTypeName}
                        </span>
                      </div>
                      
                                             {/* Progress Bar */}
                       <div className="mb-2">
                         <div className="flex justify-between text-xs text-gray-600 mb-1">
                           <span>Disponible: {item.available}</span>
                           <span>Usado: {item.used}</span>
                         </div>
                         <div className="w-full bg-gray-200 rounded-full h-2">
                           <div 
                             className={`h-2 rounded-full ${getProgressColor(item.available, item.totalAvailable)}`}
                             style={{ width: `${(item.available / item.totalAvailable) * 100}%` }}
                           ></div>
                         </div>
                         <div className="flex justify-between text-xs text-gray-500 mt-1">
                           <span>Total: {item.totalAvailable}</span>
                           <span>{Math.round((item.available / item.totalAvailable) * 100)}%</span>
                         </div>
                       </div>
                       
                       {/* Balance Details */}
                       <div className="text-xs text-gray-600">
                         <div className="flex items-center space-x-1">
                           <Info className="h-3 w-3" />
                           <span className={getBalanceStatusColor(item.balance)}>
                             {generateBalanceMessage(item.balance)}
                           </span>
                         </div>
                                                   {item.balance.carriedOver > 0 && (
                            <div className="mt-1 text-blue-600">
                              <span className="font-medium">Transferido:</span> {item.balance.carriedOver} días
                              {item.balance.expiresAt && (
                                <span className="ml-1">
                                  (vence: {formatDate(item.balance.expiresAt)})
                                </span>
                              )}
                            </div>
                          )}
                          {item.balance.accumulated > 0 && (
                            <div className="mt-1 text-green-600">
                              <span className="font-medium">Acumulado:</span> {item.balance.accumulated} días
                              {item.balance.maxAccumulation > 0 && (
                                <span className="ml-1">
                                  (máximo {item.balance.maxAccumulation})
                                </span>
                              )}
                            </div>
                          )}
                       </div>
                      
                      {/* Pending Requests */}
                      {item.pending > 0 && (
                        <div className="flex items-center space-x-1 text-xs text-blue-600">
                          <Clock className="h-3 w-3" />
                          <span>{item.pending} solicitud(es) pendiente(s)</span>
                        </div>
                      )}
                    </div>

                    {/* Period Info */}
                    <div className="text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Período: {formatDate(item.periodStart)} - {formatDate(item.periodEnd)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 mt-1">
                        <span>Actualizado: {formatDate(item.lastUpdated)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewEmployee(item.employeeId)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalles
                      </Button>
                      
                      {/* Status Indicator */}
                      <div className="flex items-center space-x-1">
                        {item.status === 'low' && (
                          <TrendingDown className="h-4 w-4 text-yellow-600" />
                        )}
                        {item.status === 'exhausted' && (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        {item.status === 'available' && (
                          <TrendingUp className="h-4 w-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredAvailability.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron registros de disponibilidad
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterDepartment !== 'all' || filterStatus !== 'all' || filterLicenseType !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda.'
                  : 'Aún no hay datos de disponibilidad registrados.'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
