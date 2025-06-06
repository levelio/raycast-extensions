import { Tool } from "@raycast/api";
import { getMember, getSpace, updateMember } from "../api";
import { MemberStatus } from "../models";

//! Member management not enabled yet
type Input = {
  /**
   * The unique identifier of the space to remove the member from.
   * This value can be obtained from the `getSpaces` tool.
   * */
  spaceId: string;

  /**
   * The unique identity of the member to remove (note: this is different from the id, which has a prefix `_participant`).
   * This value can be obtained from the `get-members` tool.
   */
  memberIdentity: string;
};

/**
 * Remove an active member from a space.
 */
export default async function tool({ spaceId, memberIdentity }: Input) {
  const response = await updateMember(spaceId, memberIdentity, {
    status: MemberStatus.Removed,
  });

  if (!response.member) {
    throw new Error("Failed to remove member");
  }

  return {
    object: response.member.object,
    name: response.member.name,
    id: response.member.id,
    identity: response.member.identity,
    global_name: response.member.global_name,
    status: response.member.status,
    role: response.member.role,
  };
}

export const confirmation: Tool.Confirmation<Input> = async (input) => {
  const s = await getSpace(input.spaceId);
  const m = await getMember(input.spaceId, input.memberIdentity);
  return {
    message: `Are you sure you want to remove ${m.member?.name} from the space?`,
    info: [
      {
        name: "Space",
        value: s.space.name,
      },
      {
        name: "Name",
        value: m.member.name,
      },
    ],
  };
};
