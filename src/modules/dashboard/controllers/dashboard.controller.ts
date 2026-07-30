import { Request, Response } from "express";

import { asyncHandler } from "@/config/utils/asyncHandler";
import { dashboardService } from "../services/dashboard.service";

class DashboardController {
  getOverview = asyncHandler(
    async (req: Request, res: Response) => {
      const dashboard =
        await dashboardService.getOverview(
          req.user.userId
        );

      res.status(200).json({
        success: true,
        message: "Dashboard fetched successfully.",
        data: dashboard,
      });
    }
  );
}

export const dashboardController =
  new DashboardController();
