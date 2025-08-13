import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import type { User } from '../types';

export class AuthService {
  static async loginWithEmail(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Obtener datos del usuario desde Firestore
      const userData = await this.getUserData(firebaseUser.uid);
      
      if (!userData) {
        throw new Error('Usuario no encontrado en la base de datos');
      }
      
      return userData;
    } catch (error: any) {
      console.error('Error en loginWithEmail:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async loginWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseUser = userCredential.user;
      
      // Verificar si el usuario existe en Firestore
      let userData = await this.getUserData(firebaseUser.uid);
      
      if (!userData) {
        // Crear nuevo usuario en Firestore
        userData = await this.createUserFromGoogle(firebaseUser);
      }
      
      return userData;
    } catch (error: any) {
      console.error('Error en loginWithGoogle:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  static async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Error en logout:', error);
      throw new Error('Error al cerrar sesión');
    }
  }

  static async getUserData(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      
      if (userDoc.exists()) {
        return this.mapDocumentToUser(userDoc.data());
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      return null;
    }
  }

  static async getUserDataByEmail(email: string): Promise<User | null> {
    try {
      // Buscar usuario por email (esto requeriría un índice en Firestore)
      // Por simplicidad, asumimos que el email es único
      const userDoc = await getDoc(doc(db, 'users', email));
      
      if (userDoc.exists()) {
        return this.mapDocumentToUser(userDoc.data());
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener datos del usuario por email:', error);
      return null;
    }
  }

  private static async createUserFromGoogle(firebaseUser: FirebaseUser): Promise<User> {
    try {
      // Parsear nombre completo
      const fullName = firebaseUser.displayName || '';
      const nameParts = fullName.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
        email: firebaseUser.email || '',
        firstName,
        lastName,
        avatar: firebaseUser.photoURL || undefined,
        phone: firebaseUser.phoneNumber || undefined,
        role: 'viewer', // Rol por defecto
        isActive: true,
      };

      // Crear documento en Firestore
      const userRef = doc(db, 'users', firebaseUser.uid);
      await setDoc(userRef, {
        ...userData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      return {
        id: firebaseUser.uid,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error('Error al crear usuario desde Google:', error);
      throw new Error('Error al crear usuario');
    }
  }

  private static mapDocumentToUser(docData: any): User {
    return {
      id: docData.id || '',
      email: docData.email || '',
      firstName: docData.firstName || '',
      lastName: docData.lastName || '',
      avatar: docData.avatar || undefined,
      phone: docData.phone || undefined,
      role: docData.role || 'viewer',
      departmentId: docData.departmentId || undefined,
      isActive: docData.isActive ?? true,
      createdAt: docData.createdAt?.toDate() || new Date(),
      updatedAt: docData.updatedAt?.toDate() || new Date(),
    };
  }

  private static getErrorMessage(errorCode: string): string {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-email': 'Email inválido',
      'auth/user-disabled': 'Usuario deshabilitado',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/popup-closed-by-user': 'Inicio de sesión cancelado',
      'auth/cancelled-popup-request': 'Inicio de sesión cancelado',
      'auth/popup-blocked': 'Popup bloqueado. Permite popups para este sitio',
      'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este email',
      'auth/operation-not-allowed': 'Operación no permitida',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/invalid-api-key': 'Error de configuración del sistema',
    };

    return errorMessages[errorCode] || 'Error desconocido durante el inicio de sesión';
  }

  // Método para escuchar cambios en el estado de autenticación
  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userData = await this.getUserData(firebaseUser.uid);
          callback(userData);
        } catch (error) {
          console.error('Error al obtener datos del usuario:', error);
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }
}
