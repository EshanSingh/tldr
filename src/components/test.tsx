import BottomNavigation from "@mui/material/BottomNavigation";
import Box from "@mui/material/Box";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper/Paper";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArchiveIcon from "@mui/icons-material/Archive";
// import { IonActionSheet, IonButton } from "@ionic/react";

// function Example() {
//   return (
//     <>
//       <IonButton id="open-action-sheet">Open</IonButton>
//       <IonActionSheet
//         trigger="open-action-sheet"
//         header="Actions"
//         buttons={[
//           {
//             text: "Delete",
//             role: "destructive",
//             data: {
//               action: "delete",
//             },
//           },
//           {
//             text: "Share",
//             data: {
//               action: "share",
//             },
//           },
//           {
//             text: "Cancel",
//             role: "cancel",
//             data: {
//               action: "cancel",
//             },
//           },
//         ]}
//       ></IonActionSheet>
//     </>
//   );
// }
// export default Example;
// import * as React from "react";
// import Box from "@mui/material/Box";
// import BottomNavigation from "@mui/material/BottomNavigation";
// import BottomNavigationAction from "@mui/material/BottomNavigationAction";
// import RestoreIcon from "@mui/icons-material/Restore";
// import FavoriteIcon from "@mui/icons-material/Favorite";
// import LocationOnIcon from "@mui/icons-material/LocationOn";

// export default function SimpleBottomNavigation() {
//   const [value, setValue] = React.useState(0);

//   return (
//     <Box sx={{ width: 500 }}>
//       <BottomNavigation
//         showLabels
//         value={value}
//         onChange={(event, newValue) => {
//           setValue(newValue);
//         }}
//       >
//         <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
//         <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
//         <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
//       </BottomNavigation>
//     </Box>
//   );
// }

export default function FixedBottomNavigation() {
  const [value, setValue] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            console.log(newValue);
          }}
        >
          <BottomNavigationAction label="URL" icon={<RestoreIcon />} />
          <BottomNavigationAction label="Text" icon={<FavoriteIcon />} />
          <BottomNavigationAction label="Youtube" icon={<ArchiveIcon />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
