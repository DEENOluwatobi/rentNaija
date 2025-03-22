import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch } from "react-redux"; 
import { updateSubscription } from "@/redux/userSlice";

const useSubscriptionListener = (userId: number | null) => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userId) return;

        // Reference the Firestore user document
        // const userDocRef = doc(db, "users", String(userId));

        // // Listen for real-time updates
        // const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        //     if (docSnapshot.exists()) {
        //         const userData = docSnapshot.data();
        //         dispatch(updateSubscription(userData.isSubscribed)); // Update Redux state
        //     }
        // });

        // return () => unsubscribe(); // Cleanup listener on unmount
    }, [userId, dispatch]);
};

export default useSubscriptionListener;
