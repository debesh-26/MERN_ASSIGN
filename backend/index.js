import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connect } from "./db.js"
import authRoutes from "./routes/auth.js"
import userRoutes from "./routes/users.js"
const PORT = process.env.PORT || 8000


dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Connect to MongoDB
connect(process.env.MONGODB_URI)

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

