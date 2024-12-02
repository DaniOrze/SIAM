if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não está definido no arquivo .env");
}

const jwtConfig = {
  secret: process.env.JWT_SECRET as string,
  expiresIn: "1h",
};

export default jwtConfig;