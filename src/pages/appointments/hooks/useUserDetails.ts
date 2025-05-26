import { useCallback, useEffect, useState } from "react";
import { userService, UserServiceError } from "../../../services/userService";

export const useUserDetails = (
  userIds: string[],
  setUserDetailsLoading: (loading: boolean) => void
) => {
  const [userDetails, setUserDetails] = useState<Record<string, string>>({});
  const [userDetailsError, setUserDetailsError] = useState<string | null>(null);
  const [failedUserIds, setFailedUserIds] = useState<string[]>([]);

  const getUserName = useCallback(
    async (userId: string): Promise<string> => {
      if (userDetails[userId]) return userDetails[userId];
      if (failedUserIds.includes(userId)) return "User not found";

      try {
        const user = await userService.getUserById(userId);
        const userName = `${user.firstName} ${user.lastName}`;
        setUserDetails((prev) => ({
          ...prev,
          [userId]: userName,
        }));
        return userName;
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setFailedUserIds((prev) => [...prev, userId]);
        return "User not found";
      }
    },
    [userDetails, failedUserIds]
  );

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userIds.length === 0) return;

      setUserDetailsLoading(true);
      const details: Record<string, string> = {};
      const newFailedIds = new Set<string>();
      let hasError = false;

      const currentFailedIds = new Set(failedUserIds);

      const fetchPromises = userIds
        .filter((id) => !currentFailedIds.has(id) && !userDetails[id])
        .map(async (id) => {
          try {
            const userDetail = await userService.getUserById(id);
            details[id] = `${userDetail.firstName} ${userDetail.lastName}`;
          } catch (error) {
            newFailedIds.add(id);
            hasError = true;

            if (error instanceof UserServiceError) {
              if (error.code === "USER_NOT_FOUND") {
                // Silent handling for not found users
              } else if (error.code === "SERVER_ERROR") {
                setUserDetailsError(
                  "Server error while loading user details. Some information may be incomplete."
                );
              }
            }
          }
        });

      try {
        await Promise.all(fetchPromises);

        if (Object.keys(details).length > 0) {
          setUserDetails((prev) => ({ ...prev, ...details }));
        }
        if (newFailedIds.size > 0) {
          setFailedUserIds((prev) => [...prev, ...Array.from(newFailedIds)]);
        }
        if (!hasError) {
          setUserDetailsError(null);
        }
      } catch {
        setUserDetailsError("Failed to load user details");
      } finally {
        setUserDetailsLoading(false);
      }
    };

    fetchUserDetails();
  }, [userIds, failedUserIds, userDetails, setUserDetailsLoading]);

  return {
    userDetails,
    userDetailsError,
    setUserDetailsError,
    getUserName,
  };
}; 