import React, { useState } from 'react';
import { Plus, X } from 'react-feather';

const AddList = ({ getlist }) => { 
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); 
        
        if (title.trim()) {
            getlist(title); 
            
            setTitle('');
            setOpen(false);
        }
    };

    if (open) {
        return (
            <form onSubmit={handleSubmit} className='mr-3 w-60 h-fit rounded-md p-2 bg-black flex-shrink-0'> 
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter list title..."
                    className='w-full p-2 rounded mb-2 text-black'
                    autoFocus
                />
                <div className='flex items-center'>
                    <button 
                        type="submit" 
                        className='bg-blue-600 hover:bg-blue-700 text-white p-2 rounded mr-2'
                    >
                        Add List
                    </button>
                    <button 
                        type="button" 
                        onClick={() => setOpen(false)} 
                        className='p-1 rounded hover:bg-gray-600 text-white'
                    >
                        <X size={20} />
                    </button>
                </div>
            </form>
        );
    }

    return (
        <button onClick={() => setOpen(true)} className='mr-3 w-60 h-10 rounded-md p-2 bg-gray-700 flex-shrink-0 flex items-center hover:bg-gray-600 text-white'>
            <Plus size={20} className='mr-2' /> Add another list
        </button>
    );
};

export default AddList;