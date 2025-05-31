import { useEffect } from "react";

import { MantineProvider } from "@mantine/core";
import { Toaster } from "sonner";

import { useDashboardStore } from "./store/useDashboardStore.js";
import { toastOptions } from "./components/ui/toastStyles.js";
import { useAuthStore } from "./store/useAuthStore.js";
import Router from "./router/Router";

function App() {
  const setLoading = useDashboardStore((state) => state.setLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth().finally(() => setLoading(false));
  }, []);

  return (
    <div className="antialiased">
      <MantineProvider>
        <Router />
      </MantineProvider>
      <Toaster position="top-right" toastOptions={toastOptions} />
    </div>
  );
}

export default App;
