import { redirect } from "next/navigation";

export default function CoursePage({ params }: { params: { cid: string } }) {
  const { cid } = params;
  redirect(`/Courses/${cid}/Home`);
}
