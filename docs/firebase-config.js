// Firebase ayarı. README'deki adımları izleyip Firebase konsolundan aldığın
// config nesnesini buraya yapıştır. null kaldığı sürece site sadece bu cihazda
// (localStorage) çalışır; cihazlar arası eş zamanlı senkron olmaz.
//
// Örnek:
// window.FIREBASE_CONFIG = {
//   apiKey: "AIza...",
//   authDomain: "xxx.firebaseapp.com",
//   databaseURL: "https://xxx-default-rtdb.europe-west1.firebasedatabase.app",
//   projectId: "xxx",
//   storageBucket: "xxx.appspot.com",
//   messagingSenderId: "123",
//   appId: "1:123:web:abc"
// };
window.FIREBASE_CONFIG = {

  apiKey: "AIzaSyD3M_6tHJqfgmDoa4XungSA2vbNXW4WbwA",

  authDomain: "mask-of-the-coven.firebaseapp.com",

  databaseURL: "https://mask-of-the-coven-default-rtdb.europe-west1.firebasedatabase.app",

  projectId: "mask-of-the-coven",

  storageBucket: "mask-of-the-coven.firebasestorage.app",

  messagingSenderId: "860350919103",

  appId: "1:860350919103:web:e59a3f3ad9a6133ad3310a",

  measurementId: "G-TV03C4N836"

};

// Aynı veritabanında birden fazla oyun tutmak istersen bunu değiştir.
window.GAME_ID = "mask-of-the-coven";
