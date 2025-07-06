# Broker Platform - Multi-Broker Trading Dashboard

A modern React-based trading platform that allows users to access multiple Indian stock brokers through a unified interface. The platform features broker selection, authentication, and a comprehensive trading dashboard with holdings, orders, and positions management.

## 🚀 Features

### Core Features
- **Multi-Broker Support**: Connect to multiple Indian stock brokers
- **Unified Dashboard**: Single interface for all your trading needs
- **Real-time Data**: Mock real-time stock prices and market data
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Material-UI Components**: Modern, accessible UI components

### Trading Features
- **Holdings Management**: View and manage your stock holdings
- **Order Book**: Track all your buy/sell orders
- **Position Tracking**: Monitor your active positions
- **Quick Trading**: Draggable FAB for quick buy/sell actions
- **Stock Search**: Search and filter stocks across all screens

### Authentication & Security
- **Broker-Specific Auth**: Each broker has its own authentication
- **Role-Based Access**: Different permissions for different user types
- **Session Management**: Secure session handling with token management
- **Protected Routes**: Route protection based on authentication status

## 🛠️ Tech Stack

- **Frontend**: React 19.1.0
- **Routing**: React Router DOM 7.6.3
- **UI Framework**: Material-UI (MUI) 7.2.0
- **Icons**: Material-UI Icons
- **Build Tool**: Vite 7.0.0
- **Deployment**: GitHub Pages

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/oviyad/BrokerPlatfrom.git
   cd BrokerPlatfrom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/           # Reusable components
│   ├── DraggableFAB.js  # Floating action button for quick trades
│   ├── OrderPad.js      # Order placement component
│   ├── HoldingsScreen.js # Holdings management
│   ├── OrderbookScreen.js # Order book display
│   └── PositionsScreen.js # Positions tracking
├── contextApi/          # Context providers
│   └── AuthContext.js   # Authentication context
├── pages/               # Page components
│   ├── index.js         # Broker selection page
│   ├── login.js         # Login/Register page
│   └── dashboard.js     # Main dashboard
├── routes/              # Routing configuration
│   ├── index.js         # Main routes
│   └── ProtectedRoutes.js # Protected route wrapper
├── utils/               # Utilities and constants
│   └── constant.js      # Mock data and configurations
└── App.js              # Main application component
```

## 🎯 Usage

### Getting Started

1. **Select a Broker**: Choose from the available brokers on the home page
2. **Login/Register**: Create an account or login with existing credentials
3. **Access Dashboard**: Navigate through holdings, orders, and positions
4. **Place Orders**: Use the floating action button or click on stocks to trade

### Demo Credentials

For testing purposes, use these credentials:
- **Email**: `test@example.com`
- **Password**: `password123`

> **Note**: Only the test user has full permissions (trade, sell, buy). Other users have limited access to demonstrate role-based permissions.

### Navigation

- **Holdings Tab**: View your current stock holdings
- **Orders Tab**: Track pending and executed orders
- **Positions Tab**: Monitor your trading positions
- **Quick Trade**: Use the draggable FAB for instant buy/sell

## 🔧 Configuration

### Broker Configuration

Brokers are configured in `src/utils/constant.js`. Each broker includes:
- Basic information (name, description, icon)
- Statistics (users, brokerage, uptime)
- Visual styling (colors, growth indicators)

### Authentication Flow

1. **Broker Selection**: User selects a broker from the grid
2. **Authentication**: Login/register with broker-specific credentials
3. **Authorization**: Role-based access control
4. **Session Management**: Secure token-based sessions

## 📱 Responsive Design

The platform is fully responsive and optimized for:
- **Desktop**: Full-featured dashboard experience
- **Tablet**: Optimized layout for medium screens
- **Mobile**: Touch-friendly interface with bottom navigation

## 🔐 Security Features

- **Authentication**: Secure login/logout functionality
- **Authorization**: Role-based access control
- **Session Management**: Token-based session handling
- **Protected Routes**: Route-level security
- **Input Validation**: Form validation and sanitization

## 🚀 Deployment

### GitHub Pages Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```bash
   npm run deploy
   ```

### Manual Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

## 📊 Mock Data

The application uses mock data for demonstration:
- **Stock Data**: Sample stock prices and information
- **Holdings**: Mock user holdings
- **Orders**: Sample order history
- **Positions**: Mock trading positions

## 🔮 Future Enhancements

- **Real API Integration**: Connect to actual broker APIs
- **Advanced Charting**: Interactive stock charts
- **Portfolio Analytics**: Detailed portfolio analysis
- **Notification System**: Real-time alerts and notifications
- **Dark Mode**: Toggle between light and dark themes
- **Multi-language Support**: Localization for different languages

## 🐛 Known Issues

- Mock data is used for demonstration purposes
- No real-time data connection
- Limited broker integrations (demo only)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
