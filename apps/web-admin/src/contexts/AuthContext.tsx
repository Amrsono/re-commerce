"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut, 
    updateProfile,
    User as FirebaseUser
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type UserRole = "CUSTOMER" | "ADMIN" | "ENGINEER" | null;

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, pass: string, redirectTo?: string) => Promise<void>;
    register: (name: string, email: string, pass: string, redirectTo?: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // Fetch additional user data (like role) from Firestore
                const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
                const userData = userDoc.data();

                setUser({
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
                    email: firebaseUser.email || "",
                    role: (userData?.role as UserRole) || "CUSTOMER"
                });
            } else {
                setUser(null);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, pass: string, redirectTo?: string) => {
        console.log(`[Auth] Attempting Firebase login for: ${email}`);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, pass);
            const firebaseUser = userCredential.user;
            
            // Get role from Firestore
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
            const role = userDoc.data()?.role || "CUSTOMER";

            const dest = role === "ADMIN" ? "/admin" : (redirectTo || "/profile");
            console.log(`[Auth] Redirecting to: ${dest}`);
            router.push(dest);
        } catch (error: any) {
            console.error("[Auth] Login failed:", error.message);
            alert(`Login failed: ${error.message}`);
        }
    };

    const register = async (name: string, email: string, pass: string, redirectTo?: string) => {
        console.log(`[Auth] Attempting Firebase registration for: ${email}`);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
            const firebaseUser = userCredential.user;

            // Set display name
            await updateProfile(firebaseUser, { displayName: name });

            // Create user document in Firestore with default role
            const role = email === "admin@test.com" ? "ADMIN" : "CUSTOMER";
            await setDoc(doc(db, "users", firebaseUser.uid), {
                name,
                email,
                role,
                createdAt: new Date().toISOString()
            });

            const dest = role === "ADMIN" ? "/admin" : (redirectTo || "/assess");
            router.push(dest);
        } catch (error: any) {
            console.error("[Auth] Registration failed:", error.message);
            alert(`Registration failed: ${error.message}`);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            router.push("/");
        } catch (error: any) {
            console.error("[Auth] Logout failed:", error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
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
