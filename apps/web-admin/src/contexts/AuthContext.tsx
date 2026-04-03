"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

type UserRole = "CUSTOMER" | "ADMIN" | null;

interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, pass: string, redirectTo?: string) => Promise<void>;
    register: (name: string, email: string, pass: string, redirectTo?: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Mock check for existing session
        const storedUser = localStorage.getItem("recommerce_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, pass: string, redirectTo?: string) => {
        console.log(`[Auth] Attempting login for: ${email}`);

        if (email === "admin@test.com" && pass !== "Password@26") {
            console.error("[Auth] Admin password mismatch");
            alert("Incorrect admin password.");
            return;
        }

        // Resolve the real DB user by fetching profile from API
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/profile/${encodeURIComponent(email)}`);
            const data = await res.json();

            let loggedInUser: User;

            if (data.success && data.user) {
                // Use the real DB ID and role
                loggedInUser = {
                    id: data.user.id,
                    name: data.user.name || email.split("@")[0],
                    email,
                    role: data.user.role as UserRole,
                };
                console.log(`[Auth] Resolved real DB user: id=${loggedInUser.id}, role=${loggedInUser.role}`);
            } else {
                // Fallback: user not in DB yet, use temporary mock
                console.warn(`[Auth] User not found in DB, using temporary ID`);
                const isAdmin = email === "admin@test.com";
                loggedInUser = {
                    id: isAdmin ? "1" : Date.now().toString(),
                    name: email.split("@")[0],
                    email,
                    role: isAdmin ? "ADMIN" : "CUSTOMER",
                };
            }

            setUser(loggedInUser);
            localStorage.setItem("recommerce_user", JSON.stringify(loggedInUser));
            const dest = loggedInUser.role === "ADMIN" ? "/admin" : (redirectTo || "/profile");
            console.log(`[Auth] Redirecting to: ${dest}`);
            router.push(dest);
        } catch (err) {
            console.error("[Auth] Failed to fetch user profile:", err);
            // Fallback to basic mock if API is down
            const isAdmin = email === "admin@test.com";
            const loggedInUser: User = {
                id: isAdmin ? "1" : "2",
                name: email.split("@")[0],
                email,
                role: isAdmin ? "ADMIN" : "CUSTOMER",
            };
            setUser(loggedInUser);
            localStorage.setItem("recommerce_user", JSON.stringify(loggedInUser));
            router.push(isAdmin ? "/admin" : (redirectTo || "/profile"));
        }
    };

    const register = (name: string, email: string, pass: string, redirectTo?: string) => {
        // Mock registration logic
        const newUser: User = { id: Date.now().toString(), name, email, role: "CUSTOMER" };
        setUser(newUser);
        localStorage.setItem("recommerce_user", JSON.stringify(newUser));
        router.push(redirectTo || "/assess");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("recommerce_user");
        router.push("/");
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
