import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

const StyledCard = styled(Card)({
  maxWidth: 345,
});

export default function RecipeReviewCard({ title, subheader, image, description }) {
  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="190"
        image={image}
        alt="Paella dish"
      />
      <CardHeader
        avatar={
          <Avatar></Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={
          <Typography variant="h6" component="div">
            <b>{title}</b>
          </Typography>
        }
        subheader={subheader}
      />
      <CardContent>
        <Typography color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </StyledCard>
  );
}
