import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "industrial-edge-secret-secure-key-2026-b2b"
);

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function createAdminToken(session: AdminSession): Promise<string> {
  return await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyAdminTokenString(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token) return null;
    return await verifyAdminTokenString(token);
  } catch {
    return null;
  }
}

export async function verifyApiAuth(request: NextRequest): Promise<AdminSession | null> {
  // Check authorization header or cookie
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    return await verifyAdminTokenString(token);
  }

  const cookieToken = request.cookies.get("admin_token")?.value;
  if (cookieToken) {
    return await verifyAdminTokenString(cookieToken);
  }

  return null;
}
