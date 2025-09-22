import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { parsePhoneNumber } from 'libphonenumber-js';

admin.initializeApp();
const db = admin.firestore();

// Generate random token
function generateToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Create user function
export const createUser = functions.https.onCall(async (data, context) => {
  const { name, phoneE164, dateOfBirth } = data;

  if (!name || !phoneE164 || !dateOfBirth) {
    throw new functions.https.HttpsError('invalid-argument', 'Name, phone, and date of birth are required');
  }

  try {
    // Validate phone number
    const phoneNumber = parsePhoneNumber(phoneE164);
    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid phone number');
    }

    // Validate date of birth
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    if (age < 13 || age > 120) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid date of birth');
    }
    // Check if user already exists
    const existingUser = await db.collection('users')
      .where('phoneE164', '==', phoneE164)
      .limit(1)
      .get();

    if (!existingUser.empty) {
      const userData = existingUser.docs[0].data();
      return { userId: existingUser.docs[0].id, token: userData.token };
    }

    // Generate unique token
    let token = generateToken();
    let tokenExists = true;
    
    while (tokenExists) {
      const tokenCheck = await db.collection('users')
        .where('token', '==', token)
        .limit(1)
        .get();
      
      if (tokenCheck.empty) {
        tokenExists = false;
      } else {
        token = generateToken();
      }
    }

    const userId = db.collection('users').doc().id;
    const now = admin.firestore.Timestamp.now();

    // Create user documents in batch
    const batch = db.batch();

    // User document
    batch.set(db.collection('users').doc(userId), {
      id: userId,
      firstName: name.split(' ')[0],
      phoneE164,
      dateOfBirth,
      token,
      createdAt: now
    });

    // Customer profile
    batch.set(db.collection('customer_profile').doc(userId), {
      joined: true,
      onboardingSeen: true,
      preferences: {
        promos: true
      },
      notes: [],
      dateOfBirth,
      lastVisitAt: now
    });

    // Customer loyalty
    batch.set(db.collection('customer_loyalty').doc(userId), {
      userId,
      outletId: 'default',
      points: 10, // Welcome bonus
      stamps: { default: 0 },
      rewards: [],
      lastActivity: now
    });

    // Audit log
    batch.set(db.collection('audit').doc(), {
      actorId: 'system',
      action: 'user_created',
      details: { userId, token, phoneE164, dateOfBirth },
      before: null,
      after: { userId, token },
      ts: now
    });

    await batch.commit();

    return { userId, token };
  } catch (error) {
    console.error('Create user error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to create user');
  }
});

// Staff action function
export const staffAction = functions.https.onCall(async (data, context) => {
  const { token, action, amount, details } = data;

  if (!token || !action) {
    throw new functions.https.HttpsError('invalid-argument', 'Token and action are required');
  }

  try {
    // Find user by token
    const userQuery = await db.collection('users')
      .where('token', '==', token.toUpperCase())
      .limit(1)
      .get();

    if (userQuery.empty) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const userId = userQuery.docs[0].id;
    const loyaltyRef = db.collection('customer_loyalty').doc(userId);
    const now = admin.firestore.Timestamp.now();

    return await db.runTransaction(async (transaction) => {
      const loyaltyDoc = await transaction.get(loyaltyRef);
      
      if (!loyaltyDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Loyalty record not found');
      }

      const loyalty = loyaltyDoc.data()!;
      const before = { ...loyalty };
      let rewardIssued = false;

      // Apply action
      switch (action) {
        case 'addStamp':
          const currentStamps = loyalty.stamps['default'] || 0;
          const newStamps = currentStamps + (amount || 1);
          loyalty.stamps['default'] = newStamps;
          
          // Check if reward threshold reached (10 stamps)
          if (newStamps >= 10 && currentStamps < 10) {
            const rewardId = db.collection('rewards').doc().id;
            
            // Create reward
            transaction.set(db.collection('rewards').doc(rewardId), {
              id: rewardId,
              userId,
              outletId: 'default',
              title: 'Free Coffee',
              details: 'Congratulations! You\'ve earned a free coffee.',
              issuedAt: now,
              redeemable: true,
              autoRedeem: false
            });

            // Create modal event
            transaction.set(db.collection('modalEvents').doc(), {
              userId,
              type: 'rewardIssued',
              rewardId,
              message: 'You\'ve earned a free coffee!',
              ts: now,
              shownAt: null
            });

            loyalty.rewards.push(rewardId);
            loyalty.stamps['default'] = 0; // Reset stamps
            rewardIssued = true;
          }
          break;

        case 'addPoints':
          loyalty.points += (amount || 1);
          break;

        case 'issueRewardInstant':
          const instantRewardId = db.collection('rewards').doc().id;
          
          transaction.set(db.collection('rewards').doc(instantRewardId), {
            id: instantRewardId,
            userId,
            outletId: 'default',
            title: details?.title || 'Instant Reward',
            details: details?.message || 'Special reward from staff',
            issuedAt: now,
            redeemable: true,
            autoRedeem: false
          });

          transaction.set(db.collection('modalEvents').doc(), {
            userId,
            type: 'instantReward',
            rewardId: instantRewardId,
            message: details?.message || 'You\'ve received a special reward!',
            ts: now,
            shownAt: null
          });

          loyalty.rewards.push(instantRewardId);
          rewardIssued = true;
          break;

        default:
          throw new functions.https.HttpsError('invalid-argument', 'Invalid action');
      }

      loyalty.lastActivity = now;

      // Update loyalty record
      transaction.update(loyaltyRef, loyalty);

      // Create audit log
      transaction.set(db.collection('audit').doc(), {
        actorId: 'staff',
        action,
        details: { token, amount, rewardIssued },
        before,
        after: loyalty,
        ts: now
      });

      return { success: true, loyalty };
    });
  } catch (error) {
    console.error('Staff action error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to execute staff action');
  }
});

