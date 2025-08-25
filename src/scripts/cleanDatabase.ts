import { db } from '../lib/firebase';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';

/**
 * Script para limpiar la base de datos
 * Elimina datos innecesarios y deja solo empleados básicos
 */
export async function cleanDatabase() {
  console.log('🧹 Iniciando limpieza de base de datos...');
  
  try {
    const batch = writeBatch(db);
    let deletedCount = 0;

    // 1. Limpiar colección de empleados (mantener solo estructura básica)
    console.log('📋 Limpiando empleados...');
    const employeesSnapshot = await getDocs(collection(db, 'employees'));
    
    for (const employeeDoc of employeesSnapshot.docs) {
      const employeeData = employeeDoc.data();
      
      // Mantener solo campos esenciales
      const cleanEmployee = {
        id: employeeData.id,
        employeeId: employeeData.employeeId,
        firstName: employeeData.firstName,
        lastName: employeeData.lastName,
        email: employeeData.email,
        phone: employeeData.phone || '',
        position: employeeData.position,
        department: employeeData.department,
        employeeType: employeeData.employeeType || 'operativo',
        hireDate: employeeData.hireDate,
        salary: employeeData.salary || 0,
        gender: employeeData.gender || 'other',
        birthDate: employeeData.birthDate || new Date(),
        address: employeeData.address || '',
        personalType: employeeData.personalType || 'full-time',
        emergencyContact: employeeData.emergencyContact || {
          name: '',
          phone: '',
          relationship: ''
        },
        isActive: employeeData.isActive !== undefined ? employeeData.isActive : true,
        createdAt: employeeData.createdAt || new Date(),
        updatedAt: new Date()
      };

      // Actualizar documento con datos limpios
      batch.update(doc(db, 'employees', employeeDoc.id), cleanEmployee);
      deletedCount++;
    }

    // 2. Eliminar colecciones que no vamos a usar
    const collectionsToDelete = [
      'licenseTypes',
      'licenseRequests', 
      'licenseHistory',
      'availability',
      'notifications',
      'auditLogs'
    ];

    for (const collectionName of collectionsToDelete) {
      console.log(`🗑️ Eliminando colección: ${collectionName}`);
      try {
        const snapshot = await getDocs(collection(db, collectionName));
        for (const doc of snapshot.docs) {
          batch.delete(doc.ref);
          deletedCount++;
        }
      } catch (error) {
        console.log(`⚠️ Colección ${collectionName} no existe o ya fue eliminada`);
      }
    }

    // 3. Ejecutar todas las operaciones
    await batch.commit();
    
    console.log(`✅ Limpieza completada exitosamente!`);
    console.log(`📊 Documentos procesados: ${deletedCount}`);
    console.log(`🎯 Base de datos lista para implementar sistema de licencias`);
    
    return {
      success: true,
      deletedCount,
      message: 'Base de datos limpiada exitosamente'
    };

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    throw error;
  }
}

/**
 * Función para verificar el estado de la base de datos
 */
export async function checkDatabaseStatus() {
  console.log('🔍 Verificando estado de la base de datos...');
  
  try {
    const collections = ['employees'];
    const status: any = {};

    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      status[collectionName] = {
        count: snapshot.size,
        documents: snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
      };
    }

    console.log('📊 Estado actual de la base de datos:');
    console.log(JSON.stringify(status, null, 2));
    
    return status;

  } catch (error) {
    console.error('❌ Error verificando estado:', error);
    throw error;
  }
}

/**
 * Función para crear empleados de prueba limpios
 */
export async function createTestEmployees() {
  console.log('👥 Creando empleados de prueba...');
  
  try {
    const testEmployees = [
      {
        employeeId: 'EMP001',
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan.perez@empresa.com',
        phone: '7777-1234',
        position: 'Desarrollador Senior',
        department: 'Tecnología',
        employeeType: 'operativo',
        hireDate: new Date('2024-01-15'),
        salary: 2500,
        gender: 'male',
        birthDate: new Date('1990-05-20'),
        address: 'San Salvador',
        personalType: 'full-time',
        emergencyContact: {
          name: 'María Pérez',
          phone: '7777-5678',
          relationship: 'Esposa'
        },
        isActive: true
      },
      {
        employeeId: 'EMP002',
        firstName: 'Ana',
        lastName: 'González',
        email: 'ana.gonzalez@empresa.com',
        phone: '7777-2345',
        position: 'Analista de Recursos Humanos',
        department: 'Recursos Humanos',
        employeeType: 'administrativo',
        hireDate: new Date('2024-03-10'),
        salary: 2000,
        gender: 'female',
        birthDate: new Date('1988-12-15'),
        address: 'San Salvador',
        personalType: 'full-time',
        emergencyContact: {
          name: 'Carlos González',
          phone: '7777-6789',
          relationship: 'Esposo'
        },
        isActive: true
      },
      {
        employeeId: 'EMP003',
        firstName: 'Carlos',
        lastName: 'Rodríguez',
        email: 'carlos.rodriguez@empresa.com',
        phone: '7777-3456',
        position: 'Contador',
        department: 'Finanzas',
        employeeType: 'administrativo',
        hireDate: new Date('2024-02-20'),
        salary: 2200,
        gender: 'male',
        birthDate: new Date('1985-08-10'),
        address: 'San Salvador',
        personalType: 'full-time',
        emergencyContact: {
          name: 'Laura Rodríguez',
          phone: '7777-7890',
          relationship: 'Hermana'
        },
        isActive: true
      }
    ];

    const batch = writeBatch(db);
    
    for (const employee of testEmployees) {
      const docRef = doc(collection(db, 'employees'));
      batch.set(docRef, {
        ...employee,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await batch.commit();
    
    console.log(`✅ ${testEmployees.length} empleados de prueba creados exitosamente`);
    
    return {
      success: true,
      createdCount: testEmployees.length,
      message: 'Empleados de prueba creados exitosamente'
    };

  } catch (error) {
    console.error('❌ Error creando empleados de prueba:', error);
    throw error;
  }
}
