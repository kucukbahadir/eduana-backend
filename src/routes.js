import { Router } from "express";
import { handleTokenBasedAuthentication } from "./middelware/authenticationMiddleware";


export const router = Router();



// NOTE: Everything after this point only works with a valid JWT token!
router.use(handleTokenBasedAuthentication);

