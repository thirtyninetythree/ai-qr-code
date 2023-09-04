import { useState, useEffect } from 'react'
import { Box, Button, ImageList, ImageListItem, ImageListItemBar, Typography } from '@mui/material';
import axios from 'axios';

import { SearchBar, QRImageList } from '../components';

export default function Prompts({handleNotifications}) {
    const [prompts, setPrompts] = useState([])
    useEffect(() => {
        // Define an async function to fetch and cache the data
        const fetchData = async () => {
            const expirationTime = 24 * 60 * 60 * 1000;
            try {
                // Check if data is stored in the cache
                const cachedData = localStorage.getItem("prompts");

                if (cachedData) {
                    // Parse the cached data as an object
                    const parsedData = JSON.parse(cachedData);

                    // Check if the cached data is expired by comparing its timestamp with the current date
                    const currentDate = new Date();
                    const expirationDate = new Date(parsedData.timestamp + expirationTime);

                    if (currentDate < expirationDate) {
                        // console.log("Cache hit!");
                        // If data is not expired, use it
                        setPrompts(parsedData.data);
                    } else {
                        // console.log("Cache expired! Fetching new data");
                        // If data is expired, fetch new data from the server
                        const response = await axios.get("/get_prompts");
                        setPrompts(response.data);

                        // Store the new data in the cache with a new timestamp
                        localStorage.setItem(
                            "prompts",
                            JSON.stringify({ data: response.data, timestamp: Date.now() })
                        );
                    }
                } else {
                    // console.log("Cache miss! Fetching from server");
                    // If data is not found in the cache, fetch it from the server
                    const response = await axios.get(url);
                    setPrompts(response.data);

                    // Store the fetched data in the cache with a timestamp
                    localStorage.setItem(
                        "prompts",
                        JSON.stringify({ data: response.data, timestamp: Date.now() })
                    );
                }
            } catch (error) {
                // Handle any errors
                // console.error(error);
                handleNotifications("Error loading prompts. Please try again later", "error")
            }
        };
        fetchData();
    }, []); 


    const handleSubmit = (event, keyword) => {
        event.preventDefault();

        let formData = new FormData()
        formData.append('keyword', keyword)

        axios
            .post('/search_keywords', formData).then((response) => {
                console.log(response)
                setPrompts(response.data)
            })
            .catch((err) => {
                console.log("ERROR OCCURRED")
            })
    }

    return (
        <>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                // justifyContent="center"
                height="70vh"
                padding={4}
            >
                <Typography variant="h2" align="center" gutterBottom>
                    QRCode Prompts to Elevate your Marketing
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" gutterBottom>
                    Discover the Best QR code prompts, Instantly Accessible with a Simple Scan
                </Typography>
                <Box width="80%" marginTop={8}>
                    <SearchBar handleSubmit={handleSubmit} />
                </Box>
            </Box>

            <div style={{ display: "flex", justifyContent: "center" }}>
                <ImageList variant="masonry" cols={3} gap={12} sx={{ width: "80%" }}>
                    {prompts.map((prompt) => (
                        <ImageListItem key={prompt.public_url} sx={{ margin: 1, whiteSpace: 'wrap', overflow: 'hidden', }}>
                            <img src={prompt.public_url} alt={prompt.prompt} width="300" height="300" loading="lazy" style={{ objectFit: "contain" }} />
                            <Typography variant='subtitle1' fontWeight={300} >{prompt.prompt}</Typography>
                            {/* <Button onClick={() => navigator.clipboard.writeText(prompt.prompt)}>Copy</Button> */}
                        </ImageListItem>
                    ))}
                </ImageList>
            </div>
            {/* <QRImageList prompts={prompts}/> */}
        </>
    );
}
