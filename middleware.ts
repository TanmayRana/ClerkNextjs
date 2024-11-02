// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware();

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware({
//   publicRoutes: ["/api/webhooks/clerk"],
// });

// export const config = {
//   matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
// };

// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware({
//   publicRoutes: ["/api/webhooks/clerk"],
// });

// export const config = {
//   matcher: [
//     "/((?!_next|.*\\..*).*)", // Exclude Next.js internals and files with extensions
//     "/",
//     "/api/(.*)",
//   ],
// };

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextRequest } from "next/server";
// const isPublicRoute = createRouteMatcher([
//   "/sign-in(.*)",
//   "/sign-up(.*)",
//   "/api/webhooks/clerk",
// ]);

// export default clerkMiddleware(async (auth, req: NextRequest) => {
//   if (!isPublicRoute(req)) {
//     await auth.protect();
//   }
// });

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher(["/api/webhooks/clerk"]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  // Check if the route is public; if not, protect the route
  if (!isPublicRoute(req)) {
    await auth().protect();
  }
});

// Middleware configuration
export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/api(.*)",
    "/trpc(.*)",
  ],
};

// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextRequest } from "next/server";

// const isPublicRoute = createRouteMatcher([
//   "/sign-in(.*)",
//   "/sign-up(.*)",
//   "/api/webhooks/clerk",
// ]);

// export default clerkMiddleware(async (auth, req: NextRequest) => {
//   // Check if the route is public; if not, protect the route
//   if (!isPublicRoute(req)) {
//     await auth.requireAuth(); // Use requireAuth instead of protect
//   }
// });

// // Middleware configuration
// export const config = {
//   matcher: [
//     // Skip Next.js internals and static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/api(.*)",
//     "/trpc(.*)",
//   ],
// };

// import { authMiddleware } from "@clerk/nextjs";

// export default authMiddleware({
//   publicRoutes: ["/api/webhooks/clerk"],
// });

// export const config = {
//   matcher: [
//     "/((?!_next|.*\\..*).*)", // Exclude Next.js internals and files with extensions
//     "/",
//     "/api/(.*)",
//   ],
// };

// import { clerkMiddleware } from "@clerk/nextjs/server";

// export default clerkMiddleware({
//   publicRoutes: ["/api/webhooks/clerk"],
// });

// export const config = {
//   matcher: [
//     "/((?!_next|.*\\..*).*)", // Exclude Next.js internals and files with extensions
//     "/",
//     "/api/(.*)",
//   ],
// };
