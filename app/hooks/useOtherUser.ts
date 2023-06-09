import { useSession } from "next-auth/react";
import { use, useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

const useOtherUser = (
  conversation: FullConversationType | { users: User[] }
) => {
  const session = useSession();
  const otherUser = useMemo(() => {
    // get currently logged in user's email
    const currentUserEmail = session?.data?.user?.email;

    const otherUser = conversation.users.filter(
      (user) => user.email !== currentUserEmail
    );

    return otherUser[0];
  }, [session?.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useOtherUser;
