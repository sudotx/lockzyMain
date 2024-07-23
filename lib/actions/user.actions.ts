"use server";

import { doc } from "@firebase/firestore";
import { createUserWithEmailAndPassword, fetchSignInMethodsForEmail } from "firebase/auth";
import { get, onValue, ref, set, update } from "firebase/database";
import { getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, databa2e, db, timeStamp } from "../config";
import { parseStringify } from "../utils";

// Define user parameters type
type CreateUserParams = {
  email: string;
  name: string;
};

// Create a new user
export const createUserProfile = async (user: CreateUserParams) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, "lockzy1234");
    const userRecord = userCredential.user;

    if (!userRecord) throw new Error("User creation failed");

    let newUserId = userRecord.uid;

    const newUserRefFirestore = doc(db, "users", newUserId);

    await setDoc(newUserRefFirestore, {
      uid: newUserId,
      name: user.name,
      email: user.email,
    });

    return parseStringify({
      id: newUserId,
      ...user
    });

  } catch (error: any) {
    console.error("An error occurred while creating a new user:", error);
  }
};


// Register a patient (or user) with email
export const registerPatient = async (user: CreateUserParams) => {
  try {

    // Check if email is already registered
    const signInMethods = await fetchSignInMethodsForEmail(auth, user.email);

    let userRecord;
    if (signInMethods.length > 0) {
      // User exists, retrieve user record
      // userRecord = await getUserByEmail(user.email);
      userRecord = {}
    } else {
      // User does not exist, create a new user
      const userCredential = await createUserWithEmailAndPassword(auth, user.email, "temporary-password");
      userRecord = userCredential.user;
    }

    if (!userRecord) throw new Error("User registration failed");

    // Save new user in Realtime Database
    const newUserRef = ref(databa2e, `users/${userRecord.uid}`);
    await set(newUserRef, {
      name: user.name,
      email: user.email,
      createdAt: timeStamp(),
    });

    // Return the user data
    return parseStringify({
      id: userRecord.uid,
      name: user.name,
      email: user.email,
    });

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

import { collection, query, where, getDocs } from "firebase/firestore";

// Get user by email
export const getUserByEmail = async (email: string) => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No user found with this email');
      return null;
    }

    // Assuming email is unique, we'll return the first matching document
    const userDoc = querySnapshot.docs[0];
    return {
      id: userDoc.id,
      ...userDoc.data()
    };
  } catch (error) {
    console.error("An error occurred while retrieving the user by email:", error);
    return null;
  }
};

