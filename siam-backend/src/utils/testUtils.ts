import jwt from "jsonwebtoken";
import jwtConfig from "../config/jwtConfig";

export const generateTestToken = () => {
  return jwt.sign({ userId: 1, role: "test" }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};
