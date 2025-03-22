importScripts("https://www.gstatic.com/firebasejs/9.16.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.16.0/firebase-messaging-compat.js");

// Firebase configuration (same as in your app)
const firebaseConfig = {
    apiKey: "AIzaSyCex79MzP0DnYH7BlyHSj1GKJAQrsvDEDo",
    authDomain: "wells-7a385.firebaseapp.com",
    projectId: "wells-7a385",
    storageBucket: "wells-7a385.firebasestorage.app",
    messagingSenderId: "14255022256",
    appId: "1:14255022256:web:35d055231484c4a96e5b75",
    measurementId: "G-F697HJLE0J"
};



// Initialize Firebase app
firebase.initializeApp(firebaseConfig);

// Retrieve messaging instance for background notifications
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    // console.log("Received background message:", payload);

    const notificationTitle = payload.notification?.title || "A new update occurred in your account";
    const notificationOptions = {
        body: payload.notification?.body || "Please visit your dashboard for more information",
        icon: payload.notification?.image||'/favicon.ico',
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
