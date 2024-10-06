import express from "express";
import cors from "cors";
import medicationRoutes from "./routes/medication.routes";
import responsibleRoutes from "./routes/responsible.routes";
import authRoutes from "./routes/auth.routes";
import { serve, setup } from "./config/swagger";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/api-docs", serve, setup);

app.use(medicationRoutes);
app.use(responsibleRoutes);
app.use(authRoutes);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
