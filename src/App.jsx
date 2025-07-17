import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Home from "./views/Home";

function App() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingDone, setLoadingDone] = useState(false);

  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setLoadingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => setLoadingDone(true), 300);
      }
    }, 50);
  }, []);

  return <>{loadingDone ? <Home /> : <LoadingScreen progress={loadingProgress} />}</>;
}

export default App;
