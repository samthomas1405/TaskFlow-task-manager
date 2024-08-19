import React, { useState } from 'react'
import { MdAttachFile, MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from 'react-icons/md';
import { BiMessageAltDetail } from 'react-icons/bi';
import { BGS, PRIORITYSTYLES, TASK_TYPE, formatDate } from '../../utils';
import clsx from 'clsx';
import { FaList } from 'react-icons/fa';
import UserInfo from '../UserInfo';
import Button from '../Button';
import ConfirmationDialog from '../Dialogs';
import { useTrashTaskMutation } from '../../redux/slices/api/taskApiSlice';
import {toast} from 'sonner';
import AddTask from './AddTask';

// import icons
const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  };

const Table = ({tasks}) => {
    const [openDialog, setOpenDialog] = useState(false);
    const [selected, setSelected] = useState(null);
    const [openEdit, setOpenEdit] = useState(false);

    const [trashTask] = useTrashTaskMutation();

    const deleteClicks = (id) =>{
        setSelected(id);
        setOpenDialog(true);
    };

    const editTaskHandler = (el) => {
        setSelected(el);
        setOpenEdit(true);
    }

    const deleteHandler = async () =>{
        try {
            const result = await trashTask({
                id: selected,
                isTrash: 'trash'
            }).unwrap();
            toast.success(result?.message);

            setTimeout(() => {
                setOpenDialog(false);
                window.location.reload();
            },500);
        } catch (err) {
            console.log(err);
            toast.error(err?.data?.message ||err.error);
        }
    };

    //create table header
    const TableHeader = () => (
        <thead className='w-full border-b border-gray-300'>
            <tr className='w-full text-black  text-left'>
                <th className='py-2'>Task Title</th>
                <th className='py-2'>Priority</th>
                <th className='py-2 line-clamp-1'>Created At</th>
                <th className='py-2'>Assets</th>
                <th className='py-2'>Team</th>
            </tr>
        </thead>
    );

    //create each row for specific task
    const TableRow = ({task}) => (
        <tr className='border-b border-gray-200 text-gray-600 hover:bg-gray-300/10'>
            {/* table data for task title */}
            <td className='py-2'>
                <div className='flex items-center gap-2'>
                    <div className={clsx('w-4 h-4 rounded-full', TASK_TYPE[task.stage])} />
                    <p className='w-full line-clamp-2 text-base text-black'>
                        {task?.title}
                    </p>
                </div>
            </td>

            {/* table data for task priority */}
            <td className='py-2'>
                <div className={'flex gap-1 items-center'}>
                    <span className={clsx('text-lg', PRIORITYSTYLES[task?.priority])}>
                        {ICONS[task?.priority]}
                    </span>
                    <span className='capitalize line-clamp-1'>
                        {task?.priority} Priority
                    </span>
                </div>
            </td>

            {/* table data for task creation date */}
            <td className='py-2'>
                <span className='text-sm text-gray-600'>
                    {formatDate(new Date(task?.date))}
                </span>
            </td>

            {/* table data to display number of activities, assets, and subtasks */}
            <td className='py-2'>
                <div className='flex items-center gap-3'>
                    <div className='flex gap-1 items-center text-sm text-gray-600'>
                        <BiMessageAltDetail />
                        <span>{task?.activities?.length}</span>
                    </div>
                    <div className='flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400'>
                        <MdAttachFile />
                        <span>{task?.assets?.length}</span>
                    </div>
                    <div className='flex gap-1 items-center text-sm text-gray-600 dark:text-gray-400'>
                        <FaList />
                        <span>0/{task?.subTasks?.length}</span>
                    </div>
                </div>
            </td>

            {/* table data to display user info */}
            <td className='py-2'>
                <div className='flex'>
                    {task?.team?.slice(0, 7).map((m, index) => (
                        <div
                            key={index}
                            className={clsx('w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1', BGS[index % BGS?.length])}
                        >
                            <UserInfo user={m} />
                        </div>
                    ))}
                    {task?.team?.length > 7 && (
                        <div className='w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-600'>
                            +{task.team.length - 7}
                        </div>
                    )}
                </div>
            </td>

            {/* table data to edit or delete task */}
            <td className='py-2 flex gap-2 md:gap-4 justify-end'>
                <Button
                    className='text-blue-600 hover:text-blue-500 sm:px-0 text-sm md:text-base'
                    label='Edit'
                    type='button'
                    onClick = {() => editTaskHandler(task)}
                />

                <Button
                    className='text-red-700 hover:text-red-500 sm:px-0 text-sm md:text-base'
                    label='Delete'
                    type='button'
                    onClick={() => deleteClicks(task._id)}
                />
            </td>
        </tr>
    )
    return (
        <>
            <div className='bg-white  px-2 md:px-4 pt-4 pb-9 shadow-md rounded'>
                <div className='overflow-x-auto'>
                    {/* create table */}
                    <table className='w-full '>
                        <TableHeader />
                        <tbody>
                            {tasks.map((task, index) => (
                            <TableRow key={index} task={task} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
    
            <ConfirmationDialog
                open={openDialog}
                setOpen={setOpenDialog}
                onClick={deleteHandler}
            />

            <AddTask
                open={openEdit}
                setOpen={setOpenEdit}
                task={selected}
                key={new Date().getTime()}
            />  
        </>
    );
}

export default Table
