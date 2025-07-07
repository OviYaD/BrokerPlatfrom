import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Fade,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { brokers } from "../utils/constant";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const BrokerPlatForm = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredBrokers = brokers.filter((broker) =>
    broker.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBrokerSelect = (broker) => {
    navigate("/login?brokerId=" + broker.id);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 4 }}>
        <Fade in={true}>
          <Box>
            <Box sx={{ textAlign: "center", mb: 6 }}>
              <Typography
                variant="h3"
                sx={{ fontWeight: 700, color: "text.primary", mb: 2 }}
              >
                Choose Your Broker
              </Typography>
              <Typography variant="h6" sx={{ color: "text.secondary", mb: 4 }}>
                Select from India's leading stock brokers
              </Typography>

              <TextField
                fullWidth
                placeholder="Search brokers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ maxWidth: 400 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Grid 
              container 
              spacing={3}
              sx={{ 
                justifyContent: "center",
                display: "flex"
              }}
            >
              {filteredBrokers.map((broker) => (
                <Grid item xs={12} sm={6} md={3} key={broker.id}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
                        "& .broker-icon": {
                          transform: "scale(1.1)",
                        },
                      },
                    }}
                    onClick={() => handleBrokerSelect(broker)}
                  >
                    <CardContent sx={{ textAlign: "center", p: 3 }}>
                      <Box
                        className="broker-icon"
                        sx={{ mb: 2, transition: "transform 0.3s ease" }}
                      >
                        {broker.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {broker.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        {broker.description}
                      </Typography>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 2,
                        }}
                      >
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Users
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {broker.stats.users}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Brokerage
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {broker.stats.brokerage}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Uptime
                          </Typography>
                          <Typography variant="body2" fontWeight="bold">
                            {broker.stats.uptime}
                          </Typography>
                        </Box>
                      </Box>

                      <Chip
                        label={`Growth ${broker.growth}`}
                        size="small"
                        sx={{
                          bgcolor: broker.color + "20",
                          color: broker.color,
                          fontWeight: "bold",
                        }}
                      />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default BrokerPlatForm;