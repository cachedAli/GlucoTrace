import express from 'express';
import router from './routes/auth.routes.js'
import cors from 'cors';

const app = express()
const authRoutes = router;

app.use(cors())

app.use(express.json())

app.get("/", (req, res) => {
    res.send("Hellllloo")
})
app.use("/api/auth", authRoutes)

export default app