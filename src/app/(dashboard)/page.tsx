/* eslint-disable @typescript-eslint/no-explicit-any */
// import { getCurrent } from "@/features/auth/actions"; 
// import { getWorkspaces } from "@/features/workspaces/actions";

// import { redirect } from "next/navigation";

// export default async function Workspaces() {
//   const user = await getCurrent();
//   if (!user) {
//     redirect("/sign-in");
//   }

//   const workspaces = await getWorkspaces();

//   if (workspaces.total === 0) {
//     redirect("/workspaces/create");
//   } else {
//     redirect(`/workspaces/${workspaces.documents?.[0]?.$id ?? ''}`);
//   }
// }

import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

// Type guard to check if workspaces is of type DocumentList<Document>
function isDocumentList(workspaces: any): workspaces is { documents: Array<{ $id: string }> } {
  return workspaces && Array.isArray(workspaces.documents);
}

export default async function Workspaces() {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  const workspaces = await getWorkspaces();

  if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else if (isDocumentList(workspaces)) {
    redirect(`/workspaces/${workspaces.documents[0]?.$id ?? ''}`);
  } else {
    // Handle unexpected structure of `workspaces`
    redirect("/workspaces/create");
  }
}
