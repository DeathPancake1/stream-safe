// usePhotoPath.js
import { useEffect, useState } from 'react';
import { useGetPhotoPathById, useGetPhotoByPath } from '../../api/hooks/photo-hook';
import { useUser } from '../../providers/UserContext';

export default function usePhotoPath(imageId) {
    const { userData } = useUser();
    const [photoUrl, setPhotoUrl] = useState(null);
    const { mutate: getPhotoPathById } = useGetPhotoPathById();
    const { mutate: getPhotoByPath } = useGetPhotoByPath();

    useEffect(() => {
        if (imageId) {
            getPhotoPathById({ photoId: imageId, jwt: userData.jwt },
                {
                    onSuccess: (response) => {
                        if (response.status === 201) {
                            const apiPath = response.data.message;
                            getPhoto(apiPath);
                        }
                    }
                }
            );
        }
    }, [imageId]);

    const getPhoto = (photoPath) => {
        getPhotoByPath({ photoPath, jwt: userData.jwt },
            {
                onSuccess: async (response) => {
                    if (response.status === 201) {
                        const url = await URL.createObjectURL(response.data);
                        setPhotoUrl(url);
                    } else {
                        setPhotoUrl('https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg');
                    }
                }
            }
        );
    };

    return photoUrl;
}
