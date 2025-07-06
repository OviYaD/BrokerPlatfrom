import { useEffect, useState } from "react";
import { mockApi } from "../utils/constant";
import { Box, Card, CardContent, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";

export default function HoldingsScreen({ onStockSelect }) {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHoldings = async () => {
      setLoading(true);
      const response = await mockApi.getHoldings();
      setHoldings(response.data);
      setLoading(false);
    };
    fetchHoldings();
  }, []);

  const totalPnl = holdings.reduce((sum, holding) => sum + holding.pnl, 0);
  const totalInvestment = holdings.reduce(
    (sum, holding) => sum + holding.qty * holding.avgPrice,
    0
  );

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

  return (
    <Box sx={{ pb: 10 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Portfolio Summary
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Total Investment
              </Typography>
              <Typography variant="h6">
                ₹{totalInvestment.toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Current Value
              </Typography>
              <Typography variant="h6">
                ₹{(totalInvestment + totalPnl).toLocaleString()}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="body2" color="text.secondary">
                Total P&L
              </Typography>
              <Typography
                variant="h6"
                color={totalPnl >= 0 ? "success.main" : "error.main"}
              >
                ₹{totalPnl.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Holdings
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">Qty</TableCell>
              <TableCell align="right">Avg Price</TableCell>
              <TableCell align="right">LTP</TableCell>
              <TableCell align="right">P&L</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {holdings.map((holding) => (
              <TableRow
                key={holding.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  onStockSelect({
                    symbol: holding.symbol,
                    name: holding.name,
                    ltp: holding.ltp,
                  })
                }
              >
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {holding.symbol}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {holding.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">{holding.qty}</TableCell>
                <TableCell align="right">₹{holding.avgPrice}</TableCell>
                <TableCell align="right">₹{holding.ltp}</TableCell>
                <TableCell align="right">
                  <Box>
                    <Typography
                      variant="body2"
                      color={holding.pnl >= 0 ? "success.main" : "error.main"}
                    >
                      ₹{holding.pnl.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={holding.pnl >= 0 ? "success.main" : "error.main"}
                    >
                      ({holding.pnlPercent > 0 ? "+" : ""}
                      {holding.pnlPercent}%)
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}