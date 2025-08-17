import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import apiClient from '../services/apiClient';
import { jwtDecode } from 'jwt-decode'; 

// --- Type Definitions ---

interface User {
  user_id: number;
  email: string;
  full_name: string;
  role: 'doctor' | 'nurse' | 'admin';
}

interface DecodedToken {
  sub: string; // Subject (email)
  exp: number; // Expiration time
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// --- Context Creation ---

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Auth Provider Component ---

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const decodedToken: DecodedToken = jwtDecode(token);
          // Check if token is expired
          if (decodedToken.exp * 1000 < Date.now()) {
            logout();
          } else {
            // In a real app, you would fetch user details from a '/users/me' endpoint
            // For now, we'll decode the user info we can from the token
            // This is a simplification; the backend doesn't currently put full user details in the token
            setUser({
                // This is placeholder data until you create a /me endpoint
                user_id: 0, 
                email: decodedToken.sub,
                full_name: 'User', // Placeholder
                role: 'doctor' // Placeholder, you'd get this from a /me endpoint
            });
          }
        } catch (error) {
          console.error("Invalid token:", error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
    // Optionally redirect to login page
    window.location.href = '/login';
  };

  const contextValue = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// --- Custom Hook ---

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
