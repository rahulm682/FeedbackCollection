import express from "express";
import {
  createForm,
  deleteForm,
  exportFormResponsesCsv,
  getAdminFormDetails,
  getAdminForms,
  getFormById,
  getFormResponses,
} from "../controllers/formController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", protect, createForm);
router.get("/", protect, getAdminForms);
router.get("/:id", getFormById);
router.get("/:id/admin-details", protect, getAdminFormDetails);
router.get("/:formId/responses", protect, getFormResponses);
router.get("/:formId/responses/export-csv", protect, exportFormResponsesCsv);
router.delete("/:id", protect, deleteForm);

export default router;
