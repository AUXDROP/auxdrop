"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { followUser, unfollowUser } from "./actions";

export function FollowButton({
  targetUserId,
  initiallyFollowing,
}: {
  targetUserId: string;
  initiallyFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initiallyFollowing);
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={following ? "secondary" : "primary"}
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          if (following) {
            await unfollowUser(targetUserId);
            setFollowing(false);
          } else {
            await followUser(targetUserId);
            setFollowing(true);
          }
        });
      }}
    >
      {following ? "Following" : "Follow"}
    </Button>
  );
}
