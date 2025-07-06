import { Business, Security, Speed, TrendingUp } from "@mui/icons-material";
import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
      light: "#60a5fa",
      dark: "#1e40af",
    },
    secondary: {
      main: "#10b981",
      light: "#34d399",
      dark: "#047857",
    },
    error: {
      main: "#ef4444",
      light: "#f87171",
      dark: "#dc2626",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
    },
    background: {
      default: "#0f172a",
      paper: "#1e293b",
    },
    text: {
      primary: "#f1f5f9",
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e293b",
          border: "1px solid #334155",
          borderRadius: "12px",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#334155",
            },
            "&:hover fieldset": {
              borderColor: "#475569",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#3b82f6",
            },
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e293b",
          borderTop: "1px solid #334155",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #334155",
        },
      },
    },
  },
});

export const brokers = [
  {
    id: 1,
    name: "Zerodha",
    icon: <Speed sx={{ fontSize: 48, color: "#10b981" }} />,
    description: "India's largest broker",
    stats: { users: "1.2M+", brokerage: "₹0", uptime: "99.9%" },
    growth: "+15%",
    color: "#10b981",
  },
  {
    id: 2,
    name: "Upstox",
    icon: <TrendingUp sx={{ fontSize: 48, color: "#3b82f6" }} />,
    description: "Technology-first broker",
    stats: { users: "800K+", brokerage: "₹10", uptime: "99.7%" },
    growth: "+22%",
    color: "#3b82f6",
  },
  {
    id: 3,
    name: "Angel One",
    icon: <Security sx={{ fontSize: 48, color: "#ef4444" }} />,
    description: "Full-service broker",
    stats: { users: "1.5M+", brokerage: "₹15", uptime: "99.8%" },
    growth: "+8%",
    color: "#ef4444",
  },
  {
    id: 4,
    name: "HDFC Securities",
    icon: <Business sx={{ fontSize: 48, color: "#f59e0b" }} />,
    description: "Trusted banking partner",
    stats: { users: "600K+", brokerage: "₹25", uptime: "99.5%" },
    growth: "+12%",
    color: "#f59e0b",
  },
];

export const mockHoldings = [
  {
    id: 1,
    symbol: "RELIANCE",
    name: "Reliance Industries",
    qty: 50,
    avgPrice: 2450,
    ltp: 2520,
    pnl: 3500,
    pnlPercent: 2.86,
  },
  {
    id: 2,
    symbol: "TCS",
    name: "Tata Consultancy Services",
    qty: 25,
    avgPrice: 3200,
    ltp: 3180,
    pnl: -500,
    pnlPercent: -0.63,
  },
  {
    id: 3,
    symbol: "INFY",
    name: "Infosys Limited",
    qty: 30,
    avgPrice: 1450,
    ltp: 1520,
    pnl: 2100,
    pnlPercent: 4.83,
  },
  {
    id: 4,
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    qty: 40,
    avgPrice: 1680,
    ltp: 1720,
    pnl: 1600,
    pnlPercent: 2.38,
  },
  {
    id: 5,
    symbol: "ICICIBANK",
    name: "ICICI Bank",
    qty: 35,
    avgPrice: 920,
    ltp: 895,
    pnl: -875,
    pnlPercent: -2.72,
  },
];

export const mockOrderbook = [
  {
    id: 1,
    symbol: "RELIANCE",
    type: "BUY",
    qty: 10,
    price: 2450,
    status: "COMPLETE",
    time: "09:15:30",
    pnl: 700,
  },
  {
    id: 2,
    symbol: "TCS",
    type: "SELL",
    qty: 5,
    price: 3200,
    status: "COMPLETE",
    time: "10:20:15",
    pnl: -200,
  },
  {
    id: 3,
    symbol: "INFY",
    type: "BUY",
    qty: 15,
    price: 1450,
    status: "PENDING",
    time: "11:30:45",
    pnl: 0,
  },
  {
    id: 4,
    symbol: "HDFCBANK",
    type: "BUY",
    qty: 20,
    price: 1680,
    status: "CANCELLED",
    time: "12:45:10",
    pnl: 0,
  },
  {
    id: 5,
    symbol: "WIPRO",
    type: "SELL",
    qty: 25,
    price: 420,
    status: "COMPLETE",
    time: "14:15:20",
    pnl: 500,
  },
];

