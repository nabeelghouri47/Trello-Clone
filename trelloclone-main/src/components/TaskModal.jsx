import React, { useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'react-feather';

const TaskModal = ({ task, onClose, onDelete, fetchBoardData, getConfig, activeBoardId }) => {
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [isLoading, setIsLoading] = useState(false);

    const taskId = task._dbId;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await axios.put(`/api/tasks/${taskId}`, {
                title: title,
                description: description,
            }, getConfig());

            await fetchBoardData(activeBoardId);
            onClose();

        } catch (error) {
            console.error("Task update failed:", error);
            alert("Failed to update task.");
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-2xl text-gray-800">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full text-xl font-bold mb-4 border-b pb-1 focus:outline-none"
                    />

                    <h3 className="font-semibold mb-2 flex items-center">
                        Description
                    </h3>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a more detailed description..."
                        className="w-full p-2 border rounded-md mb-4 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                    />

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`py-2 px-4 rounded font-medium ${isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
                        >
                            {isLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            onClick={onDelete} // Direct call to the handler passed from Main.jsx
                            className='p-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center'
                        >
                            <Trash2 size={16} className='mr-2' /> Delete
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;