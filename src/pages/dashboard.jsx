import { useNavigate, useSearchParams } from "react-router-dom";
import {
  brokers,
  mockHoldings,
  mockOrderbook,
  mockPositions,
  mockStocks,
} from "../utils/constant";
import {
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  Toolbar,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import {
  AccountBalanceWallet,
  Logout,
  MoreVert,
  Receipt,
  Refresh,
  Settings,
  ShowChart,
  Person,
  Security,
  Warning,
  Home,
} from "@mui/icons-material";
import DraggableFAB from "../components/DraggableFAB";
import OrderPad from "../components/OrderPad";
import { useState, useEffect, useCallback, useRef } from "react";
import HoldingsScreen from "../components/HoldingsScreen";
import OrderbookScreen from "../components/OrderbookScreen";
import PositionsScreen from "../components/PositionsScreen";
import { useAuth } from "../contextApi/AuthContext";

const DashBoard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const brokerId = searchParams.get("brokerId");
  const tabIndex = parseInt(searchParams.get("tabIndex") || "0");

  // Enhanced usage of AuthContext
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    logout,
    clearError,
    getToken,
    hasRole,
    hasPermission,
    isAuthenticatedForBroker,
    activeBroker,
    switchBroker,
  } = useAuth();

  const navigate = useNavigate();
  const broker = brokers.filter((broker) => broker.id == brokerId)?.[0] ?? {};

  const [orderPadOpen, setOrderPadOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [orderType, setOrderType] = useState("BUY");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // Add ref to track if initial auth check is done
  const initialAuthCheckDone = useRef(false);

  // Enhanced authentication check for direct access - ONLY run once on mount
  useEffect(() => {
    // Skip if already done initial auth check
    if (initialAuthCheckDone.current) {
      return;
    }

    const performAuthCheck = async () => {
      try {
        console.log("Starting auth check...", {
          isLoading,
          brokerId,
          isAuthenticated,
          activeBroker,
          user: user?.name,
        });

        // If auth is still loading, wait
        if (isLoading) {
          console.log("Auth still loading, waiting...");
          return;
        }

        // Check if broker is selected
        if (!brokerId) {
          console.log("No broker selected, redirecting to broker selection...");
          navigate(`/?redirect=/dashboard&tabIndex=${tabIndex}`, {
            replace: true,
          });
          return;
        }

        // Check if broker exists
        if (!broker.id) {
          console.log(
            "Invalid broker selected, redirecting to broker selection...",
            broker.id
          );
          navigate(
            `/?redirect=/dashboard&tabIndex=${tabIndex}&error=invalid_broker`,
            {
              replace: true,
            }
          );
          return;
        }

        // Check if user is authenticated for this specific broker
        if (!isAuthenticatedForBroker(brokerId)) {
          console.log(
            `User not authenticated for broker ${brokerId}, redirecting to login...`
          );
          navigate(
            `/login?brokerId=${brokerId}&redirect=/dashboard&tabIndex=${tabIndex}`,
            {
              replace: true,
            }
          );
          return;
        }

        // Check if we need to switch to this broker (if authenticated but not active)
        if (activeBroker !== brokerId) {
          console.log(`Switching to broker ${brokerId} from ${activeBroker}`);
          const switchResult = switchBroker(brokerId);
          if (!switchResult.success) {
            console.error("Failed to switch broker:", switchResult.error);
            navigate(
              `/login?brokerId=${brokerId}&redirect=/dashboard&tabIndex=${tabIndex}`,
              {
                replace: true,
              }
            );
            return;
          }
        }

        // Basic authentication check passed
        if (!isAuthenticated || !user) {
          console.log("Not authenticated or no user, redirecting to login...");
          navigate(
            `/login?brokerId=${brokerId}&redirect=/dashboard&tabIndex=${tabIndex}`,
            {
              replace: true,
            }
          );
          return;
        }

        // Optional: Check for basic dashboard permissions (only if you have them in your system)
        // Remove this check if you don't have specific dashboard permissions
        const hasDashboardAccess =
          hasPermission("VIEW_DASHBOARD") ||
          hasPermission("TRADE") ||
          hasRole("USER") ||
          hasRole("ADMIN");

        if (!hasDashboardAccess) {
          console.log("User lacks dashboard permissions");
          setSnackbarMessage(
            "You don't have permission to access the dashboard"
          );
          setSnackbarOpen(true);

          // Instead of redirecting to unauthorized, just show a message and allow basic access
          // Or redirect to a specific page based on user's role
          console.log(
            "Allowing basic dashboard access despite missing specific permissions"
          );
        }

        // All checks passed
        console.log("Auth check completed successfully");
        setAuthCheckComplete(true);
        initialAuthCheckDone.current = true; // Mark as done

        // Show welcome message
        setSnackbarMessage(
          `Welcome to ${broker.name}, ${user?.name || "User"}!`
        );
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Auth check error:", error);
        setSnackbarMessage("Authentication check failed. Please try again.");
        setSnackbarOpen(true);
        navigate(`/login?brokerId=${brokerId}&error=auth_check_failed`, {
          replace: true,
        });
      }
    };

    performAuthCheck();
  }, [
    // Remove tabIndex from dependencies to prevent re-running on tab change
    isLoading,
    brokerId,
    broker.id,
    isAuthenticatedForBroker,
    hasPermission,
    hasRole,
    navigate,
    // tabIndex, // REMOVED - this was causing the issue
    user?.name,
    isAuthenticated,
    user,
    activeBroker,
    switchBroker,
  ]);

  // Separate useEffect to handle broker switching without full auth check
  useEffect(() => {
    // Only run after initial auth check is complete
    if (!initialAuthCheckDone.current || !authCheckComplete) {
      return;
    }

    // Handle broker switching if needed
    if (
      activeBroker !== brokerId &&
      brokerId &&
      isAuthenticatedForBroker(brokerId)
    ) {
      console.log(`Switching to broker ${brokerId} from ${activeBroker}`);
      const switchResult = switchBroker(brokerId);
      if (!switchResult.success) {
        console.error("Failed to switch broker:", switchResult.error);
        setSnackbarMessage("Failed to switch broker");
        setSnackbarOpen(true);
      }
    }
  }, [
    brokerId,
    activeBroker,
    switchBroker,
    isAuthenticatedForBroker,
    authCheckComplete,
  ]);

  // Clear any authentication errors on mount
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  // Enhanced logout function
  const handleLogout = useCallback(async () => {
    setLogoutLoading(true);
    try {
      const result = await logout();
      if (result.success) {
        setSnackbarMessage("Logged out successfully");
        setSnackbarOpen(true);
        // Clear search params and navigate to login
        setSearchParams({});
        navigate("/");
      } else {
        setSnackbarMessage("Logout failed. Please try again.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Logout error:", error);
      setSnackbarMessage("Logout failed. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setLogoutLoading(false);
      setMenuAnchorEl(null);
    }
  }, [logout, navigate, setSearchParams]);

  // Enhanced stock selection with permission check
  const handleStockSelect = useCallback(
    (stock) => {
      // Check if user has permission to trade (optional check)
      if (hasPermission && !hasPermission("TRADE")) {
        setSnackbarMessage("You don't have permission to trade");
        setSnackbarOpen(true);
        return;
      }

      setSelectedStock(stock);
      setOrderPadOpen(true);
    },
    [hasPermission]
  );

  // Enhanced FAB action with role/permission checks
  const handleFABAction = useCallback(
    (type) => {
      // Only check permissions if hasPermission function returns meaningful results
      if (hasPermission) {
        // Check trading permissions
        if (!hasPermission("TRADE")) {
          setSnackbarMessage("You don't have permission to trade");
          setSnackbarOpen(true);
          return;
        }

        // Check specific permissions for buy/sell
        if (type === "BUY" && !hasPermission("BUY")) {
          setSnackbarMessage("You don't have permission to buy");
          setSnackbarOpen(true);
          return;
        }

        if (type === "SELL" && !hasPermission("SELL")) {
          setSnackbarMessage("You don't have permission to sell");
          setSnackbarOpen(true);
          return;
        }
      }

      setOrderType(type);

      // Get the first stock from current screen
      let firstStock = null;
      if (tabIndex === 0) {
        firstStock = mockHoldings[0]
          ? {
              symbol: mockHoldings[0].symbol,
              name: mockHoldings[0].name,
              ltp: mockHoldings[0].ltp,
            }
          : null;
      } else if (tabIndex === 1) {
        firstStock = mockOrderbook[0]
          ? {
              symbol: mockOrderbook[0].symbol,
              name: mockOrderbook[0].symbol,
              ltp: mockOrderbook[0].price,
            }
          : null;
      } else if (tabIndex === 2) {
        firstStock = mockPositions[0]
          ? {
              symbol: mockPositions[0].symbol,
              name: mockPositions[0].name,
              ltp: mockPositions[0].ltp,
            }
          : null;
      }

      // If no stock found, use the first from mockStocks
      if (!firstStock) {
        firstStock = mockStocks[0]
          ? {
              symbol: mockStocks[0].symbol,
              name: mockStocks[0].name,
              ltp: mockStocks[0].ltp,
            }
          : null;
      }

      if (firstStock) {
        setSelectedStock(firstStock);
        setOrderPadOpen(true);
      }
    },
    [hasPermission, tabIndex]
  );

  const handleOrderPlace = useCallback((message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }, []);

  const handleMenuClose = useCallback(() => {
    setMenuAnchorEl(null);
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      // Get fresh token and refresh data
      const token = getToken();
      if (token) {
        setSnackbarMessage("Data refreshed successfully");
        setSnackbarOpen(true);
        // Here you would typically refresh your data
      } else {
        setSnackbarMessage("Authentication token not found");
        setSnackbarOpen(true);
        // Redirect to login if no token
        navigate(`/login?brokerId=${brokerId}`, { replace: true });
      }
    } catch (error) {
      console.error("Refresh error:", error);
      setSnackbarMessage("Failed to refresh data");
      setSnackbarOpen(true);
    }
    handleMenuClose();
  }, [getToken, handleMenuClose, navigate, brokerId]);

  // Show loading spinner while authenticating or checking auth
  if (isLoading || !authCheckComplete) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress size={48} />
        <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
          {isLoading ? "Checking authentication..." : "Loading dashboard..."}
        </Typography>
      </Box>
    );
  }

  // Show error if authentication failed (only for critical errors)
  if (error && error.includes("critical")) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
          p: 3,
        }}
      >
        <Container maxWidth="sm">
          <Card sx={{ textAlign: "center" }}>
            <CardContent>
              <Warning sx={{ fontSize: 48, color: "error.main", mb: 2 }} />
              <Typography variant="h5" sx={{ mb: 2 }}>
                Access Denied
              </Typography>
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
              <Typography
                variant="body1"
                sx={{ mb: 3, color: "text.secondary" }}
              >
                There was an issue accessing the dashboard. Please try logging
                in again.
              </Typography>
              <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                <Button
                  variant="contained"
                  startIcon={<Person />}
                  onClick={() => navigate(`/login?brokerId=${brokerId}`)}
                >
                  Login Again
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<Home />}
                  onClick={() => navigate("/")}
                >
                  Home
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  // Final check - don't render if not authenticated for this broker
  if (!isAuthenticatedForBroker(brokerId) || !user) {
    return null;
  }

  const screens = [
    {
      component: <HoldingsScreen onStockSelect={handleStockSelect} />,
      label: "Holdings",
      icon: <AccountBalanceWallet />,
    },
    {
      component: <OrderbookScreen onStockSelect={handleStockSelect} />,
      label: "Orders",
      icon: <Receipt />,
    },
    {
      component: <PositionsScreen onStockSelect={handleStockSelect} />,
      label: "Positions",
      icon: <ShowChart />,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{ bgcolor: "background.paper", color: "text.primary" }}
      >
        <Toolbar>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            {broker.icon}
            <Box sx={{ ml: 2 }}>
              <Typography variant="h6" fontWeight="bold">
                {broker.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Welcome back, {user.name}
                </Typography>
                {/* Show user roles/permissions as chips */}
                {user.roles && user.roles.length > 0 && (
                  <Chip
                    size="small"
                    label={user.roles[0]}
                    variant="outlined"
                    sx={{ height: 18, fontSize: "0.7rem" }}
                  />
                )}
              </Box>
            </Box>
          </Box>

          {/* User Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
              {user.name ? user.name.charAt(0).toUpperCase() : <Person />}
            </Avatar>
          </Box>

          <IconButton
            onClick={(e) => setMenuAnchorEl(e.currentTarget)}
            sx={{ color: "text.primary" }}
          >
            <MoreVert />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">{user.email}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user.roles?.join(", ") || "No roles"}
            </Typography>
          </ListItemText>
        </MenuItem>

        {hasRole && hasRole("ADMIN") && (
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <Security fontSize="small" />
            </ListItemIcon>
            <ListItemText>Admin Panel</ListItemText>
          </MenuItem>
        )}

        <MenuItem disabled>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleRefresh}>
          <ListItemIcon>
            <Refresh fontSize="small" />
          </ListItemIcon>
          <ListItemText>Refresh</ListItemText>
        </MenuItem>

        <MenuItem onClick={handleLogout} disabled={logoutLoading}>
          <ListItemIcon>
            {logoutLoading ? (
              <CircularProgress size={16} />
            ) : (
              <Logout fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText>
            {logoutLoading ? "Logging out..." : "Logout"}
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ pt: 12, pb: 10 }}>
        {screens[tabIndex].component}
      </Container>

      {/* Bottom Navigation */}
      <BottomNavigation
        value={tabIndex}
        onChange={(event, newValue) =>
          setSearchParams({ brokerId, tabIndex: newValue.toString() })
        }
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "background.paper",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        {screens.map((screen, index) => (
          <BottomNavigationAction
            key={index}
            label={screen.label}
            icon={screen.icon}
            sx={{
              color: "text.secondary",
              "&.Mui-selected": {
                color: "primary.main",
              },
            }}
          />
        ))}
      </BottomNavigation>

      {/* Draggable FAB - Show for all authenticated users, handle permissions inside */}
      <DraggableFAB
        onBuyClick={() => handleFABAction("BUY")}
        onSellClick={() => handleFABAction("SELL")}
      />

      {/* Order Pad */}
      <OrderPad
        open={orderPadOpen}
        onClose={() => setOrderPadOpen(false)}
        stock={selectedStock}
        orderType={orderType}
        onOrderPlace={handleOrderPlace}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default DashBoard;
