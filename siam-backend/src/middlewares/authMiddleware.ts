import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwtConfig";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    return;
  }

  jwt.verify(token, jwtConfig.secret, (err, user) => {
    if (err) {
      res.status(403).json({ error: "Token inválido." });
      return;
    }
    next();
  });
};
