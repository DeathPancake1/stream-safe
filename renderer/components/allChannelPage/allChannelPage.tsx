import React, { useEffect, useState } from 'react';
import { useAllChannels } from "../../api/hooks/channel-card-hook";
import RecipeReviewCard from '../channelCard/channelCard';
import { useUser } from '../../providers/UserContext';
import { useGetPhotoByPath, useGetPhotoPathById } from '../../api/hooks/photo-hook';


export default function AllChannelPage() {
    const { userData } = useUser();
    const [arrayOfChannels, setArrayOfChannels] = useState([]);
    const { mutate: getAllChannels, isLoading: getAllChannelsLoading } = useAllChannels();


    useEffect(() => {
        getAllChannels({ jwt: userData.jwt },
            {
                onSuccess: (response) => {
                    if (response.status === 201) {
                        setArrayOfChannels(response.data.message);
                    }
                }
            })
    }, []);

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {arrayOfChannels.map(channel => (
                <div key={channel.id} style={{ margin: '10px' }}>
                    <RecipeReviewCard
                        title={channel.title}
                        ownerId={channel.ownerId}
                        imageId={channel.thumbnailId}
                        description={channel.description}
                    />
                </div>
            ))}
        </div>
    );
}