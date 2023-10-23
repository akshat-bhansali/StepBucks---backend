const express = require("express");
const {
  getAllContests,
  createContest,
  updateContest,
  deleteContest,
  getContestDetail,
  getAdminContests,
} = require("../controllers/contestController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();
router.route("/contests").get(getAllContests);
router
  .route("/admin/contest/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createContest);
router
  .route("/admin/contest/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateContest)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteContest)
  .get(getContestDetail);
router.route("/contest/:id").get(getContestDetail);
router
  .route("/admin/contests")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminContests);

module.exports = router;
