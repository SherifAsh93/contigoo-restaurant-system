'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RoleLayout } from '@/components/RoleLayout';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { User, UserRole } from '@/types';
import { MOCK_USERS } from '@/lib/mockData';

export default function OwnerStaffPage() {
  const { users } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: 'server' as UserRole });

  const roles: { value: UserRole; label: string; color: string }[] = [
    { value: 'owner', label: 'Owner', color: 'purple' },
    { value: 'chef', label: 'Chef', color: 'orange' },
    { value: 'server', label: 'Server', color: 'blue' },
  ];

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({ name: '', email: '', role: 'server' });
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email || '', role: user.role });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowModal(false);
  };

  return (
    <RoleLayout role="owner" title="Staff Management" subtitle="Manage restaurant staff and permissions">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Team Members</h3>
        <Button onClick={handleAddUser}>+ Add Staff Member</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map(user => (
          <Card key={user.id} variant="elevated" padding="lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center text-xl font-bold">
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{user.name}</h4>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <Badge variant={user.role === 'owner' ? 'primary' : user.role === 'chef' ? 'warning' : 'info'} size="md">
                {user.role.toUpperCase()}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Access Level</span>
                <select 
                  value={user.role}
                  onChange={e => console.log('Role change:', e.target.value)}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="text-sm text-gray-600">Status</span>
                <Badge variant="success" size="sm">Active</Badge>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditUser(user)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:border-red-300">
                  Remove
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card variant="elevated" padding="lg" className="w-full max-w-md animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">{editingUser ? 'Edit Staff' : 'Add Staff Member'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <Input label="Email" type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">{editingUser ? 'Save Changes' : 'Add Staff'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </RoleLayout>
  );
}