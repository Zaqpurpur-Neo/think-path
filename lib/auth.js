import jwt from "jsonwebtoken";

const JWT_TOKEN = process.env.JWT_SECRET_TOKEN

export function signToken(user) {
	return jwt.sign(
		{id: user.id, email: user.email},
		JWT_TOKEN,
		{expiresIn: "7d"}
	)
}

export function verifyToken(token) {
	try {
		return jwt.verify(token, JWT_TOKEN)
	} catch(err) {
		return null
	}
}

export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

export function setToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function clearToken() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}
