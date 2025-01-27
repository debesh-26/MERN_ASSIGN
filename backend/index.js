import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { connect } from "./db.js"

const PORT = process.env.PORT || 5000


dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// Connect to MongoDB
connect(process.env.MONGODB_URI)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