// Redeem voucher function
export const redeemVoucher = functions.https.onCall(async (data, context) => {
  const { userToken, voucherId } = data;

  if (!userToken || !voucherId) {
    throw new functions.https.HttpsError('invalid-argument', 'User token and voucher ID are required');
  }

  try {
    // Find user by token
    const userQuery = await db.collection('users')
      .where('token', '==', userToken.toUpperCase())
      .limit(1)
      .get();

    if (userQuery.empty) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    const userId = userQuery.docs[0].id;
    const rewardRef = db.collection('rewards').doc(voucherId);
    const loyaltyRef = db.collection('customer_loyalty').doc(userId);
    const now = admin.firestore.Timestamp.now();

    return await db.runTransaction(async (transaction) => {
      const rewardDoc = await transaction.get(rewardRef);
      const loyaltyDoc = await transaction.get(loyaltyRef);

      if (!rewardDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Reward not found');
      }

      if (!loyaltyDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Loyalty record not found');
      }

      const reward = rewardDoc.data()!;
      const loyalty = loyaltyDoc.data()!;

      if (reward.redeemedAt) {
        throw new functions.https.HttpsError('failed-precondition', 'Reward already redeemed');
      }

      if (reward.userId !== userId) {
        throw new functions.https.HttpsError('permission-denied', 'Reward does not belong to user');
      }

      // Mark reward as redeemed
      transaction.update(rewardRef, {
        redeemedAt: now
      });

      // Update loyalty record
      loyalty.lastActivity = now;
      transaction.update(loyaltyRef, loyalty);

      // Create audit log
      transaction.set(db.collection('audit').doc(), {
        actorId: userId,
        action: 'redeem_voucher',
        details: { voucherId, rewardTitle: reward.title },
        before: { redeemedAt: null },
        after: { redeemedAt: now },
        ts: now
      });

      return { success: true, loyalty };
    });
  } catch (error) {
    console.error('Redeem voucher error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to redeem voucher');
  }
});

// Admin publish function
export const adminPublish = functions.https.onCall(async (data, context) => {
  const { outletId, settings } = data;

  if (!outletId || !settings) {
    throw new functions.https.HttpsError('invalid-argument', 'Outlet ID and settings are required');
  }

  try {
    const now = admin.firestore.Timestamp.now();
    
    await db.collection('outlets').doc(outletId).set({
      id: outletId,
      ...settings,
      updatedAt: now
    }, { merge: true });

    return { success: true };
  } catch (error) {
    console.error('Admin publish error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to publish settings');
  }
});

// Export functions (simplified for demo)
export const exportCustomers = functions.https.onCall(async (data, context) => {
  // In a real implementation, this would generate and return a CSV download URL
  return { url: 'https://example.com/customers.csv' };
});

export const exportAudit = functions.https.onCall(async (data, context) => {
  return { url: 'https://example.com/audit.csv' };
});

export const exportVoucherUsage = functions.https.onCall(async (data, context) => {
  return { url: 'https://example.com/vouchers.csv' };
});

// Undo action function
export const undoAction = functions.https.onCall(async (data, context) => {
  const { actionId } = data;
  
  // Implementation would check if action is within 5 minute window and revert
  return { success: true };
});