import React, { useState } from 'react';
import Title from '../components/Title';
import Button from '../components/Button';
import { IoMdAdd } from 'react-icons/io';
import { getInitials } from '../utils';
import clsx from 'clsx';
import ConfirmationDialog, { UserAction } from '../components/Dialogs';
import AddUser from '../components/AddUser';
import { useDeleteUserMutation, useGetTeamListQuery, useUserActionMutation } from '../redux/slices/api/userApiSlice';
import { toast } from 'sonner';

const Users = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [selected, setSelected] = useState(null);

  const { data, isLoading, refetch } = useGetTeamListQuery();
  const [deleteUser] = useDeleteUserMutation();
  const [userAction] = useUserActionMutation();

  const userActionHandler = async () => {
    try {
      const result = await userAction({
        isActive: !selected?.isActive,
        id: selected?._id,
      });

      refetch();
      toast.success(result.data.message);
      setSelected(null);
      setTimeout(() => {
        setOpenAction(false);
        window.location.reload();
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  const deleteHandler = async () => {
    try {
      const result = await deleteUser(selected);

      refetch();
      toast.success('Deleted successfully');
      setSelected(null);
      setTimeout(() => {
        setOpenDialog(false);
      }, 500);
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || error.error);
    }
  };

  const deleteClick = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClick = (el) => {
    setSelected(el);
    setOpen(true);
  };

  const userStatusClick = (el) => {
    setSelected(el);
    setOpenAction(true);
  };

  // Sort users by role to group them
  const sortedUsers = data?.slice().sort((a, b) => {
    const roleOrder = ['Admin', 'Managing Committee', 'MMS', 'Altar Boy', 'MGOCSM', 'Member']; // Define role order
    return roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role);
  });

  // Construct table header for users
  const TableHeader = () => (
    <thead className="border-b border-gray-300">
      <tr className="text-black text-left">
        <th className="py-2">Full Name</th>
        <th className="py-2">Title</th>
        <th className="py-2">Email</th>
        <th className="py-2">Role</th>
        <th className="py-2">Active</th>
      </tr>
    </thead>
  );

  // Display user information
  const TableRow = ({ user }) => (
    <tr className="border-b border-gray-200 text-gray-600 hover:bg-gray-400/10">
      {/* Table data to display user initials and name */}
      <td className="p-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full text-white flex items-center justify-center text-sm bg-blue-700">
            <span className="text-xs md:text-sm text-center">{getInitials(user.name)}</span>
          </div>
          {user.name}
        </div>
      </td>

      {/* Table data to display user title */}
      <td className="p-2">{user.title}</td>
      {/* Table data to display either user email or default email */}
      <td className="p-2">{user.email || 'user.email.com'}</td>
      {/* Table data to display user role */}
      <td className="p-2">{user.role}</td>

      {/* Table data to check if user is active */}
      <td>
        <button
          onClick={() => userStatusClick(user)}
          className={clsx('w-fit px-4 py-1 rounded-full', user?.isActive ? 'bg-blue-200' : 'bg-yellow-100')}
        >
          {user?.isActive ? 'Active' : 'Disabled'}
        </button>
      </td>

      {/* Table data to edit or delete user */}
      <td className="p-2 flex gap-4 justify-end">
        <Button
          className="text-blue-600 hover:text-blue-500 font-semibold sm:px-0"
          label="Edit"
          type="button"
          onClick={() => editClick(user)}
        />

        <Button
          className="text-red-700 hover:text-red-500 font-semibold sm:px-0"
          label="Delete"
          type="button"
          onClick={() => deleteClick(user?._id)}
        />
      </td>
    </tr>
  );

  return (
    <>
      <div className="w-full md:px-1 px-0 mb-6">
        <div className="flex items-center justify-between mb-8">
          <Title title="Team Members" />
          {/* Button to add new user */}
          <Button
            label="Add New User"
            icon={<IoMdAdd className="text-lg" />}
            className="flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md 2xl:py-2.5"
            onClick={() => setOpen(true)}
          />
        </div>

        <div className="bg-white px-2 md:px-4 py-4 shadow-md rounded">
          <div className="overflow-x-auto">
            <table className="w-full mb-5">
              {/* Import table code from above */}
              <TableHeader />
              <tbody>
                {sortedUsers?.map((user, index) => (
                  <TableRow key={index} user={user} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <AddUser
        open={open}
        setOpen={setOpen}
        userData={selected}
        key={new Date().getTime().toString()}
      />

      <ConfirmationDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <UserAction
        open={openAction}
        setOpen={setOpenAction}
        onClick={userActionHandler}
      />
    </>
  );
};

export default Users;
