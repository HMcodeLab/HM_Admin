"use client";

import UpdateCourse from "@/components/course/UpdateCourse/UpdateCourse";
import { useParams } from "next/navigation";

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  return <UpdateCourse slug={slug} />;
}
