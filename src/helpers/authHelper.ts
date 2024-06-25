import { auth, db } from "@/utils/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";

async function getUser(email: string) {
  const userDoc = await getDoc(doc(db, "users", email));

  if (!userDoc.exists) return null;

  return userDoc.data()
}

export const signUpWithEmail = async (email: string, password: string, committee: string, name: string, phone: string, gender: string) => {

  const userExists = await getUser(email);

  if (!!userExists) throw new Error("User Already Exists !!");

  const { data, error, success } = await createUserWithEmailAndPassword(auth, email ,password)
    .then((result) => {
      const user = result.user;
      return { success: true, error: null, data: user }
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;

      return { success: false, error: { errorCode, errorMessage }, data: null }
    });

  if (!success) throw new Error(error?.errorMessage);

  const totalCandidates = (await getDocs(collection(db, "users"))).docs.length;

  const { displayName, phoneNumber, providerData, refreshToken } = data;

  await setDoc(doc(db, "users", data.email), { committee, name, phone, displayName, email, phoneNumber, providerData, refreshToken, isAdmin: false, isFrozen: true, candidate_number: totalCandidates + 1, gender });

  return { ...data, committee, name, phone, isAdmin: false, isFrozen: true, candidate_number: totalCandidates + 1, gender };

}

export const signInWithEmail = async (email: string, password: string) => {
  const userExists = await getUser(email);

  if (!userExists) throw new Error("User Doesn't Exists !!");

  const { data, error, success } = await signInWithEmailAndPassword(auth, email, password)
    .then((result) => {
      const user = result.user;
      return { success: true, error: null, data: user }
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;

      return { success: false, error: { errorCode, errorMessage }, data: null }
    });

  if (!success) throw new Error(error?.errorMessage);


  return { ...data, ...userExists };
}