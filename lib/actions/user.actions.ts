"use server";

import { auth, databa2e, db, timeStamp } from "../config";
import { parseStringify } from "../utils";


export const createUser = async (user: CreateUserParams) => {
  try {
    const userRecord = await auth.createUser({
      email: user.email,
      displayName: user.name,
    });

    const newUserRef = databa2e.ref('users').push();

    await newUserRef.set({
      uid: userRecord.uid,
      name: user.name,
      email: user.email,
    });

    return parseStringify({
      id: newUserRef.key,
      uid: userRecord.uid,
      ...user
    });
  } catch (error: any) {
    console.error("An error occurred while creating a new user:", error);
  }
};

export const registerPatient = async (user: CreateUserParams) => {
  try {
    const existingUser = await auth.getUserByEmail(user.email).catch(() => null);
    let userRecord;
    if (existingUser) {
      // throw new Error('User with this email already exists');
      userRecord = existingUser;
    } else {
      userRecord = await auth.createUser({
        email: user.email,
        displayName: user.name,
      });
    }

    // Create user document in Realtime Database
    const newUserRef = databa2e.ref('users').child(userRecord.uid);
    await newUserRef.set({
      name: user.name,
      email: user.email,
      createdAt: timeStamp,
    });

    // Return the new user data
    return parseStringify({
      id: userRecord.uid,
      name: user.name,
      email: user.email,
    });
  } catch (error: any) {
    console.error("An error occurred while creating a new user:", error);
  }
};



export const getUser = async (userId: string) => {
  try {

    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      console.log('No such user!');
      return null;
    } else {
      return parseStringify(userDoc.data());
    }

  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

export const getPatient = async (userId: string) => {
  try {
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      console.log('No such user!');
      return null;
    } else {
      return {
        id: userDoc.id,
        ...userDoc.data()
      };
    }

    // return parseStringify(userDoc.data());
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};

async function writeUserData(userId: string, name: string, email: string) {
  try {
    await databa2e.ref('users/' + userId).set({
      username: name,
      email: email
    });
    console.log('Data written successfully');
  } catch (error) {
    console.error('Error writing data:', error);
  }
}
async function readUserData(userId: string) {
  try {
    const snapshot = await databa2e.ref('users/' + userId).once('value');
    return snapshot.val();
  } catch (error) {
    console.error('Error reading data:', error);
    return null;
  }
}

async function updateUserEmail(userId: string, newEmail: string) {
  try {
    await databa2e.ref('users/' + userId).update({
      email: newEmail
    });
    console.log('Data updated successfully');
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

async function deleteUser(userId: string) {
  try {
    await databa2e.ref('users/' + userId).remove();
    console.log('Data deleted successfully');
  } catch (error) {
    console.error('Error deleting data:', error);
  }
}

export async function registerBiometricAccess(doorId: string) {
  try {
    const doorRef = databa2e.ref(`doors/${doorId}`);
    const snapshot = await doorRef.once('value');
    const doorData = snapshot.val();

    if (doorData) {
      const updates: { [key: string]: any } = {};
      updates[`doors/${doorId}/lastAccessed`] = timeStamp;
      updates[`users/${doorData.userId}/doorStatus`] = 'open';

      await databa2e.ref().update(updates);
    }
  } catch (error) {
    console.error("Error registering biometric access:", error);
    throw error;
  }
}

export async function listenToDoorStatus(doorId: string, callback: (status: string) => void) {
  const doorRef = databa2e.ref(`doors/${doorId}/status`);
  doorRef.on('value', (snapshot: { val: () => any; }) => {
    const status = snapshot.val();
    callback(status);
  });
}

export async function changeDoorStatus(userId: string, doorId: string, status: 'open' | 'closed') {
  try {
    const updates: { [key: string]: any } = {};
    updates[`doors/${doorId}/status`] = status;
    updates[`doors/${doorId}/lastAccessed`] = timeStamp;
    updates[`users/${userId}/doorStatus`] = status;

    await databa2e.ref().update(updates);
  } catch (error) {
    console.error("Error changing door status:", error);
  }
}

export async function getUserByEmail(email: string) {
  try {
    const userRecord = await auth.getUserByEmail(email);
    return userRecord;
  } catch (error) {
    console.error("Error getting user:", error);
  }
}

export async function associateUserWithDoor(userId: string, doorId: string) {
  try {
    await db.collection('doors').doc(doorId).update({
      userId: userId
    });
    await db.collection('users').doc(userId).update({
      [`doors.${doorId}`]: true
    });
    return { message: 'User associated with door successfully' };
  } catch (error) {
    console.error("Error associating user with door:", error);
  }
}

