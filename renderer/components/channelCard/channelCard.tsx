import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useUserInfo from "../../api/hooks/user-info";
import { useGetPhotoPathById } from "../../api/hooks/photo-hook";
import { useEffect, useState } from "react";
import { useUser } from "../../providers/UserContext";

export default function ChannelCard({ title, imageId, description, ownerId }) {
  const { userData, updateUser } = useUser();
  const { mutate: getImageURL } = useGetPhotoPathById();
  const [imageUrl, setImageUrl] = useState<string>("");
  const ownerInfo = useUserInfo(ownerId);

  const handleGetImageUrl = async () => {
    if (imageId) {
      getImageURL(
        { photoId: imageId, jwt: userData.jwt },
        {
          onSuccess: (response) => {
            if (response.data) {
              setImageUrl(response.data);
            } else {
              setImageUrl(
                "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
              );
            }
          },
        }
      );
    } else {
      setImageUrl(
        "https://static.vecteezy.com/system/resources/previews/004/141/669/non_2x/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg"
      );
    }
  };
  useEffect(() => {
    handleGetImageUrl();
  }, []);
  return (
    <Card sx={{ maxWidth: 345, minWidth: 250, height: "330px" }}>
      <CardMedia sx={{ height: 140 }} image={imageUrl} title={title} />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Owner: <i>{ownerInfo?.firstname}</i>
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{overflow: "hidden"}}>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button fullWidth variant={"outlined"}>See More</Button>
      </CardActions>
    </Card>
  );
}
