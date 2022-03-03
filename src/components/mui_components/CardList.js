import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { ReactComponent as Visa } from "../../static/visa.svg";
import { ReactComponent as Rupay } from "../../static/rupay.svg";
import { ReactComponent as MasterCard } from "../../static/mastercard.svg";
import { ReactComponent as AmericanExpress } from "../../static/american_express.svg";

export default function CardList(props) {
    const [cardList, setCardList] = useState([]);
    useEffect(() => {
        props.cardList.forEach((each) => {
            if (each.cardType === "Mastercard") {
                each.cardTypeElement = <MasterCard />;
            } else if (each.cardType === "Visa") {
                each.cardTypeElement = <Visa />;
            } else if (each.cardType === "American Express") {
                each.cardTypeElement = <AmericanExpress />;
            } else if (each.cardType === "Discover") {
                each.cardTypeElement = <Rupay />;
            } else {
                each.cardTypeElement = (
                    <CreditCardIcon sx={{ fontSize: "45px" }} />
                );
            }
        });
        setCardList(props.cardList);
    }, [props.cardList]);

    return (
        <List>
            {cardList.map((each) => (
                <ListItem
                    disablePadding
                    key={each._id}
                    data-id={each._id}
                    sx={{
                        color:
                            props.selectedCard._id === each._id
                                ? "white"
                                : "black",
                        backgroundColor:
                            props.selectedCard._id === each._id
                                ? "#98a7bb"
                                : "#ECEDF3",
                        borderRadius: 2,
                        marginBottom: 1,
                        height: 60,
                    }}
                    onClick={props.handleCardListItemClick}
                >
                    <ListItemButton>
                        <ListItemIcon sx={{ marginRight: "20px" }}>
                            {each.cardTypeElement}
                        </ListItemIcon>
                        <ListItemText
                            primary={
                                each.cardnum
                                    ? each.cardnum.toString().slice(-4)
                                    : each.cardnumLast4.toString()
                            }
                            primaryTypographyProps={{
                                fontSize: "20px",
                                fontFamily: "Calibri",
                                fontWeight: "bold",
                            }}
                        />
                        <ListItemText
                            primary={`${each.month}/${each.year}`}
                            primaryTypographyProps={{
                                fontSize: "15px",
                                fontFamily: "Calibri",
                                textAlign: "right",
                                fontWeight: "bold",
                            }}
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    );
}
