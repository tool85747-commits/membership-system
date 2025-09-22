@@ .. @@
 import React from 'react';
 import { motion } from 'framer-motion';
+import { Share2, Copy, Check } from 'lucide-react';

 interface HeroBlockProps {
-  image?: string;
-  title?: string;
-  subtitle?: string;
+  outlet: any;
+  user: any;
+  onCopyToken: () => void;
+  onShare: () => void;
+  copied: boolean;
 }

-export const HeroBlock: React.FC<HeroBlockProps> = ({ image, title, subtitle }) => {
-  if (!image) return null;
+export const HeroSection: React.FC<HeroBlockProps> = ({ 
+  outlet, 
+  user, 
+  onCopyToken, 
+  onShare, 
+  copied 
+}) => {
+  const heroImage = outlet.heroImage || 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg';

   return (
-    <motion.div
-      className="relative h-48 bg-gray-100 overflow-hidden"
-      initial={{ opacity: 0, scale: 1.05 }}
-      animate={{ opacity: 1, scale: 1 }}
-      transition={{ duration: 0.6 }}
-    >
-      <img
-        src={image}
-        alt=""
-        className="w-full h-full object-cover"
-      />
-      
-      {(title || subtitle) && (
-        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
-          <div className="text-center text-white px-4">
-            {title && (
-              <motion.h1
-                className="text-2xl font-bold mb-2"
-                initial={{ opacity: 0, y: 10 }}
-                animate={{ opacity: 1, y: 0 }}
-                transition={{ delay: 0.3, duration: 0.4 }}
-              >
-                {title}
-              </motion.h1>
-            )}
-            {subtitle && (
-              <motion.p
-                className="text-lg opacity-90"
-                initial={{ opacity: 0, y: 10 }}
-                animate={{ opacity: 1, y: 0 }}
-                transition={{ delay: 0.5, duration: 0.4 }}
-              >
-                {subtitle}
-              </motion.p>
-            )}
+    <div className="relative">
+      {/* Hero Image/Video Section */}
+      <motion.div
+        className="relative h-64 bg-gray-100 overflow-hidden"
+        initial={{ opacity: 0, scale: 1.05 }}
+        animate={{ opacity: 1, scale: 1 }}
+        transition={{ duration: 0.6 }}
+      >
+        <img
+          src={heroImage}
+          alt={outlet.name}
+          className="w-full h-full object-cover"
+        />
+        
+        {/* Business Logo Overlay */}
+        {outlet.logo && (
+          <div className="absolute top-4 left-4">
+            <img 
+              src={outlet.logo}
+              alt={outlet.name}
+              className="w-12 h-12 rounded-lg bg-white p-2 shadow-lg"
+            />
           </div>
-        </div>
-      )}
-    </motion.div>
+        )}
+
+        {/* Gradient Overlay */}
+        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
+        
+        {/* Welcome Message */}
+        <div className="absolute bottom-4 left-4 right-4">
+          <motion.div 
+            className="text-white"
+            initial={{ opacity: 0, y: 10 }}
+            animate={{ opacity: 1, y: 0 }}
+            transition={{ delay: 0.3 }}
+          >
+            <h1 className="text-2xl font-bold mb-1">
+              Hi {user.firstName} 👋
+            </h1>
+            <p className="text-white/90">Welcome to {outlet.name}</p>
+          </motion.div>
+        </div>
+      </motion.div>
+
+      {/* Token & Share Section */}
+      <motion.div
+        className="bg-white px-4 py-4 border-b border-gray-100"
+        initial={{ opacity: 0, y: 10 }}
+        animate={{ opacity: 1, y: 0 }}
+        transition={{ delay: 0.4 }}
+      >
+        <div className="flex items-center justify-between">
+          <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
+            <span className="text-sm font-mono font-medium text-gray-700">
+              Token: {user.token}
+            </span>
+            <button
+              onClick={onCopyToken}
+              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
+              aria-label="Copy token"
+            >
+              {copied ? (
+                <Check className="w-4 h-4 text-green-600" />
+              ) : (
+                <Copy className="w-4 h-4 text-gray-500" />
+              )}
+            </button>
+          </div>
+          
+          <button
+            onClick={onShare}
+            className="p-2 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
+            aria-label="Share"
+          >
+            <Share2 className="w-5 h-5 text-gray-600" />
+          </button>
+        </div>
+      </motion.div>
+    </div>
   );
 };