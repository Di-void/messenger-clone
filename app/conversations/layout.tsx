import React from "react";
import Sidebar from "../components/Sidebar/Sidebar";

export default async function ConversationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
