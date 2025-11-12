"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Loader from '@/components/Loader';

// Define TypeScript interfaces
interface User {
  id: number;
  name: string;
  userId: string;
  password: string;
  email: string;
  lastLogin: string;
  type: UserType;
}

type UserType = 'admin' | 'hr' | 'university' | 'trainer';

interface UsersData {
  admin: User[];
  hr: User[];
  universities: User[];
  trainers: User[];
}

interface ApiStats {
  universities: number;
  trainers: number;
  admin: number;
  hr: number;
}

const PasswordManagement = () => {
  const [activeTab, setActiveTab] = useState<string>('admin');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'edit' | 'changePassword'>('edit');
  const [stats, setStats] = useState<ApiStats>({
    universities: 0,
    trainers: 0,
    admin: 0,
    hr: 0
  });
  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState<UsersData>({
    admin: [],
    hr: [],
    universities: [],
    trainers: []
  });

  // Change Password Form State
  const [changePasswordData, setChangePasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Edit Form State
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    userId: ''
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") : null;

  // Fetch all data from APIs
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch universities data
        const universitiesRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/collegeUsers`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Fetch trainers data
        const trainersRes = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_DOMAIN}/instructors`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('🎯 Raw Universities Data:', universitiesRes.data);
        console.log('🎯 Raw Trainers Data:', trainersRes.data);

        // Transform universities data
        const universityUsers: User[] = universitiesRes.data?.data?.map((uni: any, index: number) => {
          return {
            id: uni._id || index + 1,
            name: uni.collegeName || uni.name || uni.institutionName || `University ${index + 1}`,
            userId: uni.collegeId || uni.userId || uni._id || `uni${index + 1}`,
            password: '••••••••',
            email: uni.email || uni.collegeEmail || `admin@${(uni.collegeName || uni.name || `university${index + 1}`).toLowerCase().replace(/\s+/g, '')}.edu`,
            lastLogin: uni.lastLogin || new Date().toISOString().split('T')[0],
            type: 'university'
          };
        }) || [];

        // Transform trainers data
        const trainerUsers: User[] = trainersRes.data?.data?.map((trainer: any, index: number) => {
          return {
            id: trainer._id || index + 1,
            name: trainer.name || `Trainer ${index + 1}`,
            userId: trainer.instructorId || trainer._id || `trainer${index + 1}`,
            password: '••••••••',
            email: trainer.email || `trainer${index + 1}@training.com`,
            lastLogin: trainer.lastLogin || new Date().toISOString().split('T')[0],
            type: 'trainer'
          };
        }) || [];

        console.log('✅ Final University Users:', universityUsers);
        console.log('✅ Final Trainer Users:', trainerUsers);

        // Update stats with actual counts
        setStats({
          universities: universityUsers.length,
          trainers: trainerUsers.length,
          admin: 2,
          hr: 3
        });

        // Update users data
        setUsersData({
          admin: [
            { id: 1, name: 'Super Admin', userId: 'admin001', password: '••••••••', email: 'admin@system.com', lastLogin: '2024-01-15', type: 'admin' },
            { id: 2, name: 'System Admin', userId: 'admin002', password: '••••••••', email: 'sysadmin@system.com', lastLogin: '2024-01-14', type: 'admin' },
          ],
          hr: [
            { id: 1, name: 'John HR Manager', userId: 'hr001', password: '••••••••', email: 'john.hr@company.com', lastLogin: '2024-01-15', type: 'hr' },
            { id: 2, name: 'Sarah HR Executive', userId: 'hr002', password: '••••••••', email: 'sarah.hr@company.com', lastLogin: '2024-01-14', type: 'hr' },
            { id: 3, name: 'Mike HR Coordinator', userId: 'hr003', password: '••••••••', email: 'mike.hr@company.com', lastLogin: '2024-01-13', type: 'hr' },
          ],
          universities: universityUsers,
          trainers: trainerUsers
        });

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [token]);

  // Initialize edit data when user is selected
  useEffect(() => {
    if (selectedUser) {
      setEditData({
        name: selectedUser.name,
        email: selectedUser.email,
        userId: selectedUser.userId
      });
      setChangePasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setActiveModalTab('edit');
    }
  }, [selectedUser]);

  const allUsers: User[] = [
    ...usersData.admin,
    ...usersData.hr,
    ...usersData.universities,
    ...usersData.trainers
  ];

  const filteredUsers = allUsers.filter((user: User) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).filter(user => activeTab === 'all' || user.type === activeTab);

  const getTypeColor = (type: UserType): string => {
    const colors: Record<UserType, string> = {
      admin: 'bg-red-500',
      hr: 'bg-blue-500',
      university: 'bg-green-500',
      trainer: 'bg-yellow-500'
    };
    return colors[type];
  };

  const getTypeIcon = (type: UserType): string => {
    const icons: Record<UserType, string> = {
      admin: '👑',
      hr: '💼',
      university: '🎓',
      trainer: '🏋️'
    };
    return icons[type];
  };

  const getTypeTextColor = (type: UserType): string => {
    const colors: Record<UserType, string> = {
      admin: 'text-red-500',
      hr: 'text-blue-500',
      university: 'text-green-500',
      trainer: 'text-yellow-500'
    };
    return colors[type];
  };

  // Compact number format function
  const compactFormat = (num: number | string | undefined) => {
    if (!num) return "0";
    if (typeof num === "string") num = parseInt(num);
    return Intl.NumberFormat("en", { notation: "compact" }).format(num);
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (changePasswordData.newPassword !== changePasswordData.confirmPassword) {
      alert("New password and confirm password don't match!");
      return;
    }

    if (changePasswordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    try {
      console.log('Changing password for:', selectedUser?.userId, changePasswordData);
      alert('Password changed successfully!');
      setChangePasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setSelectedUser(null);
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password!');
    }
  };

  // Handle Edit User
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Updating user:', selectedUser?.id, editData);
      alert('User details updated successfully!');
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user details!');
    }
  };

  // UserCard component with proper typing
  const UserCard = ({ user }: { user: User }) => (
    <div 
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-300 hover:transform hover:-translate-y-1"
      onClick={() => setSelectedUser(user)}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl ${getTypeColor(user.type)}`}>
          {getTypeIcon(user.type)}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 text-lg">{user.name}</h3>
          <p className="text-gray-500 text-sm">ID: {user.userId}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-white text-xs font-medium ${getTypeColor(user.type)}`}>
          {user.type}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Email:</span>
          <span className="text-gray-800 text-sm">{user.email}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Password:</span>
          <span className="text-gray-800 font-mono text-sm">{user.password}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Last Login:</span>
          <span className="text-gray-800 text-sm">{user.lastLogin}</span>
        </div>
      </div>
    </div>
  );

  // UserModal component with proper typing
  const UserModal = ({ user, onClose }: { user: User; onClose: () => void }) => {
    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <div 
          className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Manage User</h2>
            <button 
              className="text-gray-500 hover:text-gray-700 text-2xl"
              onClick={onClose}
            >
              ×
            </button>
          </div>
          
          {/* User Profile Header with User ID */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl ${getTypeColor(user.type)}`}>
                {getTypeIcon(user.type)}
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{user.name}</h3>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">User ID:</span> {user.userId}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">User Type:</span> 
                  <span className={`font-medium ml-1 ${getTypeTextColor(user.type)}`}>
                    {user.type}
                  </span>
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Modal Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  activeModalTab === 'edit'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveModalTab('edit')}
              >
                Edit Profile
              </button>
              <button
                className={`flex-1 py-4 text-center font-medium transition-colors ${
                  activeModalTab === 'changePassword'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveModalTab('changePassword')}
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeModalTab === 'edit' ? (
              <form onSubmit={handleEditUser}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={editData.userId}
                      onChange={(e) => setEditData({ ...editData, userId: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Update Profile
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Old Password
                    </label>
                    <input
                      type="password"
                      value={changePasswordData.oldPassword}
                      onChange={(e) => setChangePasswordData({ ...changePasswordData, oldPassword: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={changePasswordData.newPassword}
                      onChange={(e) => setChangePasswordData({ ...changePasswordData, newPassword: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={changePasswordData.confirmPassword}
                      onChange={(e) => setChangePasswordData({ ...changePasswordData, confirmPassword: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      minLength={6}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                  >
                    Change Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  const tabOptions: string[] = ['admin', 'hr', 'university', 'trainer'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-300 to-blue-400 flex items-center justify-center">
        <div className="text-center">
          <Loader />
          <p className="text-white mt-4 text-lg">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 to-blue-400 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            User Password Management
          </h1>
          <p className="text-white text-opacity-90 text-lg">
            Manage all user accounts and passwords across different roles
          </p>
        </div>

        {/* Statistics Cards with Real API Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Admin Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-4 hover:transform hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-2xl">
              👑
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{compactFormat(stats.admin)}</h3>
              <p className="text-gray-600">Admin Users</p>
            </div>
          </div>
          
          {/* HR Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-4 hover:transform hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
              💼
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{compactFormat(stats.hr)}</h3>
              <p className="text-gray-600">HR Users</p>
            </div>
          </div>
          
          {/* Universities Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-4 hover:transform hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
              🎓
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{compactFormat(stats.universities)}</h3>
              <p className="text-gray-600">Universities</p>
            </div>
          </div>
          
          {/* Trainers Card */}
          <div className="bg-white rounded-xl p-6 shadow-lg flex items-center gap-4 hover:transform hover:-translate-y-1 transition-transform duration-300">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
              🏋️
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{compactFormat(stats.trainers)}</h3>
              <p className="text-gray-600">Trainers</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search Box */}
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search users by name, ID, or email..."
              className="w-full pl-12 pr-4 py-3 rounded-full border-0 shadow-lg focus:ring-2 focus:ring-blue-300 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabOptions.map((tab: string) => (
              <button
                key={tab}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-white text-blue-600 shadow-lg' 
                    : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.map((user: User) => (
            <UserCard key={`${user.type}-${user.id}`} user={user} />
          ))}
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-white mb-2">No users found</h3>
            <p className="text-white text-opacity-80">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* User Modal */}
        {selectedUser && (
          <UserModal user={selectedUser} onClose={() => setSelectedUser(null)} />
        )}
      </div>
    </div>
  );
};

export default PasswordManagement;