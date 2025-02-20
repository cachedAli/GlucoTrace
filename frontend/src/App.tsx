import { MantineProvider } from "@mantine/core";
import Router from "./components/router/Router";

function App() {
  return (
    <MantineProvider>
      <div className="antialiased">
        <Router />
      </div>
    </MantineProvider>
  );
}

export default App;
