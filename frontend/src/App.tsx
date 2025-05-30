import { useEffect } from "react";

import { MantineProvider } from "@mantine/core";
import { Toaster } from "sonner";

import { useDashboardStore } from "./store/useDashboardStore";
import { toastOptions } from "./components/ui/toastStyles";
import { useAuthStore } from "./store/useAuthStore";
import { supabase } from "./libs/supabaseClient";
import Router from "./router/Router";

function App() {
  const setLoading = useDashboardStore((state) => state.setLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth().finally(() => setLoading(false));
    handle();
  }, []);

  const handle = async () => {
    const { data } = await supabase.auth.getSession();
    console.log(data);
  };
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
