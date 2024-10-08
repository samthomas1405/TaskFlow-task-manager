import React, { useState } from 'react';
import { FaList } from 'react-icons/fa';
import { MdGridView } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import Title from '../components/Title';
import { IoMdAdd } from 'react-icons/io';
import Button from '../components/Button';
import Tabs from '../components/Tabs';
import TaskTitle from '../components/TaskTitle';
import BoardView from '../components/BoardView';
import Table from '../components/tasks/Table';
import AddTask from '../components/tasks/AddTask';
import { useGetAllTaskQuery } from '../redux/slices/api/taskApiSlice';

// import icons
const TABS = [
  { title: 'Board View', icon: <MdGridView /> },
  { title: 'List View', icon: <FaList /> },
];

// set colors for task types
const TASK_TYPE = {
  todo: 'bg-blue-600',
  'in progress': 'bg-yellow-600',
  completed: 'bg-green-600',
};

const Tasks = () => {
  const params = useParams();
  const { user } = useSelector((state) => state.auth);

  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const status = params?.status || '';

  const { data, isLoading } = useGetAllTaskQuery({
    strQuery: status,
    isTrashed: '',
    search: '',
  });

  // Filter tasks based on user role
  const tasks = user.isAdmin
    ? data?.tasks
    : data?.tasks?.filter((task) =>
        task.team.some((member) => member._id === user._id)
      );

  return isLoading ? (
    <div className="py-10">
      {/* display loading icon if page is loading */}
      <Loader />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        {/* display title of tasks page */}
        <Title title={status ? `${status} Tasks` : 'Tasks'} />

        {!status && (
          <Button
            onClick={() => setOpen(true)}
            label="Create Task"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5"
          />
        )}
      </div>
      <Tabs tabs={TABS} setSelected={setSelected}>
        {!status && (
          <div className="w-full flex justify-between gap-4 md:gap-x-12 py-4">
            <TaskTitle label="To Do" className={TASK_TYPE.todo} />
            <TaskTitle label="In Progress" className={TASK_TYPE['in progress']} />
            <TaskTitle label="Completed" className={TASK_TYPE.completed} />
          </div>
        )}
        {
          // display BoardView
          selected !== 1 ? (
            <BoardView tasks={tasks} />
          ) : (
            // display ListView
            <div className="w-full">
              <Table tasks={tasks} />
            </div>
          )
        }
      </Tabs>

      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
