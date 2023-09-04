import * as React from 'react';
import { Box, Grid, Typography, Divider, Link } from "@mui/material";

function Footer() {
    return (
        <Box
            sx={{
                width: "100%",
                height: 40,
                backgroundColor: "white",
                margin: "auto",
                position: "static",
                bottom: 0,
            }}
        >
                <Grid container direction="row" alignItems="center" spacing={2}>
                    <Grid item container
                        direction="row"
                        justifyContent="center">
                        <Divider sx={{ width: "35%", margin: .5 }} variant="middle" />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography fontFamily={"Raleway"} variant="body2" color="textSecondary" align="center">
                            {'Copyright © '}
                            <Link color="inherit" href="#">
                                AI QR CODE
                            </Link>{' '}
                            {new Date().getFullYear()}
                            {'.'}
                        </Typography>
                    </Grid>
                </Grid>
        </Box>
    );
}

export default Footer