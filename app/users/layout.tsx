import getUsers from "../actions/getUsers";
import Sidebar from "../components/Sidebar/Sidebar";
import UserLIst from "./components/UserLIst";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const users = await getUsers();

  return (
    // @ts-expect-error Server Component
    <Sidebar>
      <UserLIst items={users} />
      <div className="h-full">{children}</div>
    </Sidebar>
  );
}
