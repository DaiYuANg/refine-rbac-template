import { useGetIdentity } from "@refinedev/core";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getAvatarFallback } from "@/utils";

type User = {
  id?: string | number;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
};

export function UserAvatar() {
  const { data: user, isLoading: userIsLoading } = useGetIdentity<User>();

  if (userIsLoading || !user) {
    return <Skeleton className={cn("h-10", "w-10", "rounded-full")} />;
  }

  const displayName =
    user.fullName ??
    user.name ??
    [user.firstName, user.lastName].filter(Boolean).join(" ") ??
    "";
  const { avatar } = user;

  return (
    <Avatar className={cn("h-10", "w-10")} size="lg">
      {avatar && <AvatarImage src={avatar} alt={displayName} />}
      <AvatarFallback>{getAvatarFallback(displayName)}</AvatarFallback>
    </Avatar>
  );
}

UserAvatar.displayName = "UserAvatar";
