import { db } from "@/config/firebase.config";
import { User } from "@/types";
import LoaderPage from "@/views/LoaderPage";
import { useAuth, useUser } from "@clerk/clerk-react";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

const AuthHandler = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  //   console.log(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storeData = async () => {
      if (!isSignedIn || !user) return;
      setLoading(true);
      try {
        const userRef = doc(db, "users", user.id);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          const newData: User = {
            id: user.id,
            name: user.fullName || user.firstName || "Anon",
            email: user.primaryEmailAddress?.emailAddress || "N/A",
            imageUrl: user.imageUrl,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };

          await setDoc(userRef, newData, { merge: true });
        }
      } catch (err) {
        console.error("Error storing user data:", err);
        alert("An error occurred while saving your data. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    storeData();
  }, [isSignedIn, user]);

  if (loading) {
    return <LoaderPage />;
  }

  return null;
};

export default AuthHandler;
