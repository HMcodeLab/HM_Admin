import { NavSection } from "../../../../../types/data";
import * as Icons from "../icons";

import {
  FaUserShield,
  FaUserTie,
  FaUsersCog,
  FaChalkboardTeacher,
  FaUniversity,
  FaHandshake,
} from "react-icons/fa";

export const NAV_DATA: NavSection[] = [
  {
    label: "MAIN MENU",
    items: [
      // Dashboards per role
      {
        title: "Dashboard",
        icon: FaUserShield,
        url: "/",
        roles: ["superAdmin"],
      },
      {
        title: "Admin Dashboard",
        icon: FaUserTie,
        url: "/admin/dashboard",
        roles: ["admin", "superAdmin"],
      },
      {
        title: "HR Dashboard",
        icon: FaUsersCog,
        url: "/hr/dashboard",
        roles: ["hr", "superAdmin", "hr"],
      },
      {
        title: "Trainer Dashboard",
        icon: FaChalkboardTeacher,
        url: "/trainer/dashboard",
        roles: ["trainer", "superAdmin", "instructor"],
      },
      {
        title: "University Dashboard",
        icon: FaUniversity,
        url: "/university/dashboard",
        roles: ["university", "superAdmin"],
      },
      {
        title: "PAP Dashboard",
        icon: FaHandshake,
        url: "/pap/dashboard",
        roles: ["pap", "superAdmin"],
      },
      // Admission
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

      // HM Courses
      {
        title: "HM Courses",
        icon: Icons.Table,
        roles: ["superAdmin", "admin", "hr"],
        items: [
          {
            title: "Add Course",
            url: "/course/addcourse",
            roles: ["superAdmin", "admin", "hr", "instructor"],
          },
          {
            title: "View Course",
            url: "/course/viewcourse",
            roles: ["superAdmin", "admin", "hr", "instructor"],
          },
          {
            title: "View & Edit Course",
            url: "/course/allcourse",
            roles: ["superAdmin", "admin", "hr", "instructor"],
          },
        ],
      },

      // Trainer
      {
        title: "Trainer",
        icon: Icons.Table,
        roles: ["superAdmin", "trainer", "instructor"],
        items: [
          {
            title: "All Trainer",
            url: "/trainer",
            roles: ["superAdmin", "trainer", "instructor"],
          },
          {
            title: "Add Trainer",
            url: "/trainer/addtrainer",
            roles: ["superAdmin", "admin"],
          },
        ],
      },

      // University
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
            roles: ["superAdmin", "university", "hr"],
          },
        ],
      },

      // Promocode
      {
        title: "Promocode",
        icon: Icons.FourCircle,
        url: "/promocode",
        roles: ["superAdmin", "hr"],
      },

      // Payment
      {
        title: "Payment",
        icon: Icons.Table,
        url: "/payment",
        roles: ["superAdmin"],
      },

      // Freelancing Jobs
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
            roles: ["superAdmin", "admin", "hr"],
          },
        ],
      },

      // HM Jobs
      {
        title: "HM Jobs",
        icon: Icons.FourCircle,
        roles: ["superAdmin"],
        items: [
          {
            title: "View HM Jobs",
            url: "/hm-jobs/view",
            roles: ["superAdmin", "hr"],
          },
          {
            title: "Add HM Job",
            url: "/hm-jobs/add",
            roles: ["superAdmin"],
          },
        ],
      },

      // Internship
      {
        title: "Internship",
        icon: Icons.PieChart,
        roles: ["superAdmin", "admin"],
        items: [
          {
            title: "Add Internship",
            url: "/internship/add",
            roles: ["superAdmin", "admin"],
          },
        ],
      },

      // Course Batch
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

      // Role Management
      {
        title: "Role Management",
        icon: Icons.Calendar,
        roles: ["superAdmin", "hr"],
        items: [
          {
            title: "Role Management",
            url: "/role-management",
            roles: ["superAdmin", "hr"],
          },
        ],
      },
    ],
  },
];
