// utils/roleRoutes.ts
export const roleRoutes: Record<string, string[]> = {
  superAdmin: [
    "/",
    "/dashboard/students",
    "/dashboard/hr",
    "/dashboard/instructors",
    "/dashboard/university",
    "/dashboard/media",
  ],
  admin: ["/dashboard", "/dashboard/students", "/dashboard/hr"],
  hr: ["/dashboard/hr"],
  university: ["/dashboard/university"],
  instructor: ["/dashboard/instructors"],
};
