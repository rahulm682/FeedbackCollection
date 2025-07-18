import express from "express";
import {
  createForm,
  exportFormResponsesCsv,
  getAdminForms,
  getFormById,
  getFormResponses,
} from "../controllers/formController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createForm);
router.get("/", protect, getAdminForms);
router.get("/:id", getFormById);
router.get("/:formId/responses", protect, getFormResponses);
router.get("/:formId/responses/export-csv", protect, exportFormResponsesCsv);

export default router;
