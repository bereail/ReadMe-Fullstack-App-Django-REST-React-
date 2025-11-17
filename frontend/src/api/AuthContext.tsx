import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { login as loginRequest, LoginPayload } from '../api/auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('access');
    if (stored) {
      setAccessToken(stored);
    }
  }, []);

  const isAuthenticated = !!accessToken;

  async function login(payload: LoginPayload) {
    const data = await loginRequest(payload);
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    setAccessToken(data.access);
  }

  function logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setAccessToken(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
