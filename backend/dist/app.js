import express from 'express';
import router from './routes/auth.routes.js';
import userRouter from './routes/dashboard.routes.js';
import cors from 'cors';
import statRouter from './routes/stats.routes.js';
const app = express();
const authRoutes = router;
const userRoutes = userRouter;
const statRoutes = statRouter;
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
    res.send("hola");
});
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/stats", statRoutes);
export default app;
