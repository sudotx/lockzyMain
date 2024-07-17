"use server";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config";
import { parseStringify } from "../utils";
import { setDoc, doc, Query, getDoc } from "firebase/firestore";


// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    const newuser = createUserWithEmailAndPassword(
      auth,
      user.email,
      "password"
    );

    return parseStringify(newuser);
  } catch (error: any) {
    // Check existing user
    // if (error.code === 'auth/email-already-in-use') {
    //   // Check existing user
    //   const existingUser = await getUserByEmail(auth, user.email);
    //   return existingUser;
    // }
    // console.error("An error occurred while creating a new user:", error);
  }
};

// GET USER
export const getUser = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return parseStringify(userDoc.data());
    } else {
      throw new Error('User not found');
    }

  } catch (error) {
    console.error(
      "An error occurred while retrieving the user details:",
      error
    );
  }
};

// REGISTER PATIENT
export const registerPatient = async ({
  ...patient
}: RegisterUserParams) => {
  try {
    // Create new patient document -> https://appwrite.io/docs/references/cloud/server-nodejs/databases#createDocument
    // const newPatient = await databases.createDocument(
    //   DATABASE_ID!,
    //   PATIENT_COLLECTION_ID!,
    //   ID.unique(),
    //   {}
    // );

    // return parseStringify(newPatient);
  } catch (error) {
    console.error("An error occurred while creating a new patient:", error);
  }
};

// GET PATIENT
export const getPatient = async (userId: string) => {
  try {
    // const patients = await databases.listDocuments(
    //   DATABASE_ID!,
    //   PATIENT_COLLECTION_ID!,
    //   [Query.equal("userId", [userId])]
    // );

    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }

    return parseStringify(userDoc.data());
  } catch (error) {
    console.error(
      "An error occurred while retrieving the patient details:",
      error
    );
  }
};
