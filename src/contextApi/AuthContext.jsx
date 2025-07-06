// Enhanced AuthContext with multi-broker support and localStorage restoration
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import { mockApi } from "../utils/constant";

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true for initial restore
  error: null,
  activeBroker: null,
  brokerSessions: {},
  isInitialized: false, // Track if we've restored from localStorage
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  LOGOUT_BROKER: "LOGOUT_BROKER",
  SET_LOADING: "SET_LOADING",
  CLEAR_ERROR: "CLEAR_ERROR",
  UPDATE_USER: "UPDATE_USER",
  SET_ACTIVE_BROKER: "SET_ACTIVE_BROKER",
  RESTORE_FROM_STORAGE: "RESTORE_FROM_STORAGE",
  INITIALIZATION_COMPLETE: "INITIALIZATION_COMPLETE",
};

// Reducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      const { user, brokerId, token } = action.payload;
      return {
        ...state,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        activeBroker: brokerId,
        brokerSessions: {
          ...state.brokerSessions,
          [brokerId]: {
            user,
            token,
            loginTime: new Date().toISOString(),
          },
        },
      };
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        activeBroker: null,
        brokerSessions: {},
      };
    case AUTH_ACTIONS.LOGOUT_BROKER:
      const { brokerId: logoutBrokerId } = action.payload;
      const newSessions = { ...state.brokerSessions };
      delete newSessions[logoutBrokerId];

      const isCurrentBroker = state.activeBroker === logoutBrokerId;
      const remainingBrokers = Object.keys(newSessions);

      if (isCurrentBroker) {
        if (remainingBrokers.length > 0) {
          const nextBroker = remainingBrokers[0];
          const nextSession = newSessions[nextBroker];
          return {
            ...state,
            user: nextSession.user,
            activeBroker: nextBroker,
            brokerSessions: newSessions,
          };
        } else {
          return {
            ...state,
            user: null,
            isAuthenticated: false,
            activeBroker: null,
            brokerSessions: {},
          };
        }
      }

      return {
        ...state,
        brokerSessions: newSessions,
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    case AUTH_ACTIONS.SET_ACTIVE_BROKER:
      const { brokerId: activeBrokerId } = action.payload;
      const session = state.brokerSessions[activeBrokerId];
      if (session) {
        return {
          ...state,
          user: session.user,
          activeBroker: activeBrokerId,
          isAuthenticated: true,
        };
      }
      return state;
    case AUTH_ACTIONS.RESTORE_FROM_STORAGE:
      const {
        restoredSessions,
        activeBroker: restoredActiveBroker,
      } = action.payload;
      const activeSession = restoredSessions[restoredActiveBroker];

      return {
        ...state,
        brokerSessions: restoredSessions,
        activeBroker: restoredActiveBroker,
        user: activeSession?.user || null,
        isAuthenticated: Object.keys(restoredSessions).length > 0,
      };
    case AUTH_ACTIONS.INITIALIZATION_COMPLETE:
      return {
        ...state,
        isLoading: false,
        isInitialized: true,
      };
    default:
      return state;
  }
};

// Helper functions for localStorage operations
const getStoredBrokerSessions = () => {
  const sessions = {};
  const keys = Object.keys(localStorage);

  keys.forEach((key) => {
    if (key.startsWith("token_")) {
      const brokerId = key.replace("token_", "");
      const token = localStorage.getItem(key);
      const userKey = `user_${brokerId}`;
      const userStr = localStorage.getItem(userKey);

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          sessions[brokerId] = {
            user,
            token,
            loginTime: new Date().toISOString(), // Default login time
          };
        } catch (error) {
          console.error(
            `Error parsing user data for broker ${brokerId}:`,
            error
          );
          // Clean up corrupted data
          localStorage.removeItem(key);
          localStorage.removeItem(userKey);
        }
      }
    }
  });

  return sessions;
};

const getStoredActiveBroker = () => {
  return localStorage.getItem("activeBroker");
};

const setStoredActiveBroker = (brokerId) => {
  if (brokerId) {
    localStorage.setItem("activeBroker", brokerId);
  } else {
    localStorage.removeItem("activeBroker");
  }
};

const clearBrokerStorage = (brokerId) => {
  localStorage.removeItem(`token_${brokerId}`);
  localStorage.removeItem(`user_${brokerId}`);
};

