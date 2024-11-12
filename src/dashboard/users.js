import React, { useEffect, useState } from 'react';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { Table, Button, Modal, Input, message, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // for editing
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);  // Track which user is being edited

  // Fetch users from Firestore in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map((doc, index) => ({
        id: doc.id,
        number: index + 1,
        ...doc.data(),  // Ensure all fields are correctly fetched
      })));
    });
    return unsubscribe;
  }, []);

  // Add a new user to Firestore
  const addUser = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      message.warning('Please enter name, email, and password');
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, 'users'), { name, email, password });
      message.success('User added successfully');
      setName('');
      setEmail('');
      setPassword('');
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding user:", error);
      message.error('Failed to add user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open Edit Modal
  const openEditModal = (user) => {
    setEditingUserId(user.id);
    setName(user.name);
    setEmail(user.email);
    setPassword(user.password);
    setIsEditModalOpen(true);
  };

  // Edit an existing user
  const editUser = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      message.warning('Please enter name, email, and password');
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, 'users', editingUserId);
      await updateDoc(userRef, { name, email, password });
      message.success('User updated successfully');
      setName('');
      setEmail('');
      setPassword('');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error editing user:", error);
      message.error('Failed to edit user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Delete a user from Firestore
  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      message.success('User deleted successfully');
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error('Failed to delete user. Please try again.');
    }
  };

  // Table columns for users
  const columns = [
    { title: 'No.', dataIndex: 'number', key: 'number' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, user) => (
        <div className="flex">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(user)}
          >
            Edit
          </Button>
          <Button
            type="link"
            icon={<DeleteOutlined />}
            danger
            onClick={() => deleteUser(user.id)}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 md:pt-0 pt-10">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-white shadow p-4 rounded">
        <h2 className="text-xl font-semibold">Users List</h2>
        <Button
          type="none"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          className="bg-green-600 text-white hover:bg-green-700"
        >
          Add User
        </Button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto bg-white rounded"> {/* Ensure horizontal scroll on small screens */}
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 6 }}
          className="bg-white rounded-lg"
          locale={{ emptyText: "No users found" }}
          style={{
            header: { backgroundColor: '#f8fafc', color: '#4b5563', fontWeight: 'bold' }
          }}
        />
      </div>

      {/* Modal Form for Adding Users */}
      <Modal
        title="Add New User"
        visible={isModalOpen}
        onOk={addUser}
        onCancel={() => setIsModalOpen(false)}
        okText={loading ? <Spin /> : 'Add'}
        cancelText="Cancel"
        okButtonProps={{ disabled: loading }}
        bodyStyle={{ padding: '10px' }}
      >
        <div className="space-y-5">
          <div>
            <label className="block font-medium">Name :</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter user name"
              className='bg-gray-50 py-2'
            />
          </div>
          <div>
            <label className="block font-medium">Email :</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
              className='bg-gray-50 py-2'
            />
          </div>
          <div>
            <label className="block font-medium">Password :</label>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter user password"
              className='bg-gray-50 py-2'
            />
          </div>
        </div>
      </Modal>

      {/* Modal Form for Editing Users */}
      <Modal
        title="Edit User"
        visible={isEditModalOpen}
        onOk={editUser}
        onCancel={() => setIsEditModalOpen(false)}
        okText={loading ? <Spin /> : 'Update'}
        cancelText="Cancel"
        okButtonProps={{ disabled: loading }}
        bodyStyle={{ padding: '15px' }}
      >
        <div className="space-y-5">
          <div>
            <label className="block font-medium">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter user name"
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
            />
          </div>
          <div>
            <label className="block font-medium">Password</label>
            <Input.Password
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter user password"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Users;
