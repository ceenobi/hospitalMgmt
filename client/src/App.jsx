import { RouterProvider } from "react-router";
import Routes from "./routes/approutes";

function App() {
  return <RouterProvider router={Routes()} />;
}

export default App;