export const mockPositions = [
  {
    id: 1,
    symbol: "NIFTY23NOV18000CE",
    name: "NIFTY 18000 CE",
    qty: 50,
    avgPrice: 125,
    ltp: 135,
    pnl: 500,
    pnlPercent: 8.0,
  },
  {
    id: 2,
    symbol: "BANKNIFTY23NOV45000PE",
    name: "BANKNIFTY 45000 PE",
    qty: -25,
    avgPrice: 180,
    ltp: 165,
    pnl: 375,
    pnlPercent: -8.33,
  },
  {
    id: 3,
    symbol: "RELIANCE23NOV2500CE",
    name: "RELIANCE 2500 CE",
    qty: 100,
    avgPrice: 45,
    ltp: 52,
    pnl: 700,
    pnlPercent: 15.56,
  },
];

export const mockStocks = [
  { symbol: "RELIANCE", name: "Reliance Industries", ltp: 2520, change: 2.86 },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    ltp: 3180,
    change: -0.63,
  },
  { symbol: "INFY", name: "Infosys Limited", ltp: 1520, change: 4.83 },
  { symbol: "HDFCBANK", name: "HDFC Bank", ltp: 1720, change: 2.38 },
  { symbol: "ICICIBANK", name: "ICICI Bank", ltp: 895, change: -2.72 },
];

export const mockApi = {
  login: async (email, password, brokerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === "test@example.com" && password === "password123") {
          resolve({
            status: 200,
            data: {
              token: "mock_jwt_token_" + Date.now(),
              refreshToken: "mock_refresh_token_" + Date.now(),
              user: {
                id: 1,
                email: email,
                name: "Test User",
                brokerId: brokerId,
                permissions:
                  email == "test@example.com"
                    ? ["TRADE", "VIEW_DASHBOARD", "SELL", "BUY"]
                    : [],
                roles: email == "test@example.com" ? ["USER"] : [],
              },
            },
          });
        } else if (email === "error@example.com") {
          resolve({
            status: 500,
            error: "Server error. Please try again later.",
          });
        } else {
          resolve({
            status: 400,
            error: "Invalid credentials. Please check your email and password.",
          });
        }
      }, 1500);
    });
  },

  signup: async (email, password, name, brokerId) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === "existing@example.com") {
          resolve({
            status: 400,
            error: "Email already exists. Please use a different email.",
          });
        } else {
          resolve({
            status: 200,
            data: {
              message: "Account created successfully. Please login.",
              token: "mock_jwt_token_" + Date.now(),
              refreshToken: "mock_refresh_token_" + Date.now(),
              user: {
                id: Date.now(),
                email: email,
                name: name,
                brokerId: brokerId,
                permissions:
                  email == "test@example.com"
                    ? ["TRADE", "VIEW_DASHBOARD", "SELL", "BUY"]
                    : [],
                roles: email == "test@example.com" ? ["USER"] : [],
              },
            },
          });
        }
      }, 1500);
    });
  },

  getHoldings: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, data: mockHoldings });
      }, 800);
    });
  },

  getOrderbook: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, data: mockOrderbook });
      }, 800);
    });
  },

  getPositions: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 200, data: mockPositions });
      }, 800);
    });
  },

  placeOrder: async (orderData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          status: 200,
          data: {
            orderId: "ORD_" + Date.now(),
            message: "Order placed successfully",
          },
        });
      }, 1000);
    });
  },
};
