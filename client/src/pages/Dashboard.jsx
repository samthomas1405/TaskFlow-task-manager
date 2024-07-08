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
//import { Chart } from "../components/Chart";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, getInitials } from "../utils";
//import UserInfo from "../components/UserInfo";
import { BiCard } from "react-icons/bi";

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
      label: "TO-DOS",
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
    </div>
  )
}

export default Dashboard