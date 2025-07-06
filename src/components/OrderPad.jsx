import { Add, Close, Remove } from "@mui/icons-material";
import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { mockApi } from "../utils/constant";

export default function OrderPad({ open, onClose, stock, orderType, onOrderPlace }) {
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState(stock?.ltp || "");
  const [orderTypeLocal, setOrderTypeLocal] = useState("MARKET");
  const [loading, setLoading] = useState(false);

  const isBuy = orderType === "BUY";
  const primaryColor = isBuy ? "success" : "error";

  const handleQuantityChange = (delta) => {
    const newQty = Math.max(0, parseInt(quantity || "0") + delta);
    setQuantity(newQty.toString());
  };

  const handleSubmit = async () => {
    if (!quantity || parseInt(quantity) <= 0) {
      return;
    }

    setLoading(true);
    const orderData = {
      symbol: stock.symbol,
      type: orderType,
      quantity: parseInt(quantity),
      price: orderTypeLocal === "MARKET" ? 0 : parseFloat(price),
      orderType: orderTypeLocal,
    };

    try {
      await mockApi.placeOrder(orderData);
      onOrderPlace(
        `${orderType} order placed successfully for ${quantity} shares of ${stock.symbol}`
      );
      onClose();
    } catch (error) {
      console.error("Order placement failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{
          bgcolor: `${primaryColor}.main`,
          color: "white",
          position: "relative",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">
            {orderType} {stock?.symbol}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" fontWeight="bold">
            {stock?.name}
          </Typography>
          <Typography variant="h6" color={`${primaryColor}.main`}>
            ₹{stock?.ltp}
            <Chip
              label={`${isBuy ? "+" : "-"}2.5%`}
              size="small"
              color={isBuy ? "success" : "error"}
              sx={{ ml: 1 }}
            />
          </Typography>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Order Type
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant={orderTypeLocal === "MARKET" ? "contained" : "outlined"}
              onClick={() => setOrderTypeLocal("MARKET")}
              size="small"
            >
              Market
            </Button>
            <Button
              variant={orderTypeLocal === "LIMIT" ? "contained" : "outlined"}
              onClick={() => setOrderTypeLocal("LIMIT")}
              size="small"
            >
              Limit
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Quantity
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={() => handleQuantityChange(-1)}
              disabled={parseInt(quantity || "0") <= 0}
            >
              <Remove />
            </IconButton>
            <TextField
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              placeholder="0"
              sx={{ width: 100 }}
              inputProps={{ min: 0 }}
            />
            <IconButton onClick={() => handleQuantityChange(1)}>
              <Add />
            </IconButton>
          </Box>
        </Box>

        {orderTypeLocal === "LIMIT" && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Price
            </Typography>
            <TextField
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="0.00"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">₹</InputAdornment>
                ),
              }}
            />
          </Box>
        )}

        <Box
          sx={{ mb: 3, p: 2, bgcolor: "background.default", borderRadius: 1 }}
        >
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Order Summary
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2">Quantity:</Typography>
            <Typography variant="body2" fontWeight="bold">
              {quantity || 0} shares
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="body2">Price:</Typography>
            <Typography variant="body2" fontWeight="bold">
              ₹{orderTypeLocal === "MARKET" ? stock?.ltp : price || "0"}
            </Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" fontWeight="bold">
              Total:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              ₹
              {(
                parseInt(quantity || "0") *
                  (orderTypeLocal === "MARKET"
                    ? stock?.ltp
                    : parseFloat(price || "0")) || 0
              ).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          fullWidth
          variant="contained"
          color={primaryColor}
          size="large"
          onClick={handleSubmit}
          disabled={loading || !quantity || parseInt(quantity) <= 0}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading
            ? "Placing Order..."
            : `${orderType} ${quantity || 0} Shares`}
        </Button>
      </DialogActions>
    </Dialog>
  );
}