// useUserInfo.js
import { useEffect, useState } from 'react';
import { useUser } from '../../providers/UserContext';
import { useUserById } from '../../api/hooks/user-by-id-hook';

export default function useUserInfo(userId) {
  const { userData } = useUser();
  const [userInfo, setUserInfo] = useState(null);
  const { mutate: getUserById } = useUserById();

  useEffect(() => {
    if (userId) {
      getUserById(
        { ownerId: userId, jwt: userData.jwt },
        {
          onSuccess: (response) => {
            if (response.status === 201) {
              setUserInfo(response.data.message);
            }
          }
        }
      );
    }
  }, [userId]);

  return userInfo;
}
