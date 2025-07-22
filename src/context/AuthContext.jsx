import { createContext, useContext, useState, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
        try {
            const decoded = jwtDecode(token);
            setUser(decoded);
        } catch (error) {
            console.error('Invalid token', error);
        }
        }
        setLoading(false);
    }, []);
    
    const login = async (username, password) => {
        try {
        const response = await authAPI.login({ username, password });

        const token = response.data.access_token || response.data.token;
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token);
        setUser(decoded);
        return { success: true, role: decoded.role };
        } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: error.response?.data?.message || 'Login failed'};
        }
    };
    
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        // Optionally call backend logout
        authAPI.logout().catch(() => {
            // Ignore errors on logout
        });
    };
    
    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
    }

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}