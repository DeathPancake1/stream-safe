import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
    useGetPhotoByPath,
    useGetPhotoPathById,
} from "../../api/hooks/photo-hook";
import { useEffect, useState } from "react";
import { useUser } from "../../providers/UserContext";
import { useRouter } from "next/router";
import { useUserById } from "../../api/hooks/user-by-id-hook";

interface User {
    firstname: string;
    lastname: string;
    photoId: number | null;
}

export default function ChannelCard({
    title,
    imageId,
    description,
    ownerId,
    channelId,
}) {
    const { userData, updateUser } = useUser();
    const { mutate: getPhotoPathById, isLoading: getPhotoPathByIdLoading } =
        useGetPhotoPathById();
    const { mutate: getPhotoByPath, isLoading: getPhotoByPathLoading } =
        useGetPhotoByPath();
    const [photoPath, setPhotoPath] = useState<string>("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [owner, setOwner] = useState<User>({
        firstname: "",
        lastname: "",
        photoId: 0,
    });
    const { mutate: getUserById } = useUserById();
    const router = useRouter();

    const handleSeeMore = () => {
        router.push(`/channelInfo/${channelId}`);
    };

    useEffect(() => {
        getUserById(
            { ownerId: ownerId, jwt: userData.jwt },
            {
                onSuccess: (response) => {
                    if (response.status === 201) {
                        setOwner(response.data.message);
                    }
                },
            }
        );
    }, []);

    useEffect(() => {
        if (imageId) {
            getPhotoPathById(
                { photoId: imageId, jwt: userData.jwt },
                {
                    onSuccess: (response) => {
                        if (response.status === 201) {
                            var apiPath = response.data.message;
                            setPhotoPath(apiPath);
                        }
                    },
                }
            );
        }
    }, [imageId]);
    useEffect(() => {
        if (photoPath) {
            getPhotoByPath(
                { photoPath, jwt: userData.jwt },
                {
                    onSuccess: async (response) => {
                        if (response.status === 201) {
                            const url = await URL.createObjectURL(
                                response.data
                            );
                            setImageUrl(url);
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
    }, [photoPath]);
    return (
        <Card sx={{ maxWidth: 345, minWidth: 250, height: "330px" }}>
            <CardMedia sx={{ height: 140 }} image={imageUrl} title={title} />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {title}
                </Typography>
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                    Owner: <i>{owner?.firstname}</i>
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ overflow: "hidden" }}
                >
                    {description}
                </Typography>
            </CardContent>
            <CardActions>
                <Button fullWidth variant={"outlined"} onClick={handleSeeMore}>
                    See More
                </Button>
            </CardActions>
        </Card>
    );
}
