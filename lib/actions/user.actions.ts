"use server";

import { doc } from "@firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { get, onValue, ref, serverTimestamp, set, update } from "firebase/database";
import { getDoc, updateDoc } from "firebase/firestore";
import { auth, databa2e, db, timeStamp } from "../config";
import { parseStringify } from "../utils";

// Define user parameters type
type CreateUserParams = {
  email: string;
  password: string;
};

type RegisterUserParams = {
  id: number;
  userId: string;
  privacyConsent: boolean;
};

// Create a new user
export const createUserProfile = async (user: CreateUserParams) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
    const newUser = userCredential.user;

    return {
      uid: newUser.uid,
      email: user.email,
      createdAt: new Date(),
    };

  } catch (error) {
    console.error("An error occurred while creating a new user:", error);
    throw error;
  }
};

// Register a patient (or user) with email
export const registerUser = async (user: RegisterUserParams) => {
  try {

    const { id, privacyConsent, userId } = user

    // Update the user's data in the Realtime Database
    const userRef = ref(databa2e, `users/${id}`);
    await update(userRef, {
      id,
      userId,
      privacyConsent,
      updatedAt: serverTimestamp()
    });

    // Return the updated user data
    return {
      id,
      idNumber: userId,
      privacyConsent
    };

  } catch (error: any) {
    console.error("An error occurred while registering the patient:", error);
  }
};

// Get user details from Firestore
export const getUser = async (userId: string) => {
  try {
    // Create a reference to the user's document
    const userDocRef = doc(db, "users", userId);

    // Retrieve the document
    const userDocSnap = await getDoc(userDocRef);

    // Check if the document exists
    if (!userDocSnap.exists()) {
      console.log('No such user!');
      return null;
    } else {
      return parseStringify(userDocSnap.data());
    }
  } catch (error) {
    console.error("An error occurred while retrieving the user details:", error);
  }
};

// Write user data to Realtime Database
export async function writeLogData(logId: string, name: string, email: string) {
  try {
    // Create a reference to the user's data path
    const userRef = ref(databa2e, `logs/${logId}`);

    // Write the user data to Realtime Database
    await set(userRef, {
      username: name,
      email: email
    });

    console.log('Data written successfully');
  } catch (error) {
    console.error('Error writing data:', error);
  }
}

// Read log data from Realtime Database
export async function readLogData(logId: string) {
  try {
    const userRef = ref(databa2e, `logs/${logId}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (error) {
    console.error('Error reading data:', error);
    return null;
  }
}

export async function registerBiometricAccess(doorId: string) {
  const doorRef = ref(databa2e, `doors/${doorId}`);

  try {
    const doorSnapshot = await get(doorRef);
    const doorData = doorSnapshot.val();

    if (doorData) {
      const updates = {
        [`doors/${doorId}/lastAccessed`]: timeStamp(),
        [`users/${doorData.userId}/doorStatus`]: 'open'
      };

      await update(ref(databa2e), updates);
    }
  } catch (error) {
    console.error("Error registering biometric access:", error);
    throw error;
  }
}

export const getDoorStatus = (doorId: string) => {
  return new Promise<boolean>((resolve, reject) => {
    const doorStatusRef = ref(databa2e, `doors/${doorId}/status`);
    onValue(doorStatusRef, (snapshot) => {
      const status = snapshot.val();
      resolve(status === 1);
    }, (error) => {
      reject(error);
    });
  });
};

export const changeDoorStatus = async (userId: string, doorId: string, status: 'open' | 'closed') => {
  const updates = {
    [`doors/${doorId}/status`]: status,
    [`doors/${doorId}/lastAccessed`]: timeStamp(),
    [`users/${userId}/doorStatus`]: status
  };

  try {
    await update(ref(databa2e), updates);
  } catch (error) {
    console.error("Error changing door status:", error);
    throw error;
  }
};

export async function associateUserWithDoor(userId: string, doorId: string) {
  const doorRef = doc(db, 'doors', doorId);
  const userRef = doc(db, 'users', userId);

  try {
    await Promise.all([
      updateDoc(doorRef, { userId }),
      updateDoc(userRef, { [`doors.${doorId}`]: true })
    ]);

    return { message: 'User associated with door successfully' };
  } catch (error) {
    console.error("Error associating user with door:", error);
    throw error;
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    const userCred = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return userCred.user.toJSON();
  } catch (error: any) {
    console.error("Error signin in", error);
  }
}