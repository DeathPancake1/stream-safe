import React, { useState } from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

interface Props{
  search : ({email} : {email: string}) => any
}

export default function SearchBox({
  search,
}: Props) {
  const [searchQuery, setSearchQuery] = useState('');  

  const timerRef = React.useRef<number>();

  // Function to handle search
  const handleSearch = (query) => {
    search({ email: query });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = window.setTimeout(() => {
        handleSearch(event.target.value)
    }, 300); // debounce timeout
  };


  return (
    <TextField
      variant="outlined"
      label="Search"
      value={searchQuery}
      sx={{
        margin: 'auto',
        marginTop: 1,
        marginLeft: 1,
        width: '95%',
      }}
      onChange={handleChange}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
}
