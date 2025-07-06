import { useEffect, useState } from "react";
import { mockApi } from "../utils/constant";
import { Box, Card, CardContent, Chip, CircularProgress, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Timeline } from "@mui/icons-material";

export default function PositionsScreen({ onStockSelect }) {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPositions = async () => {
      setLoading(true);
      const response = await mockApi.getPositions();
      setPositions(response.data);
      setLoading(false);
    };
    fetchPositions();
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

  const totalPnl = positions.reduce((sum, position) => sum + position.pnl, 0);
  const totalInvestment = positions.reduce(
    (sum, position) => sum + Math.abs(position.qty * position.avgPrice),
    0
  );

  return (
    <Box sx={{ pb: 10 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: "flex", alignItems: "center" }}
          >
            <Timeline sx={{ mr: 1 }} />
            Positions P&L
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
                {totalPnl >= 0 ? "+" : ""}₹{totalPnl.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Typography variant="h6" gutterBottom>
        Active Positions
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
            {positions.map((position) => (
              <TableRow
                key={position.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() =>
                  onStockSelect({
                    symbol: position.symbol,
                    name: position.name,
                    ltp: position.ltp,
                  })
                }
              >
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      {position.symbol}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {position.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Chip
                    label={Math.abs(position.qty)}
                    color={position.qty >= 0 ? "success" : "error"}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">₹{position.avgPrice}</TableCell>
                <TableCell align="right">₹{position.ltp}</TableCell>
                <TableCell align="right">
                  <Box>
                    <Typography
                      variant="body2"
                      color={position.pnl >= 0 ? "success.main" : "error.main"}
                    >
                      {position.pnl >= 0 ? "+" : ""}₹
                      {position.pnl.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="caption"
                      color={position.pnl >= 0 ? "success.main" : "error.main"}
                    >
                      ({position.pnlPercent > 0 ? "+" : ""}
                      {position.pnlPercent}%)
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
