import React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";
import AddCardIcon from "@mui/icons-material/AddCard";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";

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
                left: "10%",
                width: "80%",
                background: "#ECEDF3",
                borderRadius: 4,
            }}
        >
            <BottomNavigationAction
                sx={{
                    "&.MuiBottomNavigationAction-root *": {
                        color: "#3D4A5C",
                    },
                    borderRadius: 4,
                }}
                icon={
                    <HomeIcon
                        fontSize="large"
                        style={{
                            borderBottom:
                                selected === "home" ? "4px solid black" : "",
                        }}
                    />
                }
                onClick={(e) => {
                    setSelected("home");
                }}
            />
            <BottomNavigationAction onClick={props.handleAddCard} />
            <Button
                onClick={props.handleAddCard}
                sx={{
                    position: "absolute",
                    bottom: 10,
                    height: 60,
                    background: "#F2A313",
                    borderRadius: 10,
                }}
            >
                <AddIcon fontSize="large" style={{ color: "white" }} />
            </Button>
            <BottomNavigationAction
                sx={{
                    "&.MuiBottomNavigationAction-root *": {
                        color: "#3D4A5C",
                    },
                    borderRadius: 4,
                }}
                icon={
                    <SettingsIcon
                        fontSize="large"
                        style={{
                            borderBottom:
                                selected === "settings"
                                    ? "4px solid black"
                                    : "",
                        }}
                    />
                }
                onClick={(e) => {
                    setSelected("settings");
                }}
            />
        </BottomNavigation>
    );
}
