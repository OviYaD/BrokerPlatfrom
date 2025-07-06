import {
  ArrowBack,
  Email,
  Lock,
  Login as LoginIcon,
  Person,
  PersonAdd,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Container,
  Divider,
  Fade,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { brokers } from "../utils/constant";
import { useAuth } from "../contextApi/AuthContext";

const LoginPage = () => {
  const [searchParams] = useSearchParams();
  const brokerId = searchParams.get("brokerId");
  const navigate = useNavigate();

  // Get auth context - now including isInitialized
  const {
    login,
    register,
    isAuthenticated,
    isAuthenticatedForBroker,
    isLoading: authLoading,
    isInitialized, // Add this from the updated AuthContext
    error: authError,
    clearError,
    activeBroker,
  } = useAuth();

  const selectedBroker =
    brokers.filter((broker) => broker.id == brokerId)?.[0] ?? {};

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState("");

  // Enhanced redirect logic - now waits for initialization
  useEffect(() => {
    console.log("LoginPage useEffect - Debug Info:", {
      brokerId,
      selectedBrokerId: selectedBroker.id,
      authLoading,
      isInitialized,
      isAuthenticated,
      activeBroker,
      isAuthenticatedForBroker: isAuthenticatedForBroker
        ? isAuthenticatedForBroker(brokerId)
        : false,
    });

    // Don't redirect if auth is still loading or not initialized
    if (authLoading || !isInitialized) {
      console.log("Auth still loading or not initialized, not redirecting");
      return;
    }

    // Don't redirect if no broker is selected
    if (!brokerId || !selectedBroker.id) {
      console.log("No broker selected, not redirecting");
      return;
    }

    // Check if user is already authenticated for this specific broker
    const isAuthForBroker =
      isAuthenticatedForBroker && isAuthenticatedForBroker(brokerId);
    console.log(
      `Authentication check for broker ${brokerId}:`,
      isAuthForBroker
    );

    if (isAuthForBroker) {
      console.log(
        `User is authenticated for broker ${brokerId}, redirecting...`
      );

      const redirectPath = `/dashboard?brokerId=${brokerId}&tabIndex=0`;
      console.log("Redirecting to:", redirectPath);
      navigate(redirectPath, { replace: true });
    } else {
      console.log(
        `User is NOT authenticated for broker ${brokerId}, staying on login page`
      );
    }
  }, [
    isAuthenticatedForBroker,
    brokerId,
    selectedBroker.id,
    navigate,
    authLoading,
    isInitialized, // Add this dependency
    isAuthenticated,
    activeBroker,
  ]);

  // Clear errors when mode changes
  useEffect(() => {
    clearError();
    setLocalError("");
    setSuccess("");
  }, [isLogin, clearError]);

  // Redirect to broker selection if no broker is selected
  useEffect(() => {
    if (!brokerId && isInitialized) {
      navigate("/", { replace: true });
    }
  }, [brokerId, navigate, isInitialized]);

  const onBack = () => {
    navigate("/");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setLocalError("Please fill in all required fields.");
      return false;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLocalError("Please enter a valid email address.");
      return false;
    }

    if (!isLogin) {
      if (!formData.name) {
        setLocalError("Please enter your name.");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setLocalError("Passwords do not match.");
        return false;
      }
      if (formData.password.length < 6) {
        setLocalError("Password must be at least 6 characters long.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setLocalError("");
    setSuccess("");

    try {
      if (isLogin) {
        const credentials = {
          email: formData.email,
          password: formData.password,
          brokerId: selectedBroker.id,
        };

        console.log("Attempting login with credentials:", credentials);
        const result = await login(credentials);
        console.log("Login result:", result);

        if (result.success) {
          setSuccess(
            `Login successful for ${selectedBroker.name}! Redirecting...`
          );

          // Add a small delay to show success message before redirect
          setTimeout(() => {
            const redirectPath = `/dashboard?brokerId=${brokerId}&tabIndex=0`;
            console.log("Post-login redirect to:", redirectPath);
            navigate(redirectPath, { replace: true });
          }, 1000);
        } else {
          setLocalError(result.error || "Login failed");
        }
      } else {
        const userData = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          brokerId: selectedBroker.id,
        };

        console.log("Attempting registration with data:", userData);
        const result = await register(userData);
        console.log("Registration result:", result);

        if (result.success) {
          setSuccess(
            `Account created successfully for ${selectedBroker.name}! Redirecting...`
          );

          // Add a small delay to show success message before redirect
          setTimeout(() => {
            const redirectPath = `/dashboard?brokerId=${brokerId}&tabIndex=0`;
            console.log("Post-registration redirect to:", redirectPath);
            navigate(redirectPath, { replace: true });
          }, 1000);
        } else {
          setLocalError(result.error || "Registration failed");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      setLocalError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    setLocalError("");
    clearError();
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: "", password: "", name: "", confirmPassword: "" });
    setLocalError("");
    setSuccess("");
    clearError();
  };

  // Show loading if auth is still loading or not initialized
  if (authLoading || !isInitialized) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2, color: "text.secondary" }}>
          {!isInitialized ? "Initializing..." : "Loading authentication..."}
        </Typography>
      </Box>
    );
  }

  // Show error if broker not found
  if (!selectedBroker.id) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Card sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Broker Not Found
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
              The selected broker could not be found. Please select a broker
              from the list.
            </Typography>
            <Button variant="contained" onClick={onBack}>
              Back to Broker Selection
            </Button>
          </Card>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{ minHeight: "100vh", backgroundColor: "background.default", p: 3 }}
    >
      <Container maxWidth="sm">
        <Fade in={true}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
              <IconButton
                onClick={onBack}
                sx={{ mr: 2, color: "text.secondary" }}
              >
                <ArrowBack />
              </IconButton>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {selectedBroker.icon}
                <Box sx={{ ml: 2 }}>
                  <Typography
                    variant="h5"
                    sx={{ color: "text.primary", fontWeight: 600 }}
                  >
                    {selectedBroker.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {selectedBroker.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: "primary.main",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {selectedBroker.type} Platform
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Card sx={{ p: 4 }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography variant="h4" sx={{ color: "text.primary", mb: 1 }}>
                  {isLogin ? "Welcome Back" : "Create Account"}
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary" }}>
                  {isLogin
                    ? `Sign in to your ${selectedBroker.name} account`
                    : `Create your ${selectedBroker.name} account`}
                </Typography>
              </Box>

              {isLogin && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    Demo Credentials for {selectedBroker.name}:
                  </Typography>
                  <Typography variant="body2">
                    Email: test@example.com
                  </Typography>
                  <Typography variant="body2">Password: password123</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Only test user have full permissions: trade, sell, buy. To
                    check permissions, login with different email.
                  </Typography>
                </Alert>
              )}

              {/* Show broker type specific information */}
              {selectedBroker.type && (
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    You're accessing a <strong>{selectedBroker.type}</strong>{" "}
                    platform.
                    {selectedBroker.type === "trading" &&
                      " Access real-time trading tools and market data."}
                    {selectedBroker.type === "investment" &&
                      " Manage your investment portfolio and track performance."}
                    {selectedBroker.type === "crypto" &&
                      " Trade cryptocurrencies and manage digital assets."}
                    {selectedBroker.type === "forex" &&
                      " Access foreign exchange markets and currency trading."}
                  </Typography>
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                {!isLogin && (
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={handleInputChange("name")}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange("email")}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange("password")}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock sx={{ color: "text.secondary" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {!isLogin && (
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange("confirmPassword")}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: "text.secondary" }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                {/* Display local errors or auth context errors */}
                {(localError || authError) && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    {localError || authError}
                  </Alert>
                )}

                {success && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    {success}
                  </Alert>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} />
                    ) : isLogin ? (
                      <LoginIcon />
                    ) : (
                      <PersonAdd />
                    )
                  }
                >
                  {loading
                    ? "Processing..."
                    : isLogin
                    ? `Sign In to ${selectedBroker.name}`
                    : `Create ${selectedBroker.name} Account`}
                </Button>
              </Box>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  sx={{ color: "text.secondary", mb: 1 }}
                >
                  {isLogin
                    ? `Don't have a ${selectedBroker.name} account?`
                    : `Already have a ${selectedBroker.name} account?`}
                </Typography>
                <Button
                  variant="text"
                  onClick={toggleMode}
                  sx={{ color: "primary.main", fontWeight: 500 }}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </Button>
              </Box>
            </Card>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default LoginPage;
