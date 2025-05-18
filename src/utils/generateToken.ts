import jwt from "jsonwebtoken";
// import "dotenv/config";

type Role = "admin" | "student" | "lecturer" | "superadmin";

interface TokenPayload {
  id: string;
  role: Role;
}

const generateToken = (id: string, role?: Role): string => {
  const userRole: Role = role ?? 'student'; // Come back to this

  const payload: TokenPayload = { id, role: userRole };
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

export default generateToken;