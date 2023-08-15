import { useContext } from "react";
import { AuthGoogleContext } from "../../contexts/authGoogle";
import { Navigate } from "react-router-dom";
import "./style.css";

export default function Login() {
  const { signInWithGoogle, signed } = useContext(AuthGoogleContext);
  async function loginWithGoogle() {
    await signInWithGoogle();
  }
  if (!signed) {
    return (
      <div className="container">
        <div>
          <h1 className="tiny-300 secondary">
            <span className="italic bold-800 primary" color="#3D246C">
              My
            </span>
            Tracks
          </h1>
          <p>Organize as suas musicas</p>
        </div>
        <button onClick={loginWithGoogle}>Login com google</button>
      </div>
    );
  } else {
    return <Navigate to="/home" />;
  }
}
