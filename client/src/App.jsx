import Routes from "./routes";
import AuthProvider from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
