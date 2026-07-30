import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { notFound } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";
import testRoutes from "@/modules/test/test.route";
import routes from "./routes";
const app = express();

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(express.json());

app.use(cookieParser());
app.use("/api/v1", routes);
app.use("/api/v1/test", testRoutes);
app.get("/", (_, res) => {
    res.json({
        success: true,
        message: "StudySync API is running",
    });
});
app.use(notFound);

app.use(errorHandler);

export default app;