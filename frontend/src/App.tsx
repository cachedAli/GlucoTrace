import { useEffect } from "react";

import { MantineProvider } from "@mantine/core";
import { Helmet } from "react-helmet";
import { Toaster } from "sonner";

import { useDashboardStore } from "./store/useDashboardStore";
import { toastOptions } from "./components/ui/toastStyles";
import { useAuthStore } from "./store/useAuthStore";
import Router from "./router/Router";

function App() {
  const setLoading = useDashboardStore((state) => state.setLoading);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth().finally(() => setLoading(false));
  }, []);

  return (
    <div className="antialiased">
      <Helmet>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-P5Q78D3QHP"
        ></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P5Q78D3QHP');
          `}
        </script>
      </Helmet>
      <MantineProvider>
        <Router />
      </MantineProvider>
      <Toaster position="top-right" toastOptions={toastOptions} />
    </div>
  );
}

export default App;
