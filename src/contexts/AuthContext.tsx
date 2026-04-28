import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, signInAnonymously, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'customer';
  isAnonymous: boolean;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  loginGoogle: () => Promise<void>;
  loginGuest: () => Promise<void>;
  loginEmail: (email: string, pass: string) => Promise<void>;
  signupEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          let role: 'admin' | 'customer' = 'customer';
          
          if (userDoc.exists()) {
            role = userDoc.data().role as 'admin' | 'customer';
          } else {
            // Check if admin email
            const isAdmin = firebaseUser.email === 'diwashmessi9@gmail.com' || firebaseUser.email === 'bibekthapaliya001@gmail.com';
            role = isAdmin ? 'admin' : 'customer';
            
            // Create user profile
            await setDoc(userDocRef, {
              role,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || '',
              phone: '',
              createdAt: serverTimestamp()
            });
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role,
            isAnonymous: firebaseUser.isAnonymous
          });
        } catch (error) {
          console.error("Firestore permission error on users collection. Please update Firestore Rules.");
          
          // Fallback to allow login even if Firestore rules are not set up yet
          const isAdmin = firebaseUser.email === 'diwashmessi9@gmail.com' || firebaseUser.email === 'bibekthapaliya001@gmail.com';
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: isAdmin ? 'admin' : 'customer',
            isAnonymous: firebaseUser.isAnonymous
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const loginGuest = async () => {
    await signInAnonymously(auth);
  };
  
  const loginEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const signupEmail = async (email: string, pass: string) => {
    await createUserWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginGoogle, loginGuest, loginEmail, signupEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
