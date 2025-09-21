import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchCustomers, User } from '../../lib/firestore';
import { useCustomerLoyalty } from '../../hooks/useFirestore';

export const CustomerSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { loyalty } = useCustomerLoyalty(selectedUser?.id || null);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.length >= 3) {
        setIsSearching(true);
        try {
          const searchResults = await searchCustomers(searchQuery);
          setResults(searchResults);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Search</h2>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by token, phone, or name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
      {isSearching && (
        <div className="mt-4 text-center">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        </div>
      )}
      
      {results.length > 0 && (
        <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
          {results.map((user) => (
            <div
              key={user.id}
              className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{user.firstName}</p>
                  <p className="text-sm text-gray-600">
                    Token: {user.token} • {user.phoneE164}
                  </p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedUser && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">
            {selectedUser.firstName} ({selectedUser.token})
          </h3>
          {loyalty && (
            <div className="space-y-1 text-sm text-gray-600">
              <p>Stamps: {loyalty.stamps['default'] || 0}</p>
              <p>Points: {loyalty.points}</p>
              <p>Phone: {selectedUser.phoneE164}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};