import { createRoot } from "react-dom/client";
import { Keyboard } from '@capacitor/keyboard';
import App from "./App.tsx";
import "./index.css";

// Configure keyboard for smooth iOS experience
if ((window as any).Capacitor?.isNativePlatform?.()) {
  // Smooth keyboard animations
  Keyboard.setAccessoryBarVisible({ isVisible: false });
  Keyboard.setScroll({ isDisabled: false });

  // Handle keyboard events for better UX
  Keyboard.addListener('keyboardWillShow', (info) => {
    document.documentElement.style.setProperty('--keyboard-height', `${info.keyboardHeight}px`);
  });

  Keyboard.addListener('keyboardWillHide', () => {
    document.documentElement.style.setProperty('--keyboard-height', '0px');
  });
}

createRoot(document.getElementById("root")!).render(<App />);