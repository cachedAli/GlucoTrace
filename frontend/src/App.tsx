import { Toaster } from "sonner";
import Router from "./router/Router";
import { MantineProvider } from "@mantine/core";
import { useDashboardStore } from "./store/useDashboardStore";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";

function App() {
  const setLoading = useDashboardStore((state)=>state.setLoading)
  const checkAuth = useAuthStore((state)=>state.checkAuth)

  useEffect(()=>{
    checkAuth().finally(()=>setLoading(false))
  },[])
  return (
    <div className="antialiased">
      <MantineProvider>
        <Router />
      </MantineProvider>
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
