import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-number-input';
import { parsePhoneNumber } from 'libphonenumber-js';
import { createUser } from '../lib/firestore';
import { useApp } from '../context/AppContext';
import 'react-phone-number-input/style.css';

interface SignupFormProps {
  onComplete: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !consent) return;

    setIsLoading(true);
    setError('');

    try {
      // Validate phone number
      const phoneNumber = parsePhoneNumber(phone);
      if (!phoneNumber || !phoneNumber.isValid()) {
        throw new Error('Please enter a valid phone number');
      }

      const phoneE164 = phoneNumber.format('E.164');
      
      // Create user via Cloud Function
      const result = await createUser({ 
        name: name.trim(), 
        phoneE164 
      });

      if (result.data) {
        const newUser = {
          id: result.data.userId,
          firstName: name.trim().split(' ')[0],
          phoneE164,
          token: result.data.token,
          createdAt: new Date() as any
        };
        
        setUser(newUser);
        onComplete();
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="max-w-md mx-auto p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Join Our Rewards Program
        </h1>
        <p className="text-gray-600 leading-relaxed">
          Join our loyalty program and earn rewards with every visit!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Enter your full name"
            required
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <PhoneInput
            value={phone}
            onChange={(value) => setPhone(value || '')}
            defaultCountry="US"
            className="w-full"
            inputComponent={({ className, ...props }) => (
              <input
                {...props}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                disabled={isLoading}
              />
            )}
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
            disabled={isLoading}
          />
          <label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed">
            I agree to receive promotional communications and understand that my data will be processed 
            according to the privacy policy.
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <motion.button
          type="submit"
          disabled={!name.trim() || !phone.trim() || !consent || isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Joining...</span>
            </div>
          ) : (
            'Join Now'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};