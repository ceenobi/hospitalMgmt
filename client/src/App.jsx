import Routes from "./routes";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </>
  );
}

export default App;
