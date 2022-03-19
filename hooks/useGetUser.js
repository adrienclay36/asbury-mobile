import React, { useEffect, useCallback, useState } from "react";
import { getUser, downloadImage, getPublicUrl } from "../supabase-util";
const useGetUser = (user_id) => {
  const [user, setUser] = useState();
  const [avatarURL, setAvatarURL] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);

  const getUserHandler = useCallback(async () => {
    setLoadingUser(true);
    const userInfo = await getUser(user_id);
    setUser(userInfo);
    // const userImage = await downloadImage("avatars", userInfo.avatar_url);
    const userImage = await getPublicUrl('avatars', userInfo.avatar_url);
    setAvatarURL(userImage);
    setLoadingUser(false);
  }, [user_id]);

  useEffect(() => {
    if (user_id) {
      getUserHandler();
    }
  }, [user_id, getUserHandler]);

  return { user, avatarURL, loadingUser };
};

export default useGetUser;
