#!/bin/bash

# Demo data seeding script
# Requires ALLOW_DEMO_SEED=true to run

if [ "$ALLOW_DEMO_SEED" != "true" ]; then
  echo "❌ Demo seeding is disabled. Set ALLOW_DEMO_SEED=true to enable."
  exit 1
fi

echo "🌱 Seeding demo data..."
echo "⚠️  WARNING: This will add demo data to your database!"
echo "   Only run this in development environments."

read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Cancelled."
  exit 1
fi

# Add demo data seeding logic here
echo "✅ Demo data seeded successfully!"
echo "🧹 Remember to run 'npm run check-no-demo' before production deployment."