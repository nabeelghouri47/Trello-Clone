import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header'; 
import Sidebar from './components/Sidebar'; 
import Main from './components/Main';
import Login from './components/Login';
import Signup from './components/Signup'; 
import { BoardContext } from './context/BoardContext';
import { AuthContext } from './context/AuthContext';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 

const initialBoardData = {
    active: 0,
    boards: []
};

axios.defaults.baseURL = 'http://localhost:5000'; 

function App() {
    const [allboard, setAllBoard] = useState(initialBoardData);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeBoardId, setActiveBoardId] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);

    const getConfig = () => ({
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, 
        },
    });

    const logout = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setActiveBoardId(null);
        setAllBoard(initialBoardData);
    };

    const signup = async (formData) => {
        return await axios.post('/api/auth/signup', formData);
    };

    const login = async ({ email, password }) => {
        setIsLoading(true);
        const response = await axios.post('/api/auth/login', { email, password });
        const { user, token } = response.data.data;
        
        localStorage.setItem('token', token);
        setCurrentUser(user);
        
        await fetchUserBoards(token); 
    };
        
    const fetchUserBoards = async (tokenOverride = null) => {
        const config = getConfig(tokenOverride);
        
        try {
            const response = await axios.get('/api/boards', config);
            const boardsFromDB = response.data.data;
            
            if (boardsFromDB.length > 0) {
                const transformedBoards = boardsFromDB.map(b => ({
                    _id: b.id, 
                    name: b.title,
                    bgcolor: '#069', 
                    list: []
                }));

                const newActiveIndex = allboard.active < transformedBoards.length ? allboard.active : 0;

                setAllBoard({
                    boards: transformedBoards,
                    active: newActiveIndex 
                });

                const currentActiveId = transformedBoards[newActiveIndex]._id;
                setActiveBoardId(currentActiveId);
                
                await fetchBoardData(currentActiveId, tokenOverride); 
            } else {
                setAllBoard(initialBoardData);
                setActiveBoardId(null);
                setIsLoading(false);
            }

        } catch (error) {
            console.error("Error fetching user boards:", error.response?.data?.message || error.message);
            logout(); 
        }
    };
    
    const fetchBoardData = async (boardId, tokenOverride = null) => {
        if (!boardId) {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        try {
            const config = getConfig(tokenOverride);
            const response = await axios.get(`/api/boards/${boardId}/full`, config);
            
            const boardFromDB = response.data.data;
            
            const transformedBoard = {
                _id: boardFromDB.id, 
                name: boardFromDB.title,
                bgcolor: '#069', 
                list: boardFromDB.Lists.map(list => ({
                    id: String(list.id), 
                    title: list.title,
                    _dbId: list.id, 
                    position: list.position,
                    items: list.Tasks.map(task => ({
                        id: String(task.id), 
                        title: task.title,
                        _dbId: task.id,
                        description: task.description,
                        position: task.position
                    })),
                }))
            };
            
            setAllBoard(prev => {
                const activeIndex = prev.boards.findIndex(b => b._id === boardId);
                
                if (activeIndex !== -1) {
                    const newBoards = [...prev.boards];
                    newBoards[activeIndex] = transformedBoard;
                    return {
                        ...prev,
                        boards: newBoards,
                        active: activeIndex 
                    };
                }
                
                return { boards: [transformedBoard], active: 0 };
            });

            setActiveBoardId(boardId);
            setIsLoading(false);

        } catch (error) {
            console.error('Error fetching board details:', error.response?.data?.message || error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setCurrentUser({ id: '...' }); 
            fetchUserBoards(token);
        } else {
            setIsLoading(false);
        }
    }, []);

    const PrivateRoute = ({ children }) => {
        if (isLoading) return <div className='text-center p-10 text-white bg-black h-screen'>Loading...</div>;
        return currentUser ? children : <Navigate to="/login" />;
    };


    return (
        <AuthContext.Provider value={{ 
            currentUser, 
            activeBoardId,
            login,
            signup,
            logout,
            getConfig, 
            fetchBoardData,
            fetchUserBoards,
            setActiveBoardId
        }}>
            <BoardContext.Provider value={{ allboard, setAllBoard }}>
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route 
                            path="/boards" 
                            element={
                                <PrivateRoute>
                                    <Header /> 
                                    <div className='content flex'>
                                        <Sidebar />
                                        <Main />
                                    </div>
                                </PrivateRoute>
                            } 
                        />
                        <Route path="/" element={<Navigate to="/boards" />} />
                    </Routes>
                </Router>
            </BoardContext.Provider>
        </AuthContext.Provider>
    )
}

export default App;