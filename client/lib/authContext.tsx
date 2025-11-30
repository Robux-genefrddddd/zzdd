import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "./firebase";

interface UserData {
  id: string;
  email: string;
  createdAt: string;
  shareToken: string;
  storageUsed: number;
  storageLimit: number;
  plan: "free" | "pro";
}

// Storage limits per plan (in bytes)
export const STORAGE_LIMITS = {
  free: 1 * 1024 * 1024 * 1024, // 1 GB
  pro: 20 * 1024 * 1024 * 1024, // 20 GB
};

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  changePassword: (newPassword: string) => Promise<void>;
  regenerateShareToken: () => Promise<string>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Set up real-time listener for user data
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUserData(doc.data() as UserData);
          }
        });

        setLoading(false);
        return unsubscribeSnapshot;
      } else {
        setUser(null);
        setUserData(null);
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const generateShareToken = (): string => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  const register = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const shareToken = generateShareToken();

      // Create user document in Firestore
      await setDoc(doc(db, "users", result.user.uid), {
        id: result.user.uid,
        email: email,
        createdAt: new Date().toISOString(),
        shareToken: shareToken,
        plan: "free", // Default to free plan
        storageUsed: 0,
        storageLimit: STORAGE_LIMITS.free,
      });

      setUser(result.user);
    } catch (error) {
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
    } catch (error) {
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  const changePassword = async (newPassword: string) => {
    try {
      if (!auth.currentUser) throw new Error("No user logged in");
      await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      throw error;
    }
  };

  const regenerateShareToken = async (): Promise<string> => {
    try {
      if (!user) throw new Error("No user logged in");
      const newToken = generateShareToken();
      await updateDoc(doc(db, "users", user.uid), {
        shareToken: newToken,
      });
      setUserData((prev) => (prev ? { ...prev, shareToken: newToken } : null));
      return newToken;
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      if (!user) throw new Error("No user logged in");
      // Delete user document
      await deleteDoc(doc(db, "users", user.uid));
      // Delete Firebase Auth account
      await deleteUser(user);
      setUser(null);
      setUserData(null);
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        register,
        login,
        logout,
        resetPassword,
        changePassword,
        regenerateShareToken,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
