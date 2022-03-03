import React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HomeIcon from "@mui/icons-material/Home";
import AddCardIcon from "@mui/icons-material/AddCard";
import SettingsIcon from "@mui/icons-material/Settings";

export default function BottomNav(props) {
    const [value, setValue] = React.useState(0);
    const [selected, setSelected] = React.useState("home");

    return (
        <BottomNavigation
            showLabels
            value={value}
            sx={{
                position: "absolute",
                bottom: 0,
                width: "90%",
                background: "#ECEDF3",
                borderRadius: 4,
            }}
        >
            <BottomNavigationAction
                sx={{
                    "&.MuiBottomNavigationAction-root *": {
                        color: selected === "home" ? "white" : "#3D4A5C",
                    },
                    backgroundColor: selected === "home" ? "#98a7bb" : "",
                    borderRadius: 4,
                }}
                label="Home"
                icon={<HomeIcon fontSize="medium" />}
                onClick={(e) => {
                    setSelected("home");
                }}
            />
            <BottomNavigationAction
                sx={{
                    "&.MuiBottomNavigationAction-root *": {
                        color: selected === "add" ? "white" : "#3D4A5C",
                    },
                    backgroundColor: selected === "add" ? "#98a7bb" : "",
                    borderRadius: 4,
                }}
                label="Add"
                icon={<AddCardIcon fontSize="medium" />}
                onClick={(e) => {
                    setSelected("add");
                    props.handleAddCard(e);
                }}
            />
            <BottomNavigationAction
                sx={{
                    "&.MuiBottomNavigationAction-root *": {
                        color: selected === "settings" ? "white" : "#3D4A5C",
                    },
                    backgroundColor: selected === "settings" ? "#98a7bb" : "",
                    borderRadius: 4,
                }}
                label="Settings"
                icon={<SettingsIcon fontSize="medium" />}
                onClick={(e) => {
                    setSelected("settings");
                }}
            />
        </BottomNavigation>
    );
}
