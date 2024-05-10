import React, { useEffect, useState } from 'react';
import { useAllChannels } from "../../api/hooks/channel-card-hook";
import RecipeReviewCard from '../channelCard/channels';
import { useUser } from '../../providers/UserContext';

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
                        subheader={channel.subheader}
                        image={channel.image}
                        description={channel.description}
                    />
                </div>
            ))}
        </div>
    );
}
