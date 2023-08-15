import ReactDOM from "react-dom/client";
import "./index.css";
import { AppRouter } from "./routes/routes";
import { AuthGoogleProvider } from "./contexts/authGoogle";
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthGoogleProvider>
    <AppRouter />
  </AuthGoogleProvider>
);
