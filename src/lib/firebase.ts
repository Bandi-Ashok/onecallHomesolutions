import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, PhoneAuthProvider } from 'firebase/auth'
import { getMessaging, isSupported } from 'firebase/messaging'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || 'demo-app-id',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'demo-measurement',
}

export const firebaseApp = initializeApp(firebaseConfig)
export const firebaseAuth = getAuth(firebaseApp)
export const googleProvider = new GoogleAuthProvider()
export const phoneProvider = new PhoneAuthProvider(firebaseAuth)
export const firebaseFirestore = getFirestore(firebaseApp)
export const firebaseStorage = getStorage(firebaseApp)

export const getFirebaseMessaging = async () => {
  if (await isSupported()) {
    return getMessaging(firebaseApp)
  }
  return null
}

googleProvider.setCustomParameters({
  prompt: 'select_account',
})
