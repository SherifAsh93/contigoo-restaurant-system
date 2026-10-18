'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Card } from '@/components/Card';
import { useApp } from '@/context/AppContext';
import { MOCK_USERS } from '@/lib/mockData';
import { UserRole } from '@/types';

const ROLE_OPTIONS = [
  { value: 'owner', label: 'Owner', description: 'Full access to all features', icon: '👑' },
  { value: 'head_chef', label: 'Head Chef', description: 'Kitchen leader - assign & manage orders', icon: '👨‍🍳' },
  { value: 'line_chef', label: 'Line Chef', description: 'Station chef - cook assigned orders', icon: '🍳' },
  { value: 'sous_chef', label: 'Sous Chef', description: 'Assistant kitchen leader', icon: '👨‍🍳' },
  { value: 'server', label: 'Server/Waiter', description: 'Order delivery & tables', icon: '🍽️' },
  { value: 'customer', label: 'Customer', description: 'Browse menu & place orders', icon: '🍴' },
];

export default function AuthPage() {
  const router = useRouter();
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = useState<UserRole>('customer');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!userId) {
      setError('Please select a user');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.id === userId && u.role === selectedRole);
      if (user) {
        login(user);
        router.push(`/${selectedRole}`);
      } else {
        setError('Invalid user for selected role');
      }
      setIsLoading(false);
    }, 500);
  };

  const usersForRole = MOCK_USERS.filter(u => u.role === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-4xl">🍽️</span>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Contigoo
            </span>
          </Link>
          <p className="text-gray-500 mt-2">Restaurant Management System</p>
        </div>

        <Card variant="elevated" padding="lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
            <p className="text-gray-500 mt-1">Select your role and user to continue</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Role</label>
            <div className="grid grid-cols-2 gap-3">
              {ROLE_OPTIONS.map(role => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => { setSelectedRole(role.value as UserRole); setUserId(''); setError(''); }}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200 text-left
                    ${selectedRole === role.value 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{role.icon}</div>
                  <div className="font-semibold text-gray-900">{role.label}</div>
                  <div className="text-xs text-gray-500">{role.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* User Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Select User</label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {usersForRole.map(user => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => { setUserId(user.id); setError(''); }}
                  className={`
                    w-full p-3 rounded-xl border-2 transition-all duration-200 text-left
                    ${userId === user.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold">
                      {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {userId === user.id && (
                      <svg className="ml-auto w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleLogin} 
            disabled={!userId || isLoading}
            loading={isLoading}
          >
            Sign In as {ROLE_OPTIONS.find(r => r.value === selectedRole)?.label}
          </Button>
        </Card>

        <p className="text-center text-sm text-gray-500 mt-6">
          Demo credentials: Select any role and user above
        </p>
      </div>
    </div>
  );
}