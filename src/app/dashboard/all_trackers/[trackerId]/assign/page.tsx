import { redirect } from "next/navigation";

export default function AssignTrackerRedirectPage() {
  redirect("/dashboard/all_trackers");
}
