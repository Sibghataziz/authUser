import { Router } from "express";
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
import GithubController from "./controller";
import GithubMiddleware from "./middleware";

const router = Router();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_SECRET_KEY,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    GithubMiddleware.githubMiddleware
  )
);

/**
 * @swagger
 * /auth/github:
 *   get:
 *     summary: GitHub authentication
 *     description: Redirects the user to GitHub for authentication.
 *     responses:
 *       201:
 *         description: User Authenticated successfully
 *       500:
 *         description: Bad request
 *       401:
 *         description: Unauthorized user
 */
router.get("/", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
  "/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/github/error",
    successRedirect: "/auth/github/success",
  }),
  GithubController.githubCallback
);
router.get("/success", GithubController.githubSuccess);
router.get("/error", GithubController.githubError);

export default router;
