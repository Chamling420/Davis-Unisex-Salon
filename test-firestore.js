import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, getDocs, orderBy, where, addDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { readFileSync } from 'fs';

const fbConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(fbConfig);
const db = getFirestore(app, fbConfig.firestoreDatabaseId);
const auth = getAuth(app);

async function test() {
  try {
    // Wait, the user's password on test? We can just do a test user using app-created account or we can mock it by looking at the rules.
    const qGallery = query(collection(db, 'gallery'), orderBy('uploadedAt', 'desc'));
    const snap1 = await getDocs(qGallery);
    console.log("Gallery success:", snap1.docs.length);

    const qAppt = query(collection(db, 'appointments'), where('userId', '==', auth.currentUser.uid));
    const snap2 = await getDocs(qAppt);
    console.log("Appointments success:", snap2.docs.length);

  } catch (err) {
    console.error("Error:", err.message);
  }
test();
