import { useEffect, useState } from "react";
import { mockApi } from "../utils/constant";
import { Box, Card, CardContent, Chip, CircularProgress, Grid, Paper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from "@mui/material";
import { Cancel, CheckCircle, Pending } from "@mui/icons-material";

export default function OrderbookScreen({ onStockSelect }) {
  const [orderbook, setOrderbook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const fetchOrderbook = async () => {
      setLoading(true);
      const response = await mockApi.getOrderbook();
      setOrderbook(response.data);
      setLoading(false);
    };
    fetchOrderbook();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const realizedPnl = orderbook
    .filter((order) => order.status === "COMPLETE")
    .reduce((sum, order) => sum + order.pnl, 0);
  const pendingOrders = orderbook.filter((order) => order.status === "PENDING");
  const completedOrders = orderbook.filter(
    (order) => order.status === "COMPLETE"
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETE":
        return "success";
      case "PENDING":
        return "warning";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "COMPLETE":
        return <CheckCircle />;
      case "PENDING":
        return <Pending />;
      case "CANCELLED":
        return <Cancel />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ pb: 10 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            P&L Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Realized P&L
              </Typography>
              <Typography
                variant="h6"
                color={realizedPnl >= 0 ? "success.main" : "error.main"}
              >
                ₹{realizedPnl.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Unrealized P&L
              </Typography>
              <Typography variant="h6" color="info.main">
                ₹5,425
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ mb: 2 }}>
        <Tab label="All Orders" />
        <Tab label="Pending" />
        <Tab label="Completed" />
      </Tabs>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order Details</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Status</TableCell>
              <TableCell align="right">P&L</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(tabValue === 0
              ? orderbook
              : tabValue === 1
              ? pendingOrders
              : completedOrders
            ).map((order) => (
              <TableRow
                key={order.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  onStockSelect({
                    symbol: order.symbol,
                    name: order.symbol,
                    ltp: order.price,
                  })
                }
              >
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {order.symbol}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.time}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={`${order.type} ${order.qty}`}
                    color={order.type === "BUY" ? "success" : "error"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">₹{order.price}</TableCell>
                <TableCell align="right">
                  <Chip
                    icon={getStatusIcon(order.status)}
                    label={order.status}
                    color={getStatusColor(order.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Typography
                    variant="body2"
                    color={order.pnl >= 0 ? "success.main" : "error.main"}
                  >
                    ₹{order.pnl.toLocaleString()}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
