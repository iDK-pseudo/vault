import React from "react";
import AddCardIcon from "@mui/icons-material/AddCard";

export default function GetStarted() {
    return (
        <div style={{ marginTop: "10%", fontFamily: "SourceSansPro" }}>
            <h2 style={{ marginBottom: "10%" }}> Welcome User </h2>
            <ul
                style={{
                    fontSize: 18,
                    display: "flex",
                    flexDirection: "column",
                    gap: 15,
                }}
            >
                <li>
                    Your dashboard is empty since you don't have any card saved.
                </li>
                <li
                    style={{
                        display: "flex",
                    }}
                >
                    Tap the{" "}
                    <AddCardIcon
                        fontSize="small"
                        style={{ marginLeft: 5, marginRight: 5 }}
                    />{" "}
                    button below to add a new card.
                </li>
                <li> Once the card is added it will be shown here.</li>
            </ul>
        </div>
    );
}
