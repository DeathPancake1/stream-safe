import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useUser } from '../../providers/UserContext';
import usePhotoPath from '../../api/hooks/photo-path-hook';
import useUserInfo from '../../api/hooks/user-info';

const StyledCard = styled(Card)({
  maxWidth: 345,
});

export default function RecipeReviewCard({ title, subheader, imageId, description }) {
  const { userData } = useUser();
  const imageUrl = usePhotoPath(imageId); // Fetch photo path
  const userInfo = useUserInfo(subheader); // Fetch user information
  console.log(userInfo);
  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="170"
        image={imageUrl}
        alt="image"
      />
      <Typography variant="h5" color="text.secondary" sx={{ margin: '5% 0 0 5% ', fontWeight: 'bold', color: 'black' }}>
        {title}
      </Typography>
      <CardHeader
        avatar={
          <Avatar></Avatar>
        }
        title={
          userInfo &&
          <Typography >
            <b>{ userInfo.firstname }</b>
          </Typography>
        }
      />
      <CardContent>
        <Typography color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </StyledCard>
  );
}
