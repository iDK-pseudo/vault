import { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";

function Header(props) {
    const [logout, setLogout] = useState(false);

    useEffect(() => {
        if (
            props.display === "homepage" ||
            props.display === "getStarted" ||
            props.display === "setupPin"
        )
            setLogout(true);
        else setLogout(false);
    }, [props.display]);

    return (
        <header>
            <h1> Vault </h1>
            {logout && (
                <IconButton onClick={props.handleLogout}>
                    <LogoutIcon
                        fontSize="large"
                        sx={{ position: "absolute", right: "0" }}
                    />
                </IconButton>
            )}
        </header>
    );
}

export default Header;
