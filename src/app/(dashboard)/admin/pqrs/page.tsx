'use client';

import React from 'react';
import { AdminPQRSList } from '@/modules/pqrs/components/AdminPQRSList';

const PqrsAdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mb-4 bg-white shadow">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Administración de PQRS</h1>
          <p className="mt-2 text-gray-600">
            Gestiona las peticiones, quejas, reclamos y sugerencias de los usuarios
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <AdminPQRSList />
      </div>
    </div>
  );
};

export default PqrsAdminPage;
