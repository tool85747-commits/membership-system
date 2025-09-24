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
  const { name, phoneE164 } = data;

  if (!name || !phoneE164) {
    throw new functions.https.HttpsError('invalid-argument', 'Name and phone are required');
  }

  try {
    // Validate phone number
    const phoneNumber = parsePhoneNumber(phoneE164);
    if (!phoneNumber || !phoneNumber.isValid()) {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid phone number');
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
      memos: [],
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
      details: { userId, token, phoneE164 },
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
  const { token, action, amount, campaignId = 'default', rewardDetails } = data;

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
      let rewardData = null;

      // Apply action
      switch (action) {
        case 'addStamp':
          const currentStamps = loyalty.stamps[campaignId] || 0;
          const newStamps = currentStamps + (amount || 1);
          loyalty.stamps[campaignId] = newStamps;
          
          // Check if reward threshold reached (10 stamps)
          if (newStamps >= 10 && currentStamps < 10) {
            const rewardId = db.collection('rewards').doc().id;
            
            rewardData = {
              id: rewardId,
              userId,
              outletId: 'default',
              title: 'Free Coffee',
              details: 'Congratulations! You\'ve earned a free coffee.',
              issuedAt: now,
              redeemable: true,
              autoRedeem: false
            };

            // Create reward
            transaction.set(db.collection('rewards').doc(rewardId), rewardData);

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
            loyalty.stamps[campaignId] = 0; // Reset stamps
            rewardIssued = true;
          }
          break;

        case 'addPoints':
          loyalty.points += (amount || 1);
          break;

        case 'issueInstantReward':
          const instantRewardId = db.collection('rewards').doc().id;
          
          rewardData = {
            id: instantRewardId,
            userId,
            outletId: 'default',
            title: rewardDetails?.title || 'Instant Reward',
            details: rewardDetails?.message || 'Special reward from staff',
            issuedAt: now,
            redeemable: true,
            autoRedeem: false
          };

          transaction.set(db.collection('rewards').doc(instantRewardId), rewardData);

          transaction.set(db.collection('modalEvents').doc(), {
            userId,
            type: 'instantReward',
            rewardId: instantRewardId,
            message: rewardDetails?.message || 'You\'ve received a special reward!',
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
        details: { token, amount, campaignId, rewardIssued },
        before,
        after: loyalty,
        ts: now
      });

      return { success: true, loyalty, reward: rewardData };
    });
  } catch (error) {
    console.error('Staff action error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to execute staff action');
  }
});

// Redeem reward function
export const redeemReward = functions.https.onCall(async (data, context) => {
  const { userToken, rewardId } = data;

  if (!userToken || !rewardId) {
    throw new functions.https.HttpsError('invalid-argument', 'User token and reward ID are required');
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
    const rewardRef = db.collection('rewards').doc(rewardId);
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
        action: 'redeem_reward',
        details: { rewardId, rewardTitle: reward.title },
        before: { redeemedAt: null },
        after: { redeemedAt: now },
        ts: now
      });

      return { success: true, loyalty };
    });
  } catch (error) {
    console.error('Redeem reward error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to redeem reward');
  }
});

// Admin publish function
export const adminPublish = functions.https.onCall(async (data, context) => {
  const { outletId, templateJson, content, settings } = data;

  if (!outletId) {
    throw new functions.https.HttpsError('invalid-argument', 'Outlet ID is required');
  }

  try {
    const now = admin.firestore.Timestamp.now();
    const batch = db.batch();
    
    // Update outlet
    const outletRef = db.collection('outlets').doc(outletId);
    batch.set(outletRef, {
      id: outletId,
      ...settings,
      published: templateJson,
      updatedAt: now
    }, { merge: true });

    // Update content if provided
    if (content && Array.isArray(content)) {
      content.forEach((item: any) => {
        const contentRef = db.collection('content').doc(item.id || db.collection('content').doc().id);
        batch.set(contentRef, {
          ...item,
          outletId,
          updatedAt: now
        }, { merge: true });
      });
    }

    await batch.commit();

    return { success: true };
  } catch (error) {
    console.error('Admin publish error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to publish settings');
  }
});

// Task complete function
export const taskComplete = functions.https.onCall(async (data, context) => {
  const { userToken, ruleId, clientEventToken, lat, lng } = data;

  if (!userToken || !ruleId) {
    throw new functions.https.HttpsError('invalid-argument', 'User token and rule ID are required');
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
    const loyaltyRef = db.collection('customer_loyalty').doc(userId);
    const now = admin.firestore.Timestamp.now();

    return await db.runTransaction(async (transaction) => {
      const loyaltyDoc = await transaction.get(loyaltyRef);
      
      if (!loyaltyDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Loyalty record not found');
      }

      const loyalty = loyaltyDoc.data()!;

      // Simple reward for sharing
      if (ruleId === 'share-reward') {
        loyalty.points += 5; // Award 5 points for sharing
        loyalty.lastActivity = now;

        transaction.update(loyaltyRef, loyalty);

        // Create audit log
        transaction.set(db.collection('audit').doc(), {
          actorId: userId,
          action: 'task_complete',
          details: { ruleId, clientEventToken, pointsAwarded: 5 },
          before: { points: loyalty.points - 5 },
          after: { points: loyalty.points },
          ts: now
        });
      }

      return { success: true, loyalty };
    });
  } catch (error) {
    console.error('Task complete error:', error);
    throw new functions.https.HttpsError('internal', 'Failed to complete task');
  }
});

// Export CSV function
export const exportCsv = functions.https.onCall(async (data, context) => {
  const { type } = data;

  // In a real implementation, this would generate and return a CSV download URL
  return { url: `https://example.com/${type}.csv` };
});

// Undo action function
export const undoAction = functions.https.onCall(async (data, context) => {
  const { actionId } = data;
  
  // Implementation would check if action is within 5 minute window and revert
  return { success: true };
});