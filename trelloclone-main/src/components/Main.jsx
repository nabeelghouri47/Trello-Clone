import React, { useContext, useState } from 'react';
import { MoreHorizontal, UserPlus, Edit2, Trash2, Check } from 'react-feather' 
import { Popover } from 'react-tiny-popover'; 
import CardAdd from './CardAdd';
import { BoardContext } from '../context/BoardContext';
import { AuthContext } from '../context/AuthContext';
import { DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import AddList from './AddList';
import TaskModal from './TaskModal'; 
import axios from 'axios';

const Main = () => {
    const {allboard,setAllBoard} = useContext(BoardContext);
    const { getConfig, fetchBoardData, activeBoardId } = useContext(AuthContext);

    const [modalTask, setModalTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [listOptions, setListOptions] = useState({ isOpen: false, listId: null });
    const [listEdit, setListEdit] = useState({ isEditing: false, listId: null, title: '' });


    const bdata = allboard.boards[allboard.active];
    
    if (!bdata || !bdata.list) {
        return <div className='p-10 w-full text-white'>Loading Board...</div>;
    }

    const handleTaskClick = (task) => {
        if (task) {
            setModalTask(task);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalTask(null);
    };

    const handleTaskDelete = async () => {
        const taskId = modalTask?._dbId; 
        
        if (!taskId || !window.confirm("Are you sure you want to delete this task?")) {
            return;
        }
        
        try {
            await axios.delete(`/api/tasks/${taskId}`, getConfig());
            
            handleCloseModal(); 
            fetchBoardData(activeBoardId); 
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete task.');
        }
    };


    function onDragEnd(res){
        if(!res.destination){ return; }

        const s_id = res.source.droppableId; 
        const d_id = res.destination.droppableId; 
        const sourceIndex = res.source.index;
        const destinationIndex = res.destination.index;
        const draggableId = res.draggableId; 

        const sourceList = bdata.list.find(l => l.id === s_id);
        const destinationList = bdata.list.find(l => l.id === d_id);
        
        const taskItem = sourceList?.items.find(i => i.id === draggableId);
        
        const taskId = taskItem?._dbId; 
        const newListDbId = destinationList?._dbId; 

        if (!taskId || !newListDbId) {
            console.error("DND FAILED: Could not find Task DB ID or Destination List DB ID.", { taskId, newListDbId });
            return; 
        }

        const newListState = [...bdata.list];
        const sourceListState = newListState.find(l => l.id === s_id);
        const destListState = newListState.find(l => l.id === d_id);

        const [removed] = sourceListState.items.splice(sourceIndex, 1);
        destListState.items.splice(destinationIndex, 0, removed);

        let board_ = {...allboard};
        board_.boards[board_.active].list = newListState;
        setAllBoard(board_);

        const newPosition = destinationIndex * 1000 + 500; 

        axios.put(`/api/tasks/${taskId}/move`, { 
            newListId: newListDbId, 
            newPosition: newPosition
        }, getConfig())
        .then(() => {
             fetchBoardData(activeBoardId); 
        })
        .catch(error => {
            console.error('Error updating card position:', error);
            alert('Failed to save drag and drop. Reverting to server state.');
            fetchBoardData(activeBoardId); 
        });
    }

    const cardData = (title, ind)=>{
        if (!activeBoardId) return;

        const listDbId = bdata.list[ind]._dbId; 
        
        axios.post(`/api/tasks`, 
            { 
                listId: listDbId,
                title: title, 
                description: "" 
            }, 
            getConfig()
        )
        .then(response => {
            fetchBoardData(activeBoardId); 
        })
        .catch(error => {
            console.error('Error adding card:', error);
            alert('Failed to add card.');
        });
    }

    const listData = (title)=>{
        if (!activeBoardId) return;

        axios.post(`/api/lists`, 
            { 
                boardId: activeBoardId, 
                title: title 
            }, 
            getConfig()
        )
        .then(response => {
            fetchBoardData(activeBoardId);
        })
        .catch(error => {
            console.error('Error adding list:', error);
            alert('Failed to add list.');
        });
    }
    
    const handleListEdit = async () => {
        if (!listEdit.title.trim()) return;
        try {
            await axios.put(`/api/lists/${listEdit.listId}`, { title: listEdit.title }, getConfig());
            fetchBoardData(activeBoardId); 
            setListEdit({ isEditing: false, listId: null, title: '' }); 
        } catch (error) {
            console.error('Error editing list:', error);
            alert('Failed to edit list.');
        }
    };

    const handleListDelete = async (listId) => {
        if (!window.confirm('Are you sure you want to delete this list? All tasks will be lost.')) { return; }
        try {
            await axios.delete(`/api/lists/${listId}`, getConfig());
            fetchBoardData(activeBoardId); 
            setListOptions({ isOpen: false, listId: null }); 
        } catch (error) {
            console.error('Error deleting list:', error);
            alert('Failed to delete list.');
        }
    };


    return (
        <div className='flex flex-col w-full min-h-screen text-white' style={{backgroundColor:`${bdata.bgcolor}`}}>
            <div className='p-3 bg-black flex justify-between w-full bg-opacity-50'>
                <h2 className='text-lg'>{bdata.name}</h2>
            </div>
            <div className='flex flex-col w-full flex-grow relative'>
                <div className='absolute mb-1 pb-2 left-0 right-0 top-0 bottom-0 p-3 flex overflow-x-scroll overflow-y-hidden'>
                <DragDropContext onDragEnd={onDragEnd}>
                {bdata.list && bdata.list.map((x,ind)=>{
                    return <div key={x.id} className='mr-3 w-60 h-fit rounded-md p-2 bg-black flex-shrink-0'>
                    <div className="list-body">
                        
                        <div className='flex justify-between p-1 items-start'>
                             {listEdit.isEditing && listEdit.listId === x.id ? (
                                <div className='flex items-center w-full'>
                                    <input
                                        type="text"
                                        value={listEdit.title}
                                        onChange={(e) => setListEdit({ ...listEdit, title: e.target.value })}
                                        onKeyDown={(e) => { if (e.key === 'Enter') handleListEdit(); }}
                                        className='bg-gray-700 font-bold p-1 rounded w-full text-sm mr-1 text-white'
                                        autoFocus
                                    />
                                    <button onClick={handleListEdit} className='p-1 rounded hover:bg-green-600 bg-green-500'>
                                        <Check size={16} />
                                    </button>
                                </div>
                            ) : (
                                <span onClick={() => setListEdit({ isEditing: true, listId: x.id, title: x.title })} 
                                    className='font-bold cursor-pointer hover:underline p-1 text-sm flex-grow'>
                                    {x.title}
                                </span>
                            )}

                             <Popover
                                isOpen={listOptions.isOpen && listOptions.listId === x.id}
                                align='end'
                                positions={['right', 'bottom']}
                                onClickOutside={() => setListOptions({ isOpen: false, listId: null })}
                                content={
                                    <div className='ml-2 p-1 w-40 flex flex-col justify-start bg-slate-700 text-white rounded shadow-lg z-50'>
                                        <h6 className='px-3 py-2 text-xs font-semibold border-b border-gray-600'>List Actions</h6>
                                        <button 
                                            onClick={() => {
                                                setListOptions({ isOpen: false, listId: null });
                                                setListEdit({ isEditing: true, listId: x.id, title: x.title });
                                            }} 
                                            className='flex items-center w-full px-3 py-2 text-sm hover:bg-gray-600 rounded-sm'
                                        >
                                            <Edit2 size={14} className='mr-2'/> Edit Title
                                        </button>
                                        <button 
                                            onClick={() => handleListDelete(x.id)} 
                                            className='flex items-center w-full px-3 py-2 text-sm hover:bg-red-500 text-red-300 hover:text-white rounded-sm transition-colors duration-150'
                                        >
                                            <Trash2 size={14} className='mr-2'/> Delete List
                                        </button>
                                    </div>
                                }
                            >
                                <button 
                                    onClick={() => setListOptions({ isOpen: true, listId: x.id })}
                                    className='p-1 rounded-sm hover:bg-gray-600 flex-shrink-0'
                                    title="List Options"
                                >
                                    <MoreHorizontal size={16} />
                                </button>
                            </Popover>
                        </div>

                        <Droppable droppableId={x.id}> 
                        {(provided, snapshot) => (
                            <div 
                            className='py-1'
                            ref={provided.innerRef}
                            style={{ 
                                backgroundColor: snapshot.isDraggingOver ? '#222' : 'transparent',
                                minHeight: '50px' 
                            }}
                            {...provided.droppableProps}
                            >
                            {x.items && x.items.map((item,index)=>{
                            return <Draggable key={item.id} draggableId={item.id} index={index}> 
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                >
                                    <div 
                                        className="item flex justify-between items-center bg-zinc-700 p-1 cursor-pointer rounded-md border-2 border-zinc-900 hover:border-gray-500"
                                        onClick={() => handleTaskClick(item)} 
                                    >
                                        <span>{item.title}</span>
                                        <span className='flex justify-start items-start'>
                                            <Edit2 size={16}/> 
                                        </span>
                                    </div>
                                </div>
                            )}
                            </Draggable>
                            
                            })}

                            {provided.placeholder}
                            </div>
                        )}
                        </Droppable>
                        
                        <CardAdd getcard={(title)=>cardData(title,ind)}></CardAdd>
                    </div>
                    </div>
                })
                }
                </DragDropContext>

                <AddList getlist={(title)=>listData(title)}></AddList>
                
                
                </div>
            </div>
            
            {isModalOpen && modalTask && (
                <TaskModal
                    task={modalTask}
                    onClose={handleCloseModal}
                    onDelete={handleTaskDelete} 
                    fetchBoardData={fetchBoardData}
                    getConfig={getConfig}
                    activeBoardId={activeBoardId}
                />
            )}
            
        </div>
    );
}

export default Main;