// gig.routes.js

import express from "express";
import { log } from "../../middlewares/logger.middleware.js";
import { requireAuth } from "../../middlewares/requireAuth.middleware.js";
import {
  getGigs,
  getGigById,
  addGig,
  updateGig,
  removeGig,
  addGigMsg,
  removeGigMsg,
} from "./gig.controller.js";

const router = express.Router();

// Public Routes
router.get("/", log, getGigs);
router.get("/:id", log, getGigById);

// Protected Routes (require authentication)
router.post("/", log, addGig);
router.put("/:id", log, updateGig);
router.delete("/:id", log, removeGig);
router.post("/:id/msg", log, addGigMsg);
router.delete("/:id/msg/:msgId", log, removeGigMsg);
// router.post("/", requireAuth, log, addGig);
// router.put("/:id", requireAuth, log, updateGig);
// router.delete("/:id", requireAuth, log, removeGig);
// router.post("/:id/msg", requireAuth, log, addGigMsg);
// router.delete("/:id/msg/:msgId", requireAuth, log, removeGigMsg);

export const gigRoutes = router;
