import React from "react";
import AddCardIcon from "@mui/icons-material/AddCard";

export default function GetStarted() {
    return (
        <div style={{ marginTop: "50%" }}>
            <h2 style={{ marginBottom: 20 }}> Welcome </h2>
            <div style={{ display: "flex", alignItems: "center" }}>
                <p>Tap</p>
                <AddCardIcon
                    fontSize="large"
                    sx={{ marginLeft: 2, marginRight: 2 }}
                />
                <p>to get started.</p>
            </div>
        </div>
    );
}
