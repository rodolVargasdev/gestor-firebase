import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Eye, 
  Users,
  Building,
  Calendar,
  Mail,
  Phone,
  Filter,
  Search,
  UserPlus,
  UserCheck,
  UserX
} from 'lucide-react';

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  hireDate: Date;
  salary: number;
  status: 'active' | 'inactive' | 'on_leave';
  gender: 'male' | 'female' | 'other';
  birthDate: Date;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Datos de ejemplo para empleados
const SAMPLE_EMPLOYEES: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@empresa.com',
    phone: '+502 1234-5678',
    position: 'Desarrollador Senior',
    department: 'Tecnología',
    hireDate: new Date('2022-03-15'),
    salary: 8500,
    status: 'active',
    gender: 'female',
    birthDate: new Date('1990-05-20'),
    address: 'Zona 10, Ciudad de Guatemala',
    emergencyContact: {
      name: 'Carlos González',
      phone: '+502 9876-5432',
      relationship: 'Esposo'
    },
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Juan',
    lastName: 'Rodríguez',
    email: 'juan.rodriguez@empresa.com',
    phone: '+502 2345-6789',
    position: 'Analista de Recursos Humanos',
    department: 'Recursos Humanos',
    hireDate: new Date('2021-08-10'),
    salary: 7200,
    status: 'active',
    gender: 'male',
    birthDate: new Date('1988-12-03'),
    address: 'Zona 15, Ciudad de Guatemala',
    emergencyContact: {
      name: 'Ana Rodríguez',
      phone: '+502 8765-4321',
      relationship: 'Esposa'
    },
    createdAt: new Date('2021-08-10'),
    updatedAt: new Date('2024-02-20')
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Carmen',
    lastName: 'López',
    email: 'carmen.lopez@empresa.com',
    phone: '+502 3456-7890',
    position: 'Contadora',
    department: 'Finanzas',
    hireDate: new Date('2023-01-20'),
    salary: 6800,
    status: 'active',
    gender: 'female',
    birthDate: new Date('1992-07-14'),
    address: 'Zona 7, Ciudad de Guatemala',
    emergencyContact: {
      name: 'Roberto López',
      phone: '+502 7654-3210',
      relationship: 'Padre'
    },
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2024-03-10')
  },
  {
    id: '4',
    employeeId: 'EMP004',
    firstName: 'Luis',
    lastName: 'Martínez',
    email: 'luis.martinez@empresa.com',
    phone: '+502 4567-8901',
    position: 'Gerente de Ventas',
    department: 'Ventas',
    hireDate: new Date('2020-11-05'),
    salary: 9200,
    status: 'active',
    gender: 'male',
    birthDate: new Date('1985-03-28'),
    address: 'Zona 14, Ciudad de Guatemala',
    emergencyContact: {
      name: 'Patricia Martínez',
      phone: '+502 6543-2109',
      relationship: 'Esposa'
    },
    createdAt: new Date('2020-11-05'),
    updatedAt: new Date('2024-01-30')
  },
  {
    id: '5',
    employeeId: 'EMP005',
    firstName: 'Sofia',
    lastName: 'Hernández',
    email: 'sofia.hernandez@empresa.com',
    phone: '+502 5678-9012',
    position: 'Diseñadora UX/UI',
    department: 'Tecnología',
    hireDate: new Date('2023-06-12'),
    salary: 7500,
    status: 'on_leave',
    gender: 'female',
    birthDate: new Date('1995-09-18'),
    address: 'Zona 13, Ciudad de Guatemala',
    emergencyContact: {
      name: 'Miguel Hernández',
      phone: '+502 5432-1098',
      relationship: 'Hermano'
    },
    createdAt: new Date('2023-06-12'),
    updatedAt: new Date('2024-04-05')
  }
];

// Departamentos de ejemplo
const DEPARTMENTS = [
  'Tecnología',
  'Recursos Humanos',
  'Finanzas',
  'Ventas',
  'Marketing',
  'Operaciones',
  'Legal',
  'Administración'
];

export const EmployeesPage: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Simular carga de datos
  useEffect(() => {
    const loadEmployees = () => {
      setEmployees(SAMPLE_EMPLOYEES);
      setLoading(false);
    };

    setTimeout(loadEmployees, 1000); // Simular delay de carga
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const employeeId = employee.employeeId.toLowerCase();
    const email = employee.email.toLowerCase();
    const position = employee.position.toLowerCase();
    
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) ||
                         employeeId.includes(searchTerm.toLowerCase()) ||
                         email.includes(searchTerm.toLowerCase()) ||
                         position.includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus;

    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <UserCheck className="h-4 w-4 text-green-600" />;
      case 'inactive': return <UserX className="h-4 w-4 text-red-600" />;
      case 'on_leave': return <Calendar className="h-4 w-4 text-yellow-600" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'inactive': return 'Inactivo';
      case 'on_leave': return 'En Licencia';
      default: return status;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'inactive': return 'secondary';
      case 'on_leave': return 'outline';
      default: return 'default';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(amount);
  };

  const handleCreateNew = () => {
    navigate('/employees/new');
  };

  const handleEdit = (id: string) => {
    navigate(`/employees/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/employees/view/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando empleados...</p>
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
                <Users className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Gestión de Empleados
                </h1>
              </div>
            </div>
            <Button
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Empleado
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
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{employees.length}</div>
                <p className="text-xs text-muted-foreground">
                  Empleados registrados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activos</CardTitle>
                <UserCheck className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {employees.filter(e => e.status === 'active').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Empleados activos
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">En Licencia</CardTitle>
                <Calendar className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {employees.filter(e => e.status === 'on_leave').length}
                </div>
                <p className="text-xs text-muted-foreground">
                  En permiso temporal
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
                <Building className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {new Set(employees.map(e => e.department)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Departamentos activos
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nombre, ID, email o cargo..."
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
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
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
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                    <option value="on_leave">En Licencia</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Employees Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="outline" className="text-blue-600 border-blue-600">
                          {employee.employeeId}
                        </Badge>
                        <Badge variant={getStatusBadgeVariant(employee.status)}>
                          {getStatusLabel(employee.status)}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">
                        {employee.firstName} {employee.lastName}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {employee.position}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{employee.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{employee.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Building className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{employee.department}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">
                        Contratado: {formatDate(employee.hireDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Salario:</span>
                      <span className="font-medium">{formatCurrency(employee.salary)}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(employee.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(employee.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(employee.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      {getStatusIcon(employee.status)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEmployees.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron empleados
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterDepartment !== 'all' || filterStatus !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda.'
                  : 'Aún no hay empleados registrados.'}
              </p>
              <Button onClick={handleCreateNew}>
                <UserPlus className="h-4 w-4 mr-2" />
                Registrar primer empleado
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
