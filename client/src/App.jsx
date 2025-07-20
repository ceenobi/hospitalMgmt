import Routes from "./routes";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "sonner";

function App() {
  return (
    <AuthProvider>
      <Toaster richColors position="top-center" />
      <Routes />
    </AuthProvider>
  );
}

export default App;
