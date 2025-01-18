import BottomNavigation from "@mui/material/BottomNavigation";
import Box from "@mui/material/Box";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper/Paper";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import LinkIcon from "@mui/icons-material/Link";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import YouTubeIcon from "@mui/icons-material/YouTube";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { Fab } from "@mui/material";
import { FaCode } from "react-icons/fa6";

interface Props {
  mode: boolean;
  setMode: React.Dispatch<React.SetStateAction<boolean>>;
  type: number;
  setType: React.Dispatch<React.SetStateAction<number>>;
}

export default function FixedBottomNavigation({
  mode,
  setMode,
  type,
  setType,
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "space-between", // Distributes space between children
          alignItems: "center", // Centers items vertically
          px: 2, // Adds horizontal padding
        }}
        elevation={0}
      >
        <Fab
          variant="extended"
          color="primary"
          sx={{
            ml: 2,
            backgroundColor: "transparent",
            boxShadow: "none", // Remove shadow
            color: "inherit", // Inherit text color
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)", // Optional: Add slight hover effect
            },
          }}
          href="https://eshan-site.vercel.app/"
          target="_blank"
        >
          <FaCode /> Eshan
        </Fab>
        <BottomNavigation
          showLabels
          value={type}
          onChange={(event, newType) => {
            setType(newType);
          }}
          sx={{ flex: 1 }} // Makes it occupy available space
        >
          <BottomNavigationAction label="URL" icon={<LinkIcon />} />
          <BottomNavigationAction label="Text" icon={<TextFieldsIcon />} />
          <BottomNavigationAction label="Youtube" icon={<YouTubeIcon />} />
        </BottomNavigation>
        {mode ? (
          <Fab
            variant="extended"
            color="primary"
            onClick={() => setMode(!mode)}
            sx={{
              ml: 2,
              backgroundColor: "transparent",
              boxShadow: "none", // Remove shadow
              color: "inherit", // Inherit text color
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)", // Optional: Add slight hover effect
              },
            }}
          >
            <LightModeIcon sx={{ mr: 1 }} />
            Light Mode
          </Fab>
        ) : (
          <Fab
            variant="extended"
            color="primary"
            onClick={() => setMode(!mode)}
            sx={{
              ml: 2,
              backgroundColor: "transparent",
              boxShadow: "none", // Remove shadow
              color: "inherit", // Inherit text color
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)", // Optional: Add slight hover effect
              },
            }}
          >
            <DarkModeIcon sx={{ mr: 1 }} />
            Dark Mode
          </Fab>
        )}
      </Paper>
    </Box>
  );
}
