import React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import AddCardIcon from "@mui/icons-material/AddCard";

export default function BottomNav(props) {
    const [value, setValue] = React.useState(0);

    return (
        <BottomNavigation
            showLabels
            value={value}
            sx={{
                position: "absolute",
                bottom: 0,
                width: "90%",
            }}
        >
            <BottomNavigationAction
                label="Home"
                icon={<HomeIcon fontSize="large" />}
            />
            <BottomNavigationAction
                label="Add"
                icon={<AddCardIcon fontSize="large" />}
                onClick={props.handleAddCard}
            />
        </BottomNavigation>
    );
}
