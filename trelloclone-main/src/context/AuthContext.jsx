import { createContext } from "react";
import axios from "axios";

const defaultAuthContext = {
  currentUser: null,
  activeBoardId: null,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  getConfig: () => ({ headers: {} }),
  fetchBoardData: async () => {},
};

export const AuthContext = createContext(defaultAuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [activeBoardId, setActiveBoardId] = useState(null);


    const getConfig = (tokenOverride = null) => ({
        headers: {
            Authorization: `Bearer ${tokenOverride || localStorage.getItem('token')}`, 
        },
    });

    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setActiveBoardId(null);
    };

    const login = async ({ email, password }) => {
        const response = await axios.post('/api/auth/login', { email, password });
        const { user, token } = response.data.data;
        
        localStorage.setItem('token', token);
        setCurrentUser(user);
        
        setActiveBoardId(1); 
        
        return response.data.data;
    };
    
    const signup = async ({ username, email, password }) => {
        const response = await axios.post('/api/auth/signup', { username, email, password });
        return response.data.data;
    };
    
    
    return (
        <AuthContext.Provider value={{ 
            currentUser, 
            activeBoardId,
            login,
            signup,
            logout,
            getConfig,
        }}>
            {children}
        </AuthContext.Provider>
    );
};