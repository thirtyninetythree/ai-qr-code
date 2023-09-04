import React, { useState } from 'react';
import { Box, Button, FormControl, Grid, TextField } from '@mui/material';

const SearchBar = ({ onSearch, handleSubmit }) => {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
        // height="80vh" // Adjust the height to your preference
        >
            <FormControl
                sx={{
                    width: "80%", // Adjust the width to your preference
                    minWidth: 300, // Set a minimum width for the form
                }}
            >
                <TextField
                    disabled
                    id="search"
                    label="Search prompt"
                    onChange={(e) => setSearchQuery(e.target.value)}
                // helperText="The content of the QR Code"
                />
                <Box display="flex" justifyContent="center" marginTop={2}>
                    <Button
                        disabled
                        variant="contained"
                        color="primary"
                        onClick={(event) => handleSubmit(event, searchQuery)}
                        sx={{ backgroundColor: "black" }}
                    >
                        Search
                    </Button>
                </Box>
            </FormControl>
        </Box>
    );
};

export default SearchBar;
