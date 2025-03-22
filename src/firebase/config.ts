// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCex79MzP0DnYH7BlyHSj1GKJAQrsvDEDo",
    authDomain: "wells-7a385.firebaseapp.com",
    projectId: "wells-7a385",
    storageBucket: "wells-7a385.firebasestorage.app",
    messagingSenderId: "14255022256",
    appId: "1:14255022256:web:35d055231484c4a96e5b75",
    measurementId: "G-F697HJLE0J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

 export const fcm_app = app;
const messaging = getMessaging(app);


export const fcm_analytics = analytics;


export const requestForToken = async () => {
    try {
        const currentToken = await getToken(messaging, {
            // vapidKey: fcm_vapid,
        });

        if (currentToken) {
            return currentToken;
        } else { 
            return null;
        }
    } catch (err) { 
        return null;
    }
};

// 🔹 Listen for Foreground Messages
export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log("Foreground Message:", payload);
            resolve(payload);
        });
    }); 


export { messaging, app };
