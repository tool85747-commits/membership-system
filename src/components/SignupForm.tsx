import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PhoneInput from 'react-phone-number-input';
import { parsePhoneNumber } from 'libphonenumber-js';
import { createUser } from '../lib/firestore';
import { useApp } from '../context/AppContext';
import { AsyncButton } from './ui/AsyncButton';
import 'react-phone-number-input/style.css';

interface SignupFormProps {
  onComplete: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const { setUser } = useApp();

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim() || !consent) {
      throw new Error('Please fill in all required fields');
    }

    try {
      // Validate phone number
      if (!phone || phone.length < 10) {
        throw new Error('Please enter a valid phone number');
      }
      
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
      throw new Error(error.message || 'Failed to create account. Please try again.');
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

      <div className="space-y-6">
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
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <PhoneInput
              value={phone}
              onChange={(value) => setPhone(value || '')}
              defaultCountry="US"
              international
              countryCallingCodeEditable={false}
              className="phone-input-container"
              inputComponent={React.forwardRef<HTMLInputElement, any>(({ className, ...props }, ref) => (
                <input
                  {...props}
                  ref={ref}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-base"
                />
              ))}
              placeholder="Enter your phone number"
              required
            />
          </div>
        </div>


        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <label htmlFor="consent" className="text-sm text-gray-600 leading-relaxed">
            I agree to receive promotional communications and understand that my data will be processed 
            according to the privacy policy.
          </label>
        </div>

        <AsyncButton
          asyncFn={handleSubmit}
          disabled={!name.trim() || !phone.trim() || !consent}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700"
          successMsg="Welcome! Redirecting..."
          errorMsg="Failed to join. Please try again."
        >
          Join Now
        </AsyncButton>
      </div>
    </motion.div>
  );
};