"use server";

import { doc } from "@firebase/firestore";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail, getAuth, } from "firebase/auth";
import { equalTo, get, onValue, orderByChild, ref, serverTimestamp, set, update } from "firebase/database";
import { addDoc, collection, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
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

// Get patient details from Firestore
export const getPatient = async (userId: string) => {
  try {
    // Create a reference to the user's document
    const userDocRef = doc(db, "users", userId);

    // Retrieve the document snapshot
    const userDocSnap = await getDoc(userDocRef);

    // Check if the document exists
    if (!userDocSnap.exists()) {
      console.log('No such user!');
      return null;
    } else {
      // Return the document data with the document ID included
      return {
        id: userDocSnap.id,
        ...userDocSnap.data()
      };
    }
  } catch (error) {
    console.error("An error occurred while retrieving the patient details:", error);
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

// Read user data from Realtime Database
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

// Update user email in Realtime Database
export async function updateUserEmail(userId: string, newEmail: string) {
  try {
    const userRef = ref(databa2e, `users/${userId}`);
    await update(userRef, { email: newEmail });
    console.log('Data updated successfully');
  } catch (error) {
    console.error('Error updating data:', error);
  }
}

// Register biometric access and update door and user status
export async function registerBiometricAccess(doorId: string) {
  try {
    const doorRef = ref(databa2e, `doors/${doorId}`);
    const doorSnapshot = await get(doorRef);
    const doorData = doorSnapshot.val();

    if (doorData) {
      const updates: { [key: string]: any } = {};
      updates[`doors/${doorId}/lastAccessed`] = timeStamp();
      updates[`users/${doorData.userId}/doorStatus`] = 'open';

      await update(ref(databa2e), updates);
    }
  } catch (error) {
    console.error("Error registering biometric access:", error);
    throw error;
  }
}

// Listen to door status changes
export async function listenToDoorStatus(doorId: string, callback: (status: string) => void) {
  const doorRef = ref(databa2e, `doors/${doorId}/status`);
  onValue(doorRef, (snapshot) => {
    const status = snapshot.val();
    callback(status);
  });
}

// Change door status and update last accessed time
export async function changeDoorStatus(userId: string, doorId: string, status: 'open' | 'closed') {
  try {
    const updates: { [key: string]: any } = {};
    updates[`doors/${doorId}/status`] = status;
    updates[`doors/${doorId}/lastAccessed`] = timeStamp();
    updates[`users/${userId}/doorStatus`] = status;

    await update(ref(databa2e), updates);
  } catch (error) {
    console.error("Error changing door status:", error);
  }
}

// Associate a user with a door in Firestore
export async function associateUserWithDoor(userId: string, doorId: string) {
  try {
    const doorRef = doc(db, 'doors', doorId);
    const userRef = doc(db, 'users', userId);

    // Update door document
    await updateDoc(doorRef, { userId: userId });

    // Update user document
    await updateDoc(userRef, { [`doors.${doorId}`]: true });

    return { message: 'User associated with door successfully' };
  } catch (error) {
    console.error("Error associating user with door:", error);
  }
}


// Get user by email
export const getUserByEmail = async (email: string) => {
  try {
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    if (signInMethods.length > 0) {
      // User exists
      // You can then fetch additional user data from Firestore if needed
      return { email, exists: true };
    } else {
      // User does not exist
      return { email, exists: false };
    }
  } catch (error) {
    console.error("Error retrieving user by email:", error);
    return null;
  }
};

