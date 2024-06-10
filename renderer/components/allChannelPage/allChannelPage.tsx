import React, { useEffect, useState } from "react";
import { useAllChannels } from "../../api/hooks/channel-card-hook";
import RecipeReviewCard from "../channelCard/channelCard";
import { useUser } from "../../providers/UserContext";
import {
  useGetPhotoByPath,
  useGetPhotoPathById,
} from "../../api/hooks/photo-hook";
import SearchBox from "../SearchBox";
import { Box } from "@mui/material";
import { useSearchAllChannels } from "../../api/hooks/channel-hook";

export default function AllChannelPage() {
  const { userData } = useUser();
  const [arrayOfChannels, setArrayOfChannels] = useState([]);
  const { mutate: getAllChannels, isLoading: getAllChannelsLoading } =
    useAllChannels();
  const { mutate: searchAllChannels } = useSearchAllChannels();

  const handleSearch = async ({ email }: { email: string }) => {
    if (email.length > 2) {
      searchAllChannels(
        { jwt: userData.jwt, name: email },
        {
          onSuccess: (response) => {
            if (response.status === 201) {
              setArrayOfChannels(response.data.message);
            }
          },
        }
      );
    } else {
        handleGetAllChannels()
    }
  };

  const handleGetAllChannels = () => {
    getAllChannels(
      { jwt: userData.jwt },
      {
        onSuccess: (response) => {
          if (response.status === 201) {
            setArrayOfChannels(response.data.message);
          }
        },
      }
    );
  };

  useEffect(() => {
    handleGetAllChannels()
  }, []);

  return (
    <Box
      component="main"
      sx={{ flexGrow: 1, p: 3, width: `calc(100vw - 290px)` }}
    >
      <Box
        style={{
          width: "100%",
        }}
      >
        <SearchBox search={handleSearch} />
      </Box>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {arrayOfChannels.map((channel) => (
          <div key={channel.id} style={{ margin: "10px" }}>
            <RecipeReviewCard
              title={channel.title}
              ownerId={channel.ownerId}
              imageId={channel.thumbnailId}
              description={channel.description}
            />
          </div>
        ))}
      </div>
    </Box>
  );
}
