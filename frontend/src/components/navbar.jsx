import * as React from "react";
import { AppBar, Toolbar, Typography, Button, Stack } from "@mui/material";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static" elevation={0} color="transparent">
      <Toolbar>
        <NavLink to="/" style={{ textDecoration: "none", flexGrow: 1 }}>
          <Typography variant="h6" noWrap sx={{ fontWeight: 800, letterSpacing: ".3rem", color: "black" }} fontFamily={"Libre Barcode 39"}>
            AIQRCODE
          </Typography>
        </NavLink>
        <Stack direction="row" spacing={2}>
          <NavLink to="/" style={{ textDecoration: "none", color: "black"}} >
            <Button color="inherit">HOME</Button>
          </NavLink>
          <NavLink to="/generate" style={{ textDecoration: "none", color: "black"}} >
            <Button color="inherit">GENERATE</Button>
          </NavLink>
          <NavLink to="/prompts" style={{ textDecoration: "none", color: "black" }}>
            <Button color="inherit">PROMPTS</Button>
          </NavLink>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
