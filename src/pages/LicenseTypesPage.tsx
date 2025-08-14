import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Settings,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  Filter,
  Search
} from 'lucide-react';
import { LICENSE_CONFIGS } from '../types';

interface LicenseType {
  id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  periodControl: 'monthly' | 'quarterly' | 'annual' | 'none';
  unitControl: 'hours' | 'days' | 'uses';
  totalAvailable: number;
  maxDaysPerRequest?: number;
  requiresJustification: boolean;
  hasSalary: boolean;
  isAccumulable: boolean;
  isTransferable: boolean;
  genderRestriction?: 'male' | 'female' | 'both';
  minSeniority?: number;
  minAge?: number;
  maxAge?: number;
  departmentRestriction?: string[];
  positionRestriction?: string[];
  personalTypeRestriction?: string[];
  autoRenewal: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const LicenseTypesPage: React.FC = () => {
  const navigate = useNavigate();
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Simular carga de datos
  useEffect(() => {
    const loadLicenseTypes = () => {
      // Convertir LICENSE_CONFIGS a array de LicenseType
      const types: LicenseType[] = Object.entries(LICENSE_CONFIGS).map(([key, config]) => ({
        id: key,
        code: config.code,
        name: config.name,
        description: config.description || '',
        category: config.category,
        periodControl: config.periodControl,
        unitControl: config.unitControl,
        totalAvailable: config.totalAvailable,
        maxDaysPerRequest: config.maxDaysPerRequest || 0,
        requiresJustification: config.requiresJustification,
        hasSalary: config.hasSalary,
        isAccumulable: config.isAccumulable,
        isTransferable: config.isTransferable,
        genderRestriction: config.genderRestriction,
        minSeniority: config.minSeniority || 0,
        minAge: config.minAge || 0,
        maxAge: config.maxAge || 0,
        departmentRestriction: config.departmentRestriction || [],
        positionRestriction: config.positionRestriction || [],
        personalTypeRestriction: config.personalTypeRestriction || [],
        autoRenewal: config.autoRenewal,
        isActive: config.isActive,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      setLicenseTypes(types);
      setLoading(false);
    };

    setTimeout(loadLicenseTypes, 1000); // Simular delay de carga
  }, []);

  const filteredLicenseTypes = licenseTypes.filter(type => {
    // Verificar que las propiedades existan antes de usar toLowerCase()
    const name = type.name || '';
    const code = type.code || '';
    const description = type.description || '';
    
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || type.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && type.isActive) ||
                         (filterStatus === 'inactive' && !type.isActive);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getPeriodControlIcon = (period: string) => {
    switch (period) {
      case 'monthly': return <Calendar className="h-4 w-4" />;
      case 'quarterly': return <Calendar className="h-4 w-4" />;
      case 'annual': return <Calendar className="h-4 w-4" />;
      case 'none': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPeriodControlLabel = (period: string) => {
    switch (period) {
      case 'monthly': return 'Mensual';
      case 'quarterly': return 'Trimestral';
      case 'annual': return 'Anual';
      case 'none': return 'Sin período';
      default: return period;
    }
  };

  const getUnitControlLabel = (unit: string) => {
    switch (unit) {
      case 'hours': return 'Horas';
      case 'days': return 'Días';
      case 'uses': return 'Usos';
      default: return unit;
    }
  };

  const handleCreateNew = () => {
    navigate('/license-types/new');
  };

  const handleEdit = (id: string) => {
    navigate(`/license-types/edit/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/license-types/view/${id}`);
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este tipo de licencia?')) {
      setLicenseTypes(prev => prev.filter(type => type.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando tipos de licencia...</p>
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
                <Settings className="h-6 w-6 text-purple-600" />
                <h1 className="text-xl font-semibold text-gray-900">
                  Gestión de Tipos de Licencia
                </h1>
              </div>
            </div>
            <Button
              onClick={handleCreateNew}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Tipo
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
                <CardTitle className="text-sm font-medium">Total Tipos</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{licenseTypes.length}</div>
                <p className="text-xs text-muted-foreground">
                  Tipos de licencia configurados
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Activos</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {licenseTypes.filter(t => t.isActive).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Tipos disponibles
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Con Salario</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {licenseTypes.filter(t => t.hasSalary).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Con goce de salario
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Renovación Auto</CardTitle>
                <Calendar className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {licenseTypes.filter(t => t.autoRenewal).length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Renovación automática
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
                      placeholder="Buscar por nombre, código o descripción..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                                      <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    >
                      <option value="all">Todas las categorías</option>
                      <option value="Personal">Personal</option>
                      <option value="Enfermedad">Enfermedad</option>
                      <option value="Familiar">Familiar</option>
                      <option value="Maternidad">Maternidad</option>
                      <option value="Administrativa">Administrativa</option>
                    </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  >
                    <option value="all">Todos los estados</option>
                    <option value="active">Activos</option>
                    <option value="inactive">Inactivos</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* License Types Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLicenseTypes.map((licenseType) => (
              <Card key={licenseType.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={licenseType.isActive ? "default" : "secondary"}>
                          {licenseType.code}
                        </Badge>
                        {licenseType.hasSalary && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            Con Salario
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{licenseType.name}</CardTitle>
                      <CardDescription className="mt-2">
                        {licenseType.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Período:</span>
                      <div className="flex items-center space-x-1">
                        {getPeriodControlIcon(licenseType.periodControl)}
                        <span>{getPeriodControlLabel(licenseType.periodControl)}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Unidad:</span>
                      <span>{getUnitControlLabel(licenseType.unitControl)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Disponible:</span>
                      <span className="font-medium">{licenseType.totalAvailable}</span>
                    </div>
                    {licenseType.maxDaysPerRequest && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Máx. por solicitud:</span>
                        <span className="font-medium">{licenseType.maxDaysPerRequest}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Justificación:</span>
                      <span className={licenseType.requiresJustification ? "text-red-600" : "text-green-600"}>
                        {licenseType.requiresJustification ? "Requerida" : "No requerida"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleView(licenseType.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(licenseType.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(licenseType.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-xs text-gray-500">
                      {licenseType.isActive ? (
                        <span className="text-green-600">● Activo</span>
                      ) : (
                        <span className="text-gray-400">● Inactivo</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredLicenseTypes.length === 0 && (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron tipos de licencia
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || filterCategory !== 'all' || filterStatus !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda.'
                  : 'Aún no hay tipos de licencia configurados.'}
              </p>
              <Button onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-2" />
                Crear primer tipo de licencia
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
