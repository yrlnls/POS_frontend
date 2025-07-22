import { createContext, useContext, useState, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

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
        // Mock users for testing login without API
        const mockUsers = [
            { username: 'admin', password: 'admin123', role: 'admin' },
            { username: 'sales1', password: 'sales123', role: 'sales' },
            { username: 'tech1', password: 'tech123', role: 'tech' },
            { username: 'customer1', password: 'customer123', role: 'customer' },
        ];

        // Commented out real API call for testing with mock data
        /*
        try {
            const response = await axios.post('http://127.0.0.1:5555/api/auth/login', { 
                username, 
                password 
            });

            localStorage.setItem('token', response.data.access_token);
            const decoded = jwtDecode(response.data.access_token);
            setUser(decoded);
            return { success: true, role: decoded.role };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, message: error.response?.data?.message || 'Login failed'};
        }
        */

        // Check credentials against mock users
        const user = mockUsers.find(u => u.username === username && u.password === password);
        if (user) {
            // Set user state with mock user data
            setUser({ username: user.username, role: user.role });
            // Optionally set a mock token in localStorage
            localStorage.setItem('token', 'mock-token');
            return { success: true, role: user.role };
        } else {
            return { success: false, message: 'Invalid username or password' };
        }
    };
    
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
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
