import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { errorMessage, successMessage } from "../../src/utils/Alert";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../src/store/useAuthStore";
import AuthAPI from "../../src/api/AuthAPI";
import { useMutation } from "@tanstack/react-query";
import { USER_ROLES } from "../../src/constants/roles";
import "./Login.scss";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { facebookAuth, googleAuth } from "../../src/firebase/firebase";

const UserLog = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let isValid = true;
    let errors = {};

    if (!email) {
      isValid = false;
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
      errors.email = "Email is invalid";
    }

    if (!password) {
      isValid = false;
      errors.password = "Password is required";
    } else if (password.length < 1) {
      // Corrected length check
      isValid = false;
      errors.password = "Password must be at least 6 characters";
    }

    setErrors(errors);
    return isValid;
  };

  const redirectToDashboard = (res) => {
    const { role, UserId } = res.data.user;
    if (role === USER_ROLES.CUSTOMER) {
      navigate("/", { state: { userId: UserId } });
    } else if (role === USER_ROLES.ADMIN) {
      navigate("/admin"); // Example: Admin dashboard path
    } else {
      navigate("/"); // Default navigation, could adjust based on needs
    }
  };

  const { mutate, isLoading } = useMutation({
    mutationFn: AuthAPI.login,
    onSuccess: (res) => {
      login(res.data.user, res.data.token);
      successMessage("Success", res.data.message, () => {
        redirectToDashboard(res);
      });
    },
    onError: (err) => {
      errorMessage("Error", err.response.data.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      mutate({ email, password });
    }
  };


  const handleGoogleAuth = async () => {
    const auth = await googleAuth();

    if (auth?.user) {
      try {
        const response = await AuthAPI.googleAuth(auth.user.accessToken);
        login(response.data.user, response.data.token);
        redirectToDashboard(response.data);
      } catch (error) {
        console.error("Google login error:", error);
        errorMessage("Error", error.response.data.error);
      }
    }
  };

  const handleFacebookAuth = async () => {
    const auth = await facebookAuth();

    if (auth?.user) {
      try {
        const response = await AuthAPI.facebookAuth(auth.user.accessToken);
        login(response.data.user, response.data.token);
        redirectToDashboard(response.data);
      } catch (error) {
        console.error("Facebook login error:", error);
        errorMessage("Error", error.response.data.error);
      }
    }
  };

  return (
    <div>
      <Header />
      <h1 className="login-title">Login</h1>
      <div className="login-container">
        <form onSubmit={handleSubmit}>
          <div className="login-form-items">
            <input
              type="email"
              className={`login-input ${errors.email ? "is-invalid" : ""}`}
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}

            <input
              type="password"
              className={`login-input ${errors.password ? "is-invalid" : ""}`}
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}

            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </button>

            <div className="text-center">
              <Link to="/forgot-password" className="text-decoration-none">
                Forgot Password?
              </Link>
            </div>

            <div
              style={{
                width: "50%",
                height: "1px",
                borderBottom: "1px dotted #000",
              }}
            />

            <button
              onClick={handleGoogleAuth}
              style={{
                backgroundColor: "#4285F4",
                color: "#fff",
                padding: "10px",
              }}
              type="button"
            >
              Continue with Google
            </button>
            <button
              onClick={handleFacebookAuth}
              style={{
                backgroundColor: "#3b5998",
                color: "#fff",
                padding: "10px",
              }}
              type="button"
            >
              Continue with Facebook
            </button>

            <div className="mt-3 text-center">
              Don't have an account?{" "}
              <Link to="/register" className="text-decoration-none">
                Register
              </Link>
            </div>
          </div>
        </form>
      </div>
      <Footer style={{'z-index': '1'}}/>
    </div>
  );
};


export default UserLog;
