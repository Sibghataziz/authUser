import { Router } from "express";
import  GithubOAuthRouter from './github/router'

const router = Router();

router.use('/github', GithubOAuthRouter)

export default router