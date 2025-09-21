import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const templates = [
  { id: 'classic-stamp', name: 'Classic Stamp Card', description: 'Traditional stamp grid layout' },
  { id: 'minimal-points', name: 'Minimal Points', description: 'Clean progress bar design' },
  { id: 'bold-promo', name: 'Bold Promo', description: 'Eye-catching promotional style' },
  { id: 'image-hero', name: 'Image Hero', description: 'Full-bleed hero with overlay' },
  { id: 'compact-list', name: 'Compact List', description: 'Rewards-first list view' },
  { id: 'two-column', name: 'Two-Column Compact', description: 'Side-by-side layout' },
  { id: 'calendar-checkin', name: 'Calendar Check-In', description: 'Day-based visit interface' },
  { id: 'receipt-style', name: 'Receipt Style', description: 'Transaction-like appearance' },
  { id: 'loyalty-wallet', name: 'Loyalty Wallet', description: 'Card-style wallet layout' },
  { id: 'coupon-book', name: 'Coupon Book', description: 'Voucher collection view' },
  { id: 'event-promo', name: 'Event Promo', description: 'Limited-time promotion banner' },
  { id: 'social-share', name: 'Social Share Focus', description: 'Share-centric design' },
  { id: 'membership-pass', name: 'Membership Pass', description: 'Emphasize member benefits' },
  { id: 'minimal-dark', name: 'Minimal Dark', description: 'Dark mode aesthetic' },
  { id: 'product-bundles', name: 'Product Bundles', description: 'Bundled rewards promotion' },
  { id: 'cafe-menu', name: 'Cafe Menu + Card', description: 'Integrated menu preview' },
  { id: 'spa-beauty', name: 'Spa/Salon Beauty', description: 'Elegant visual-first layout' },
  { id: 'gym-checkin', name: 'Gym Check-In', description: 'Visit counter focused' },
  { id: 'restaurant-table', name: 'Restaurant Table Offer', description: 'Dine-in redemption flow' },
  { id: 'seasonal-promo', name: 'Seasonal Promo', description: 'Easy seasonal customization' },
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelect: (template: string) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelect
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Templates</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template, index) => (
          <motion.div
            key={template.id}
            className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelect(template.id)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.02 }}
            whileHover={{ scale: 1.02 }}
          >
            {selectedTemplate === template.id && (
              <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
            
            <div className="h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-3 flex items-center justify-center">
              <span className="text-xs text-gray-500">Preview</span>
            </div>
            
            <h4 className="font-medium text-gray-900 text-sm mb-1">
              {template.name}
            </h4>
            <p className="text-xs text-gray-600">
              {template.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};