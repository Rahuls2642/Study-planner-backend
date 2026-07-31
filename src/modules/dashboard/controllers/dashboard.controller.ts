import { Request, Response } from "express";
import { asyncHandler } from "@/config/utils/asyncHandler";
import { dashboardService } from "../services/dashboard.service";

class DashboardController {
  getDashboard = asyncHandler(async (req: Request, res: Response) => {
    const data = await dashboardService.getDashboardData(req.user.userId);
    res.json({
      success: true,
      data,
    });
  });
}

export const dashboardController = new DashboardController();
