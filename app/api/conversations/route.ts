import { getCurrentUser } from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse("Inavlid data", { status: 400 });
    }

    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name,
          isGroup,
          users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value,
              })),
              { id: currentUser.id },
            ],
          },
        },
        include: {
          users: true,
        },
      });
      // console.log({ data: newConversation, label: "New Group Conversation" });

      return NextResponse.json(newConversation);
    }

    const exisitingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: {
              equals: [currentUser.id, userId],
            },
          },
          {
            userIds: {
              equals: [userId, currentUser.id],
            },
          },
        ],
      },
    });
    // console.log({
    //   data: exisitingConversations,
    //   label: "Exisiting Conversations",
    // });

    const singleConversation = exisitingConversations[0];
    // console.log({ data: singleConversation, label: "Single Conversation" });

    if (singleConversation) {
      return NextResponse.json(singleConversation);
    }

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            {
              id: currentUser.id,
            },
            {
              id: userId,
            },
          ],
        },
      },
      include: {
        users: true,
      },
    });
    // console.log({ data: newConversation, label: "New Conversation response" });

    return NextResponse.json(newConversation);
  } catch (error: any) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
