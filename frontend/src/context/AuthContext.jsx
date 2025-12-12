import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const { data } = await api.get("/user/data");
      if (data.success) {
        setUser(data.userData);
      }
    } catch (error) {
      // User is not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (data.success) {
        setUser(data.user);
        toast.success(data.message);
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return false;
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        // Don't set user here, verification is needed
        toast.success(data.message);
        return { success: true, email: data.email };
      }
      return { success: false, message: data.message }; // Fallback if 200 OK but success false
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return { success: false };
    }
  };

  const verifyEmail = async (email, otp) => {
    try {
      const { data } = await api.post("/auth/verify-account", { email, otp });
      if (data.success) {
        setUser(data.user);
        toast.success(data.message);
        return true;
      }
    } catch (error) {
       toast.error(error.response?.data?.message || "Verification failed");
       return false;
    }
  };

  const resendOtp = async (email) => {
      try {
          const { data } = await api.post("/auth/send-verify-otp", { email });
          if(data.success) {
              toast.success(data.message);
              return true;
          }
      } catch (error) {
          toast.error(error.response?.data?.message || "Failed to send OTP");
          return false;
      }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const updateProfile = async (formData) => {
      try {
          const { data } = await api.put("/user/update", formData);
          if(data.success) {
              setUser(data.user);
              toast.success("Profile updated!");
          }
      } catch (error) {
           toast.error(error.response?.data?.message || "Update failed");
      }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, verifyEmail, resendOtp, loading, refetchUser: checkAuth, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
