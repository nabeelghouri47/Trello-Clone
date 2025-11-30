import React, { useContext, useState } from 'react';
import { ChevronRight, ChevronLeft, Plus, X, MoreHorizontal, Edit2, Trash2 } from 'react-feather';
import { Popover } from 'react-tiny-popover';
import { BoardContext } from '../context/BoardContext';
import { AuthContext } from '../context/AuthContext'; 
import axios from 'axios';

const Sidebar = () => {

    const { allboard, setAllBoard } = useContext(BoardContext);
    const { getConfig, fetchBoardData, fetchUserBoards, setActiveBoardId } = useContext(AuthContext); 

    const blankBoard = {
        name: '',
        bgcolor: '#f60000',
        list: []
    };
    
    // --- States ---
    const [boardData, setBoarddata] = useState(blankBoard);
    const [collapsed, setCollapsed] = useState(false);
    const [showCreatePop, setShowCreatePop] = useState(false); 
    const [showOptionsPop, setShowOptionsPop] = useState(false); 
    const [activeBoardIdState, setActiveBoardIdState] = useState(null); 

    const setActiveboard = (i, dbId) => {
        let newBoard = { ...allboard }
        newBoard.active = i;
        setAllBoard(newBoard);
        setActiveBoardId(dbId); // Global state update
        fetchBoardData(dbId); // Data fetch
    }
    
    const addBoard = async () => {
        if (!boardData.name.trim()) return;

        try {
            await axios.post(
                '/api/boards', 
                { title: boardData.name }, 
                getConfig()
            );
            await fetchUserBoards(); 
            
            setBoarddata(blankBoard);
            setShowCreatePop(false);

        } catch (error) {
            console.error('Error creating board:', error);
            alert('Failed to create board.');
        }
    }

    const handleOpenOptions = (boardId, e) => {
        e.stopPropagation(); 
        setActiveBoardIdState(boardId);
        setShowOptionsPop(true);
    };

    const handleDeleteBoard = async (boardId) => {
        if (!window.confirm('Are you sure you want to delete this board?')) {
            return;
        }

        try {
            await axios.delete(`/api/boards/${boardId}`, getConfig());
            setShowOptionsPop(false);

            const deletedIndex = allboard.boards.findIndex(b => b._id === boardId);

            if (deletedIndex !== -1) {
                const newBoards = [...allboard.boards];
                newBoards.splice(deletedIndex, 1); 
                
                let newActiveIndex = -1;
                let newActiveBoardId = null;

                if (newBoards.length > 0) {
                    if (allboard.active === deletedIndex || deletedIndex >= newBoards.length) {
                        newActiveIndex = 0; 
                    } else if (deletedIndex < allboard.active) {
                        newActiveIndex = allboard.active - 1;
                    } else {
                        newActiveIndex = allboard.active;
                    }

                    newActiveBoardId = newBoards[newActiveIndex]._id;
                }

                setAllBoard({ active: newActiveIndex, boards: newBoards });
                setActiveBoardId(newActiveBoardId);

                if (newActiveBoardId) {
                    fetchBoardData(newActiveBoardId);
                }
            }

        } catch (error) {
            console.error("Board deletion failed:", error);
            alert("Failed to delete board.");
        }
    };

    const handleEditBoard = (boardId) => {
        alert(`Edit Board ID: ${boardId}`);
        setShowOptionsPop(false);
    };


    return (
        <div className={`bg-[#121417] text-white h-[calc(100vh-3rem)] border-r border-r-[#9fadbc29] transition-all linear duration-500 flex-shrink-0 ${collapsed ? 'w-[42px]' : 'w-[280px]'}`} >
            {!collapsed && <div>
                <div className="workspace p-3 flex justify-between border-b border-b-[#9fadbc29]">
                    <h4>Workspace</h4>
                    {/* <button onClick={() => setCollapsed(!collapsed)} className='hover:bg-slate-600 rounded-sm p-1'>
                        <ChevronLeft size={18}></ChevronLeft>
                    </button> */}
                </div>
                <div className="boardlist">
                    <div className='flex justify-between px-3 py-2'>
                        <h6>Your Boards</h6>
                        
                        <Popover
                        isOpen={showCreatePop}
                        align='start'
                        positions={['right', 'top', 'bottom', 'left']} 
                        content={
                            <div className='ml-2 p-2 w-60 flex flex-col justify-center items-center bg-slate-600 text-white rounded'>
                                <button onClick={() => setShowCreatePop(!showCreatePop)} className='absolute right-2 top-2 hover:bg-gray-500 p-1 rounded'><X size={16}></X></button>
                                <h4 className='py-3'>Create Board</h4>
                                <img  src="https://placehold.co/200x120/png" alt="" />
                                <div className="mt-3 flex flex-col items-start w-full">
                                    <label htmlFor="title">Board Title <span>*</span></label>
                                    <input value={boardData.name} onChange={(e) => setBoarddata({ ...boardData, name: e.target.value })} type="text" className='mb-2 h-8 px-2 w-full bg-gray-700' />
                                    <label htmlFor="Color">Board Color</label>
                                    <input value={boardData.bgcolor} onChange={(e) => setBoarddata({ ...boardData, bgcolor: e.target.value })} type="color" className='mb-2 h-8 px-2 w-full bg-gray-700' />
                                    <button onClick={addBoard} className='w-full rounded h-8 bg-slate-700 mt-2 hover:bg-gray-500'>Create</button>
                                </div>
                            </div>
                        }
                        >
                        <button onClick={() => setShowCreatePop(!showCreatePop)} className='hover:bg-slate-600 p-1 rounded-sm'>
                            <Plus size={16}></Plus>
                        </button>
                        </Popover>

                    </div>
                </div>
                <ul>
                    {allboard.boards && allboard.boards.map((x, i) => {
                        const boardDbId = x._id; 
                        
                        return <li key={i} className='relative'>
                            <button 
                                onClick={() => setActiveboard(i, boardDbId)} 
                                className={`px-3 py-2 w-full text-sm flex justify-start items-center hover:bg-gray-500 transition-colors duration-150 ${allboard.active === i ? 'bg-gray-700 font-bold' : ''}`}
                            >
                                <span className='w-6 h-max rounded-sm mr-2' style={{ backgroundColor: `${x.bgcolor}` }}>&nbsp;</span>
                                <span className='flex-grow text-left'>{x.name}</span>
                                
                                <Popover
                                    isOpen={showOptionsPop && activeBoardIdState === boardDbId}
                                    align='end'
                                    positions={['right', 'left']}
                                    onClickOutside={() => setShowOptionsPop(false)}
                                    content={
                                        <div className='ml-2 p-1 w-40 flex flex-col justify-start bg-slate-700 text-white rounded shadow-lg'>
                                            <h6 className='px-3 py-2 text-xs font-semibold border-b border-gray-600'>Board Options</h6>
                                            <button 
                                                onClick={() => handleEditBoard(boardDbId)} 
                                                className='flex items-center w-full px-3 py-2 text-sm hover:bg-gray-600 rounded-sm'
                                            >
                                                <Edit2 size={14} className='mr-2'/> Edit Board
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteBoard(boardDbId)} 
                                                className='flex items-center w-full px-3 py-2 text-sm hover:bg-red-500 text-red-300 hover:text-white rounded-sm transition-colors duration-150'
                                            >
                                                <Trash2 size={14} className='mr-2'/> Delete Board
                                            </button>
                                        </div>
                                    }
                                >
                                    <button 
                                        onClick={(e) => handleOpenOptions(boardDbId, e)}
                                        className='p-1 rounded-sm hover:bg-gray-600 flex-shrink-0 ml-2'
                                        title="Board Options"
                                    >
                                        <MoreHorizontal size={16} />
                                    </button>
                                </Popover>
                            </button>
                        </li>
                    })
                    }
                    
                </ul>
            </div>}
        </div>
    );
}

export default Sidebar;