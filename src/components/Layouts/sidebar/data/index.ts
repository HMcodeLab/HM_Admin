import { NavSection } from "../../../../../types/data";
import * as Icons from "../icons";


// Auto-fill roles in child items if missing
export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        url: "/",
        roles: ["superAdmin", "hr", "university", "admin", "pap"],
      },
      {
        title: "Admission",
        icon: Icons.Calendar,
        roles: ["superAdmin", "hr", "admin"],
        items: [
          {
            title: "Admission",
            url: "/admission",
            roles: ["superAdmin", "hr", "admin"],
          },
          {
            title: "Students Enquiry",
            url: "/admission/studentsenquiry",
            roles: ["superAdmin", "hr"],
          },
        ],
      },
      {
        title: "HM Courses",
        icon: Icons.Table,
        roles: ["superAdmin", "admin"],
        items: [
          {
            title: "Add Course",
            url: "/course/addcourse",
            roles: ["superAdmin", "admin"],
          },
          {
            title: "View Course",
            url: "/course/viewcourse",
            roles: ["superAdmin", "admin", "hr"],
          },
        ],
      },
      {
        title: "Trainer",
        icon: Icons.Table,
        roles: ["superAdmin", "hr", "trainer"],
        items: [
          {
            title: "All Trainer",
            url: "/trainer",
            roles: ["superAdmin", "hr", "trainer"],
          },
          {
            title: "Add Trainer",
            url: "/trainer/addtrainer",
            roles: ["superAdmin"],
          },
        ],
      },
      {
        title: "University",
        icon: Icons.Alphabet,
        url: "/university",
        roles: ["superAdmin", "university"],
        items: [
          {
            title: "Add University",
            url: "/university/add",
            roles: ["superAdmin"],
          },
          {
            title: "View University",
            url: "/university/view",
            roles: ["superAdmin", "university"],
          },
        ],
      },
      {
        title: "Promocode",
        icon: Icons.FourCircle,
        url: "/promocode",
        roles: ["superAdmin"],
      },
      {
        title: "Payment",
        icon: Icons.Table,
        url: "/payment",
        roles: ["superAdmin", "admin"],
      },
      {
        title: "Freelancing Jobs",
        icon: Icons.PieChart,
        roles: ["superAdmin", "admin"],
        items: [
          {
            title: "Add Freelancing",
            url: "/freelancing/addfreelancing",
            roles: ["superAdmin"],
          },
          {
            title: "Freelancing Details",
            url: "/freelancing",
            roles: ["superAdmin", "admin"],
          },
        ],
      },
      {
        title: "HM Jobs",
        icon: Icons.FourCircle,
        roles: ["superAdmin"],
        items: [
          {
            title: "View HM Jobs",
            url: "/hm-jobs/view",
            roles: ["superAdmin"],
          },
          {
            title: "Add HM Job",
            url: "/hm-jobs/add",
            roles: ["superAdmin"],
          },
        ],
      },
      {
        title: "Internship",
        icon: Icons.PieChart,
        roles: ["superAdmin", "admin", "hr"],
        items: [
          {
            title: "Add Internship",
            url: "/internship/add",
            roles: ["superAdmin", "admin", "hr"],
          },
        ],
      },
      {
        title: "Course Batch",
        icon: Icons.Calendar,
        roles: ["superAdmin", "hr", "admin"],
        items: [
          {
            title: "Find Batch",
            url: "/course-batch",
            roles: ["superAdmin", "hr", "admin"],
          },
        ],
      },
      {
        title: "Role Management",
        icon: Icons.Calendar,
        roles: ["superAdmin"],
        items: [
          {
            title: "Role Management",
            url: "/role-management",
            roles: ["superAdmin"],
          },
        ],
      },
    ],
  },
];
