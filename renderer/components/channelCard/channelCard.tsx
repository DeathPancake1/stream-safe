import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import usePhotoPath from '../../api/hooks/photo-path-hook';
import useUserInfo from '../../api/hooks/user-info';

export default function ChannelCard({ title, imageId, description, ownerId }) {
  const imageUrl = usePhotoPath(imageId);
  const userInfo = useUserInfo(ownerId);

  return (
    <Card sx={{ maxWidth: 345, minWidth: 250 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={imageUrl}
        title={title}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Owner: <i>{userInfo?.firstname}</i>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">See More</Button>
      </CardActions>
    </Card>
  );
}