const clearAllBrokerStorage = () => {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (
      key.startsWith("token_") ||
      key.startsWith("user_") ||
      key === "activeBroker"
    ) {
      localStorage.removeItem(key);
    }
  });
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Restore authentication state from localStorage on mount
  useEffect(() => {
    const restoreAuthState = () => {
      console.log("Restoring auth state from localStorage...");

      try {
        const storedSessions = getStoredBrokerSessions();
        const storedActiveBroker = getStoredActiveBroker();

        console.log("Restored sessions:", storedSessions);
        console.log("Restored active broker:", storedActiveBroker);

        if (Object.keys(storedSessions).length > 0) {
          // Determine active broker
          let activeBroker = null;

          if (storedActiveBroker && storedSessions[storedActiveBroker]) {
            activeBroker = storedActiveBroker;
          } else {
            // If no stored active broker or it's invalid, use the first available session
            activeBroker = Object.keys(storedSessions)[0];
          }

          dispatch({
            type: AUTH_ACTIONS.RESTORE_FROM_STORAGE,
            payload: {
              restoredSessions: storedSessions,
              activeBroker,
            },
          });

          // Update stored active broker if it was auto-selected
          if (activeBroker !== storedActiveBroker) {
            setStoredActiveBroker(activeBroker);
          }
        }
      } catch (error) {
        console.error("Error restoring auth state:", error);
        // Clear potentially corrupted data
        clearAllBrokerStorage();
      } finally {
        dispatch({ type: AUTH_ACTIONS.INITIALIZATION_COMPLETE });
      }
    };

    restoreAuthState();
  }, []);

  // Login function
  const login = useCallback(async (credentials) => {
    console.log("Login attempt started:", credentials);
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await mockApi.login(
        credentials.email,
        credentials.password,
        credentials.brokerId
      );

      console.log("Login API response:", response);

      if (response.status === 200) {
        const { user, token } = response.data;
        localStorage.setItem(`token_${credentials.brokerId}`, token);
        localStorage.setItem(
          `user_${credentials.brokerId}`,
          JSON.stringify(user)
        );
        setStoredActiveBroker(credentials.brokerId);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user,
            token,
            brokerId: credentials.brokerId,
          },
        });

        return { success: true, user };
      } else {
        throw new Error(response.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage = error.message || "Login failed";
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Register function
  const register = useCallback(async (userData) => {
    console.log("Register attempt started:", userData);
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await mockApi.signup(
        userData.email,
        userData.password,
        userData.name,
        userData.brokerId
      );

      console.log("Register API response:", response);

      if (response.status === 200) {
        const { user, token } = response.data;
        localStorage.setItem(`token_${userData.brokerId}`, token);
        localStorage.setItem(`user_${userData.brokerId}`, JSON.stringify(user));
        setStoredActiveBroker(userData.brokerId);

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: {
            user,
            token,
            brokerId: userData.brokerId,
          },
        });

        return { success: true, user };
      } else {
        throw new Error(response.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.message || "Registration failed";
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  }, []);

  // Logout from all brokers
  const logout = useCallback(async () => {
    try {
      console.log("Logout initiated");
      clearAllBrokerStorage();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      clearAllBrokerStorage();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true };
    }
  }, []);

  // Logout from specific broker
  const logoutFromBroker = useCallback(
    async (brokerId) => {
      try {
        console.log("Logout from broker:", brokerId);
        clearBrokerStorage(brokerId);

        // If logging out from active broker, clear active broker storage
        if (state.activeBroker === brokerId) {
          setStoredActiveBroker(null);
        }

        dispatch({
          type: AUTH_ACTIONS.LOGOUT_BROKER,
          payload: { brokerId },
        });

        return { success: true };
      } catch (error) {
        console.error("Broker logout error:", error);
        return { success: false, error: error.message };
      }
    },
    [state.activeBroker]
  );

  // Switch active broker
  const switchBroker = useCallback(
    (brokerId) => {
      console.log("Switching to broker:", brokerId);

      if (state.brokerSessions[brokerId]) {
        setStoredActiveBroker(brokerId);
        dispatch({
          type: AUTH_ACTIONS.SET_ACTIVE_BROKER,
          payload: { brokerId },
        });
        return { success: true };
      }
      return { success: false, error: "No active session for this broker" };
    },
    [state.brokerSessions]
  );

  // Update user function
  const updateUser = useCallback(
    (userData) => {
      // Update user in state
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: userData,
      });

      // Update user in localStorage for current broker
      if (state.activeBroker) {
        const currentUser = state.user;
        const updatedUser = { ...currentUser, ...userData };
        localStorage.setItem(
          `user_${state.activeBroker}`,
          JSON.stringify(updatedUser)
        );
      }
    },
    [state.activeBroker, state.user]
  );

  // Clear error function
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  // Get auth token for current broker
  const getToken = useCallback(() => {
    const token = state.activeBroker
      ? state.brokerSessions[state.activeBroker]?.token
      : null;
    console.log(
      "Getting token for active broker:",
      state.activeBroker,
      "Token:",
      token
    );
    return token;
  }, [state.activeBroker, state.brokerSessions]);

  // Get token for specific broker
  const getTokenForBroker = useCallback(
    (brokerId) => {
      const token = state.brokerSessions[brokerId]?.token || null;
      console.log("Getting token for broker:", brokerId, "Token:", token);
      return token;
    },
    [state.brokerSessions]
  );

  // Check if user has specific role
  const hasRole = useCallback(
    (role) => {
      const hasRoleResult = state.user?.roles?.includes(role) || false;
      console.log(
        "Checking role:",
        role,
        "Result:",
        hasRoleResult,
        "User roles:",
        state.user?.roles,
        state
      );
      return hasRoleResult;
    },
    [state.user]
  );

  // Check if user has specific permission
  const hasPermission = useCallback(
    (permission) => {
      const hasPermResult =
        state.user?.permissions?.includes(permission) || false;
      console.log(
        "Checking permission:",
        permission,
        "Result:",
        hasPermResult,
        "User permissions:",
        state.user?.permissions
      );
      return hasPermResult;
    },
    [state.user]
  );

  // Check if user is authenticated for specific broker
  const isAuthenticatedForBroker = useCallback(
    (brokerId) => {
      const isAuth = !!state.brokerSessions[brokerId];
      console.log(
        "Checking auth for broker:",
        brokerId,
        "Result:",
        isAuth,
        "Sessions:",
        Object.keys(state.brokerSessions)
      );
      return isAuth;
    },
    [state.brokerSessions]
  );

  // Get list of authenticated brokers
  const getAuthenticatedBrokers = useCallback(() => {
    const brokers = Object.keys(state.brokerSessions);
    console.log("Getting authenticated brokers:", brokers);
    return brokers;
  }, [state.brokerSessions]);

  // Debug logging
  useEffect(() => {
    console.log("Auth state updated:", {
      isAuthenticated: state.isAuthenticated,
      activeBroker: state.activeBroker,
      user: state.user,
      brokerSessions: Object.keys(state.brokerSessions),
      isLoading: state.isLoading,
      isInitialized: state.isInitialized,
      error: state.error,
    });
  }, [state]);

  // Memoize the context value
  const value = React.useMemo(
    () => ({
      // State
      user: state.user,
      isAuthenticated: state.isAuthenticated,
      isLoading: state.isLoading,
      error: state.error,
      activeBroker: state.activeBroker,
      brokerSessions: state.brokerSessions,
      isInitialized: state.isInitialized,

      // Actions
      login,
      logout,
      logoutFromBroker,
      switchBroker,
      register,
      updateUser,
      clearError,
      getToken,
      getTokenForBroker,
      hasRole,
      hasPermission,
      isAuthenticatedForBroker,
      getAuthenticatedBrokers,
    }),
    [
      state.user,
      state.isAuthenticated,
      state.isLoading,
      state.error,
      state.activeBroker,
      state.brokerSessions,
      state.isInitialized,
      login,
      logout,
      logoutFromBroker,
      switchBroker,
      register,
      updateUser,
      clearError,
      getToken,
      getTokenForBroker,
      hasRole,
      hasPermission,
      isAuthenticatedForBroker,
      getAuthenticatedBrokers,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

// HOC for broker-specific protected routes
export const withBrokerAuth = (Component) => {
  return function BrokerAuthenticatedComponent(props) {
    const { isAuthenticatedForBroker, isLoading, isInitialized } = useAuth();
    const { brokerId } = props;

    if (!isInitialized || isLoading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticatedForBroker(brokerId)) {
      return <div>Please log in to access this broker's services.</div>;
    }

    return <Component {...props} />;
  };
};

export default AuthContext;
