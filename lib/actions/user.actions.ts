"use server";

import { doc } from "@firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { get, ref, update } from "firebase/database";
import { deleteDoc, getDoc, setDoc, updateDoc } from "firebase/firestore";
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

    await associateUserWithDoor(newUser.uid, doorId);

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

// export const createUserProfile2 = async (user: CreateUserParams) => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
//     const fingerPrintId = await getFingerPrintId();

//     const newUser = userCredential.user;
//     const doorId = fingerPrintId.id;

//     const userDocRef = doc(db, "users", newUser.uid);

//     const userDetails: UserDetails = {
//       id: newUser.uid,
//       email: user.email,
//       doorId: doorId || null,
//       lastUpdated: new Date().toISOString(),

//     };

//     await associateUserWithDoor(newUser.uid, doorId);

//     await updateDoc(userDocRef, userDetails);

//     return {
//       uid: newUser.uid,
//       email: user.email,
//       createdAt: new Date(),
//     };

//   } catch (error) {
//     console.error("An error occurred while creating a new user:", error);
//     throw error;
//   }
// };


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

export const readLogData = async (logId: string) => {
  try {
    const userRef = ref(databa2e, `logs/${logId}`);
    const snapshot = await get(userRef);
    return snapshot.val();
  } catch (error) {
    console.error('Error reading data:', error);
    return null;
  }
}

export const changeDoorStatus = async (status: 0 | 1, mode: 0 | 1) => {
  const fingerprintRef = ref(databa2e, 'Fingerprint');

  try {
    const updates = {
      Del: status,
      Mode: mode,
    };

    await update(fingerprintRef, updates);
    return { success: true, message: "Mode updated successfully" };
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

export const getAndDecrementFingerprintId = async () => {
  const fingerprintRef = ref(databa2e, 'Fingerprint');
  try {
    // Retrieve the current fingerprint ID
    const snapshot = await get(fingerprintRef);
    const fingerprintData = snapshot.val();

    if (fingerprintData && fingerprintData.Id) {
      const currentId = fingerprintData.Id;
      const newId = currentId - 1;

      // Update the database with the decremented ID
      await update(fingerprintRef, { Id: newId });

      return { success: true, id: newId };
    } else {
      return { success: false, message: "Fingerprint ID not found" };
    }
  } catch (error) {
    console.error("Error retrieving and updating fingerprint ID:", error);
    throw error;
  }
};
export const setFingerprintId = async (id: string) => {
  const fingerprintRef = ref(databa2e, 'Fingerprint');
  try {
    // Retrieve the current fingerprint ID
    const snapshot = await get(fingerprintRef);
    const fingerprintData = snapshot.val();

    if (fingerprintData && fingerprintData.Id) {
      const currentId = fingerprintData.Id;
      const newId = currentId - 1;

      // Update the database with the decremented ID
      await update(fingerprintRef, { Id: newId });

      return { success: true, id: newId };
    } else {
      return { success: false, message: "Fingerprint ID not found" };
    }
  } catch (error) {
    console.error("Error retrieving and updating fingerprint ID:", error);
    throw error;
  }
};
export const enrollFingerprintId = async (id: number) => {
  const fingerprintRef = ref(databa2e, 'Fingerprint');
  try {
    // Retrieve the current fingerprint ID
    const snapshot = await get(fingerprintRef);
    const fingerprintData = snapshot.val();

    if (fingerprintData && fingerprintData.Id) {

      await update(fingerprintRef, { Id: id });

      return { success: true, id: id };
    } else {
      return { success: false, message: "Fingerprint ID not found" };
    }
  } catch (error) {
    console.error("Error retrieving and updating fingerprint ID:", error);
    throw error;
  }
};

export const getCurrentPercentage = async () => {
  const sensorRef = ref(databa2e, 'Solarsensor');
  try {
    const snapshot = await get(sensorRef);
    const sensorData = snapshot.val();

    if (sensorData && sensorData.batPercent) {
      return { success: true, pct: sensorData.batPercent };
    } else {
      return { success: false, pct: "" };
    }
  } catch (error) {
    console.error("Error current percentage:", error);
    throw error;
  }
};

export const getCurrent = async () => {
  const sensorRef = ref(databa2e, 'Solarsensor');

  try {
    const snapshot = await get(sensorRef);
    const sensorData = snapshot.val();

    if (sensorData && sensorData.Current) {
      return { success: true, curr: sensorData.Current };
    } else {
      return { success: false, curr: "" };
    }
  } catch (error) {
    console.error("Error get current:", error);
    throw error;
  }
}

export const getVoltage = async () => {
  const sensorRef = ref(databa2e, 'Solarsensor');

  try {
    const snapshot = await get(sensorRef);
    const sensorData = snapshot.val();

    if (sensorData && sensorData.Voltage) {
      return { success: true, vlt: sensorData.Voltage };
    } else {
      return { success: false, vlt: "" };
    }
  } catch (error) {
    console.error("Error getting voltage", error);
    throw error;
  }
}

export const getPower = async () => {
  const sensorRef = ref(databa2e, 'Solarsensor');

  try {
    const snapshot = await get(sensorRef);
    const sensorData = snapshot.val();

    if (sensorData && sensorData.Power) {
      return { success: true, pwr: sensorData.Power };
    } else {
      return { success: false, pwr: "" };
    }
  } catch (error) {
    console.error("Error getting power:", error);
    throw error;
  }
}

export const associateUserWithDoor = async (userId: string, doorId: string) => {
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

// Function to save or update user data in Firestore
export const saveUserToFirestore = async (userDetails: UserDetails) => {
  try {
    const userDocRef = doc(db, "users", userDetails.id);
    await setDoc(userDocRef, userDetails, { merge: true }); // Use merge to update existing fields
    return { success: true, message: "User data saved successfully" };
  } catch (error) {
    console.error("Error saving user data:", error);
    throw error;
  }
};

// Function to get user data by ID from Firestore
export const getUserFromFirestore = async (userId: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      console.log("No such user!");
      return null;
    } else {
      return userDocSnap.data() as UserDetails;
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
    throw error;
  }
};

// Function to delete a user by ID from Firestore
export const deleteUserFromFirestore = async (userId: string) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await deleteDoc(userDocRef);
    return { success: true, message: "User deleted successfully" };
  } catch (error) {
    console.error("Error deleting user data:", error);
    throw error;
  }
};

// Example usage within your existing functions

// export const createUserProfile = async (user: CreateUserParams) => {
//   try {
//     const userCredential = await createUserWithEmailAndPassword(auth, user.email, user.password);
//     const fingerPrintId = await getFingerPrintId();

//     const newUser = userCredential.user;
//     const doorId = fingerPrintId.id;

//     const userDetails: UserDetails = {
//       id: newUser.uid,
//       email: user.email,
//       doorId: doorId || null,
//       lastUpdated: new Date().toISOString(),
//     };

//     await associateUserWithDoor(newUser.uid, doorId);

//     // Save user details to Firestore
//     await saveUserToFirestore(userDetails);

//     return {
//       uid: newUser.uid,
//       email: user.email,
//       createdAt: new Date(),
//     };
//   } catch (error) {
//     console.error("An error occurred while creating a new user:", error);
//     throw error;
//   }
// };

// Example of updating user profile information
export const updateUserProfile = async (userId: string, updates: Partial<UserDetails>) => {
  try {
    const userDocRef = doc(db, "users", userId);
    await updateDoc(userDocRef, updates);
    return { success: true, message: "User profile updated successfully" };
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
