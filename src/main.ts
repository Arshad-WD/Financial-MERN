import "dotenv/config";
console.log("DEBUG: Current working directory is", process.cwd());
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

//Routers
import userRouters from "./modules/users/users.routes.js";
import authRouters from "./modules/auth/auth.routes.js";
import accountRouters from "./modules/accounts/accounts.routes.js";
import categoryRouters from "./modules/categories/categories.routes.js";
import transactionRouters from "./modules/transactions/transactions.routes.js";
import dashboardRouters from "./modules/dashboard/dashboard.routes.js";


import { globalErrorHandler } from "./common/filters/http-exception.filter.js";
import { responseInterceptor } from "./common/interceptors/response.interceptor.js";


const app = express();

//Middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));
app.use(responseInterceptor);


// Health Check
app.get("/", (req, res) => {
    res.json({ message: "API is running..."});
});

//Routes Usage
app.use("/api/v1/auth", authRouters);
app.use("/api/v1/users", userRouters);
app.use("/api/v1/accounts", accountRouters);
app.use("/api/v1/categories", categoryRouters);
app.use("/api/v1/transactions", transactionRouters);
app.use("/api/v1/dashboard", dashboardRouters);

app.use(globalErrorHandler);

const PORT  = process.env.PORT || 5000;

app.listen(Number(PORT), "0.0.0.0", ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
});

