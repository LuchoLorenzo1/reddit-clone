export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/api/:path*", "/r/create", "/post", "/edit"],
};
