import {initializeApp} from "firebase/app";
import {getAnalytics, setUserProperties, setUserId, logEvent} from "firebase/analytics";
import keys from "@/env/firebase"

const app = initializeApp(keys);
const analytics = getAnalytics(app);
export function firebaseLog(event, attr) {
    logEvent(analytics, event, attr)
}

