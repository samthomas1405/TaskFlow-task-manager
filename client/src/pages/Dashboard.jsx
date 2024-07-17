import React from "react";
import {
  MdAdminPanelSettings,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { LuClipboardEdit } from "react-icons/lu";
import { FaNewspaper, FaUsers } from "react-icons/fa";
import { FaArrowsToDot } from "react-icons/fa6";
import moment from "moment";
import { summary } from "../assets/data";
import clsx from "clsx";
import { BGS, PRIORITYSTYLES, TASK_TYPE, getInitials } from "../utils";
import { BiCard } from "react-icons/bi";
import Chart from "../components/Chart";
import UserInfo from "../components/UserInfo";

const TaskTable = ({tasks}) => {
  // import icons
  const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
  }
  // construct table header
  const TableHeader = () => (
    <thead className = 'border-b border-gray-300'>
      <tr className = 'text-black text-left'>
        <th className = 'py-2'>Task Title</th>
        <th className = 'py-2'>Priority</th>
        <th className = 'py-2'>Team</th>
        <th className = 'py-2 hidden md:block'>Created At</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => <tr className = 'border-b border-gray-300 text-gray-600 hover:bg-gray-300/10'>
    <td className = 'py-2'>
      <div className = 'flex items-center gap-2'>
        {/* display task title */}
        <div className = {clsx('w-4 h-4 rounded-full', TASK_TYPE[task.stage])} />
        <p className='text-base text-black'>{task.title}</p>
      </div>
    </td>
    <td className = 'py-2'>
      <div className = 'flex gap-1 items-center'>
        {/* display task priority */}
        <span className = {clsx('text-lg', PRIORITYSTYLES[task.priority])}> 
          {ICONS[task.priority]}
        </span>
        <span className = 'capitalize'>{task.priority}</span>
      </div>
    </td>

    <td className ='py-2'>
      <div className = 'flex'>
        {task.team.map((m, index) => (
          <div key = {index} className={clsx('w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1', BGS[index % BGS.length])}>
            {/* display team members assigned to specific task */}
            <UserInfo user = {m} />
          </div>
        ))}
      </div>
    </td>
    <td className = 'py-2 hidden md:block'>
      <span className = 'text-base text-gray-600'>
        {/* display task creation date */}
        {moment(task?.date).fromNow()}
      </span>
    </td>
  </tr>;
  return (
    <>
    <div className = 'w-full md:w-2/3 bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded'>
      <table className = 'w-full'>
        {/* display TableHeader from above code */}
        <TableHeader /> 
        <tbody>
          {
            tasks?.map((task, id) => (
              // display TableRows from above code for each task
              <TableRow key={id} task = {task} />
            ))
          }
        </tbody>
      </table>
    </div>
    </>
  )
}

const UserTable = ({users}) => {
  // construct table header for user table
  const TableHeader = () => (
    <thead className='border-b border-gray-300 '>
      <tr className='text-black  text-left'>
        <th className='py-2'>Full Name</th>
        <th className='py-2'>Status</th>
        <th className='py-2'>Created At</th>
      </tr>
    </thead>
  );

  //construct each table row for user table
  const TableRow = ({user}) => (
    <tr className='border-b border-gray-200  text-gray-600 hover:bg-gray-400/10'>
      <td className='py-2'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-violet-700'>
            {/* displays user's initials */}
            <span className='text-center'>{getInitials(user?.name)}</span> 
          </div>

          <div>
            {/* displays user name and role*/}
            <p> {user.name}</p>
            <span className='text-xs text-black'>{user?.role}</span>
          </div>
        </div>
      </td>

      <td> 
        {/* displays user status */}
        <p className={clsx("w-fit px-3 py-1 rounded-full text-sm",user?.isActive ? "bg-blue-200" : "bg-yellow-100")}>
          {user?.isActive ? "Active" : "Disabled"}
        </p>
      </td>
      {/* displays user creation date */}
      <td className='py-2 text-sm'>{moment(user?.createdAt).fromNow()}</td>
    </tr>
  )
  return (
    <div className='w-full md:w-1/3 bg-white h-fit px-2 md:px-6 py-4 shadow-md rounded'>
      <table className='w-full mb-5'>
        <TableHeader />
        <tbody>
          {users?.map((user, index) => (
            <TableRow key={index + user?._id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

const Dashboard = () => {

  const totals = summary.tasks;
  
  //stats for total, completed, in-progress, and to-do tasks
  const stats = [
    {
      _id: "1",
      label: "TOTAL TASKS",
      total: summary?.totalTasks || 0,
      icon: <FaNewspaper />,
      bg: "bg-[#1d4ed8]",
    },
    {
      _id: "2",
      label: "COMPLETED TASKS",
      total: totals["completed"] || 0,
      icon: <MdAdminPanelSettings />,
      bg: "bg-[#0f766e]",
    },
    {
      _id: "3",
      label: "TASKS IN PROGRESS ",
      total: totals["in progress"] || 0,
      icon: <LuClipboardEdit />,
      bg: "bg-[#f59e0b]",
    },
    {
      _id: "4",
      label: "TO DOS",
      total: totals["todo"],
      icon: <FaArrowsToDot />,
      bg: "bg-[#be185d]" || 0,
    },
  ];

  //create cards for each type of task at top of dashboard
  const Card = ({label, count, bg, icon}) => {
    return (
      <div className = 'w-full h-32 bg-white p-5 shadow-md rounded-md flex items-center justify-between'>
        <div className = "h-full flex flex-1 flex-col justify-between">
          {/* display type of tasks */}
          <p className = 'text-base text-gray-600'>
            {label} 
          </p>
          {/* display number of tasks */}
          <span className = 'text-2xl font-semibold'>{count}</span>
          {/* display number of tasks last month*/}
          <span className = 'text-sm text-gray-400'>{"110 last month"}</span>
        </div>

        {/*create icon on right side of card */}
        <div className = {clsx('w-10 h-10 rounded-full flex items-center justify-center text-white', bg)}>
          {icon}
        </div>
      </div>
    )
  }
  return (
    <div className = 'h-full py-4'>
      <div className = 'grid grid-cols-1 md:grid-cols-4 gap-5'>
        {
          //map data from tasks array to Card
          stats.map(({icon, bg, label, total}, index) => (
            <Card 
              key = {index}
              icon = {icon}
              bg = {bg}
              label = {label}
              count = {total}
            />
          ))
        }
      </div>
      <div className = 'w-full bg-white my-16 p-4 rounded shadow-sm'>
        <h4 className = 'text-xl text-gray-600 font-semibold'>Chart by Priority</h4>
        <Chart/> {/*export data into chart */}
      </div>

      <div className = 'w-full flex flex-col md:flex-row gap-4 2xl:gap-10 py-8'>
        {/* left side of dashboard displays tasks*/}
        <TaskTable tasks = {summary.last10Task} />
        {/* right side of dashboard displays users*/}
        <UserTable users = {summary.users} />
      </div>
    </div>
  )
}

export default Dashboard