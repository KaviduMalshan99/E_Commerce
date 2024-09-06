import api from "./api";

class AuthAPI {
  // User Login
  static login(credentials) {
    return api.post("/api/login", credentials);
  }

  // User Register
  static register(values) {
    return api.post("/api/register", values);
  }

  static fetchCustomers() {
    return api.get("/api/customer");
  }

  // Login with Google
  static googleAuth(token) {
    return api.post("/api/auth/google", { token });
  }

  // Login with Facebook
  static facebookAuth(token) {
    return api.post("/api/auth/facebook", { token });
  }

  // Forgot Password
  static forgotPassword(email) {
    return api.post("/api/forgot-password", email);
  }

  // Reset Password
  static resetPassword({ token, password }) {
    return api.post(`/api/reset-password/${token}`, { password });
  }
}

export default AuthAPI;
