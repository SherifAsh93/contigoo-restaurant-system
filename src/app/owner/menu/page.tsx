'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RoleLayout } from '@/components/RoleLayout';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { MenuItem, MenuCategory } from '@/types';
import { MOCK_MENU, MOCK_CATEGORIES } from '@/lib/mockData';
import { formatCurrency } from '@/lib/utils';

export default function OwnerMenuPage() {
  const { menu, updateMenuItem } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('mains');
  const [searchTerm, setSearchTerm] = useState('');
  const [formState, setFormState] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'mains' as MenuCategory,
    available: true,
    prepTimeMinutes: 15,
    allergens: '',
  });

  const handleAddItem = () => {
    setEditingItem(null);
    setFormState({ name: '', description: '', price: 0, category: 'mains', available: true, prepTimeMinutes: 15, allergens: '' });
    setShowModal(true);
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setFormState({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      available: item.available,
      prepTimeMinutes: item.prepTimeMinutes,
      allergens: item.allergens.join(', '),
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: MenuItem = {
      id: editingItem?.id || `m${Date.now()}`,
      name: formState.name,
      description: formState.description,
      price: formState.price,
      category: formState.category,
      available: formState.available,
      prepTimeMinutes: formState.prepTimeMinutes,
      allergens: formState.allergens.split(',').map(a => a.trim()).filter(Boolean),
    };
    updateMenuItem(newItem);
    setShowModal(false);
  };

  const filteredMenu = menu
    .filter(item => item.category === activeCategory)
    .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <RoleLayout role="owner" title="Menu Management" subtitle="Manage your restaurant menu items">
      {/* Filters */}
      <Card variant="elevated" padding="md" className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2 flex-wrap">
            {MOCK_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === cat.value
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="flex-1 max-w-md"
            leftIcon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
          />
        </div>
      </Card>

      {/* Add Item Button */}
      <div className="mb-6 flex justify-end">
        <Button onClick={handleAddItem}>+ Add Menu Item</Button>
      </div>

      {/* Menu Items */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMenu.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Card variant="outlined" padding="lg" className="border-2 border-dashed border-gray-300">
              <p className="text-gray-500">No menu items found</p>
            </Card>
          </div>
        ) : (
          filteredMenu.map(item => (
            <MenuItemCard key={item.id} item={item} onEdit={handleEditItem} onDelete={() => {}} />
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <Card variant="elevated" padding="lg" className="w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-4 border-b border-gray-100">
              <h3 className="text-xl font-bold">{editingItem ? 'Edit Menu Item' : 'Add Menu Item'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Item Name" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} required />
                <Select
                  label="Category"
                  value={formState.category}
                  onChange={e => setFormState({...formState, category: e.target.value as any})}
                  options={MOCK_CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
                />
                <Input label="Price ($)" type="number" step="0.01" min="0" value={formState.price} onChange={e => setFormState({...formState, price: parseFloat(e.target.value)})} required />
                <Input label="Prep Time (minutes)" type="number" min="1" value={formState.prepTimeMinutes} onChange={e => setFormState({...formState, prepTimeMinutes: parseInt(e.target.value)})} />
              </div>

              <Input label="Description" value={formState.description} onChange={e => setFormState({...formState, description: e.target.value})} />
              
              <div className="grid gap-4 md:grid-cols-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formState.available}
                    onChange={e => setFormState({...formState, available: e.target.checked})}
                    className="w-5 h-5 text-green-600 rounded border-gray-300 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Available for ordering</span>
                </label>
                <div></div>
              </div>

              <Input 
                label="Allergens (comma-separated)" 
                value={formState.allergens} 
                onChange={e => setFormState({...formState, allergens: e.target.value})}
                placeholder="dairy, gluten, nuts, eggs, seafood"
              />

              <div className="flex gap-3 pt-4 border-t border-gray-100">
                <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" className="flex-1">{editingItem ? 'Save Changes' : 'Add Item'}</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </RoleLayout>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: { value: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

function MenuItemCard({ item, onEdit, onDelete }: { item: any; onEdit: (item: any) => void; onDelete: () => void }) {
  return (
    <Card variant="elevated" padding="md" className="hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full rounded-xl bg-gray-100 mb-4 flex items-center justify-center relative">
        <span className="text-5xl">🍽️</span>
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="danger">Unavailable</Badge>
          </div>
        )}
      </div>
      
      <h4 className="font-bold text-gray-900 mb-1 truncate">{item.name}</h4>
      <p className="text-sm text-gray-500 mb-2 line-clamp-2">{item.description}</p>
      
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="default" size="sm">{item.prepTimeMinutes} min</Badge>
        <Badge variant={item.available ? 'success' : 'danger'} size="sm">
          {item.available ? 'Available' : 'Hidden'}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xl font-bold text-gray-900">{item.price.toFixed(2)}</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(item)}>Edit</Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:border-red-300" onClick={onDelete}>Delete</Button>
        </div>
      </div>
    </Card>
  );
}