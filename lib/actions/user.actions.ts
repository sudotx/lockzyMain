"use server";

import { db } from "../config";
import { parseStringify } from "../utils";


// CREATE APPWRITE USER
export const createUser = async (user: CreateUserParams) => {
  try {
    const newuser = await db.collection('users').add(user);
    console.log("Document written with ID: ", newuser.id);

    return parseStringify(newuser);
  } catch (error: any) {
    console.error("An error occurred while creating a new user:", error);
  }
};

// GET USER
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

    // const userDoc = await getDoc(doc(db, 'users', userId));
    // if (userDoc.exists()) {
    //   return userDoc.data();
    // }

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
