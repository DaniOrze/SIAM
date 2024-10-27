import express from "express";
import cors from "cors";
import medicationRoutes from "./routes/medication.routes";
import responsibleRoutes from "./routes/responsible.routes";
import authRoutes from "./routes/auth.routes";
import alertRoutes from "./routes/alert.routes";
import { serve, setup } from "./config/swagger";
import adherenceRoutes from "./routes/adherence.routes";

const app = express();
const port = 3000;

app.use(cors({
  origin: '*'
}));

app.use(express.json());

app.use("/api-docs", serve, setup);

app.use(medicationRoutes);
app.use(responsibleRoutes);
app.use(authRoutes);
app.use(alertRoutes);
app.use(adherenceRoutes);

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
