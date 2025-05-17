import jwt from "jsonwebtoken";
// import "dotenv/config";

type Role = "admin" | "seller" | "buyer" | "superadmin";

interface TokenPayload {
  id: string;
  role: Role;
}

const generateToken = (id: string, role?: Role): string => {
  const userRole: Role = role ?? 'buyer'; // Come back to this

  const payload: TokenPayload = { id, role: userRole };
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export default generateToken;