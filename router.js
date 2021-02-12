import { Router } from "express";
import express from "express";

const router = Router();
router.get("/", (req, res) => {
  res.status(200).send({ msg: "response comes from root router" });
});

export default router;
