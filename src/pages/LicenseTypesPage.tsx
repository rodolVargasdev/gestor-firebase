import React from 'react';
import { LicenseTypeList } from '../components/licenses/LicenseTypeList';
import { LicenseTypeForm } from '../components/licenses/LicenseTypeForm';
import { useLicenseStore } from '../stores/licenseStore';

export const LicenseTypesPage: React.FC = () => {
  const { isFormOpen, closeForm, currentLicenseType } = useLicenseStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Gestión de Tipos de Licencias
        </h1>
        <p className="text-gray-600">
          Administra los diferentes tipos de licencias disponibles en el sistema.
        </p>
      </div>

      <LicenseTypeList />

      {/* Modal del formulario */}
      {isFormOpen && (
        <LicenseTypeForm
          licenseType={currentLicenseType || undefined}
          onClose={closeForm}
        />
      )}
    </div>
  );
};
