import SmoothScroll from "smoothscroll-polyfill"
import handleSplashScreen from "./SplashScreen/splash-screen"

// Call splash screen handler immediately to ensure fallback logic is active
// even if the app fails to load or takes too long.
handleSplashScreen()

import "threads/register"
import "./Workers/worker-controller"
import "./App/bootstrap"

SmoothScroll.polyfill()
