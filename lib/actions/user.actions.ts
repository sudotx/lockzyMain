"use server";

import { doc } from "@firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { get, onValue, ref, update } from "firebase/database";
import { getDoc, updateDoc } from "firebase/firestore";
import { auth, databa2e, db } from "../config";
import { parseStringify } from "../utils";

type CreateUserParams = {
  email: string;
  password: string;
};

type UserDetails = {
  id: string;
  email: string;
  doorId?: string;
  lastUpdated?: string;
};

export const createUserProfile = async (user: CreateUserParams) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
    const fingerPrintId = await getFingerPrintId();

    const newUser = userCredential.user;
    const doorId = fingerPrintId.id;

    const userDocRef = doc(db, "users", doorId);

    const userDetails: UserDetails = {
      id: newUser.uid,
      email: user.email,
      doorId: doorId || null,
      lastUpdated: new Date().toISOString(),
    };

    // Update Firestore with user details
    await updateDoc(userDocRef, userDetails);

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

export const changeDoorStatus = async (status: 0 | 1, mode: 0 | 1) => {
  const fingerprintRef = ref(databa2e, 'Fingerprint');

  try {
    const updates = {
      Del: status,
      Mode: mode,
    };

    await update(fingerprintRef, updates);
    return { success: true, message: "Door Mode updated successfully" };
  } catch (error) {
    console.error("Error updating fingerprint data:", error);
    throw error;
  }
};

export const getFingerPrintId = async () => {
  const fingerprintRef = ref(databa2e, 'Fingerprint');

  try {
    const snapshot = await get(fingerprintRef);
    const fingerprintData = snapshot.val();

    if (fingerprintData && fingerprintData.Id) {
      return { success: true, id: fingerprintData.Id };
    } else {
      return { success: false, message: "Fingerprint ID not found" };
    }
  } catch (error) {
    console.error("Error retrieving fingerprint ID:", error);
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

export const signOutUser = async () => {
  try {
    await signOut(auth);
    console.log("User signed out successfully");
    return { success: true, message: "User signed out" };
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};