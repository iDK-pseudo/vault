import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import BackgroundImage from "../../static/card_bg.jpg";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import { ReactComponent as Visa } from "../../static/visa.svg";
import { ReactComponent as Rupay } from "../../static/rupay.svg";
import { ReactComponent as MasterCard } from "../../static/mastercard.svg";
import { ReactComponent as AmericanExpress } from "../../static/american_express.svg";

export default function CreditCard({ card, handlePinEntry, locked }) {
    const [cardNumParts, setCardNumParts] = useState([]);
    const [cvv, setCVV] = useState("***");
    const [logo, setLogo] = useState("");
    const [pinIcon, setPinIcon] = useState(0);

    useEffect(() => {
        let parts = [],
            cardNumString = card.cardnum
                ? card.cardnum.toString()
                : card.cardnumLast4.toString();

        if (card.cardnum !== null) {
            parts.push(<div key={1}>{cardNumString.substring(0, 4)}</div>);
            parts.push(<div key={2}>{cardNumString.substring(4, 8)}</div>);
            parts.push(<div key={3}>{cardNumString.substring(8, 12)}</div>);
            parts.push(<div key={4}>{cardNumString.substring(12, 16)}</div>);
        } else {
            parts.push(<div key={1}>****</div>);
            parts.push(<div key={2}>****</div>);
            parts.push(<div key={3}>****</div>);
            parts.push(<div key={4}>{cardNumString}</div>);
        }

        setCardNumParts(parts);

        if (card.cvv !== null) {
            setCVV(card.cvv);
        }

        if (card.cardType === "Mastercard") {
            setLogo(
                <MasterCard
                    style={{ height: "50px", marginRight: 2, float: "right" }}
                />
            );
        } else if (card.cardType === "Visa") {
            setLogo(
                <Visa
                    style={{ height: "50px", marginRight: 2, float: "right" }}
                />
            );
        } else if (card.cardType === "American Express") {
            setLogo(
                <AmericanExpress
                    style={{ height: "50px", marginRight: 5, float: "right" }}
                />
            );
        } else if (card.cardType === "Discover") {
            setLogo(<Rupay style={{ height: "50px", float: "right" }} />);
        } else {
            setLogo(<CreditCardIcon sx={{ fontSize: "45px" }} />);
        }
    }, [card]);

    useEffect(() => {
        if (locked) {
            setPinIcon(
                <IconButton
                    sx={{ float: "right", padding: 0 }}
                    onClick={handlePinEntry}
                >
                    <VisibilityOffIcon fontSize="large" />
                </IconButton>
            );
        } else {
            setPinIcon(
                <IconButton sx={{ float: "right", padding: 0 }}>
                    <VisibilityIcon fontSize="large" />
                </IconButton>
            );
        }
    }, [locked]);

    return (
        <Card
            raised
            sx={{
                minHeight: 200,
                margin: "20px 0",
                borderRadius: 2,
                backgroundImage: `url(${BackgroundImage})`,
                backgroundSize: "cover",
            }}
        >
            {logo}
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        marginTop: 8,
                        color: "white",
                        fontFamily: "SourceSansPro",
                        fontWeight: "bold",
                        fontSize: 32,
                        justifyContent: "space-between",
                    }}
                >
                    {cardNumParts}
                </Box>
                <Grid container sx={{ marginTop: 5 }}>
                    <Grid item xs={4}>
                        <Typography
                            variant="h4"
                            component="div"
                            sx={{
                                fontSize: 12,
                                color: "white",
                                fontWeight: "bold",
                                fontFamily: "SourceSansPro",
                            }}
                        >
                            EXP
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            variant="h4"
                            component="div"
                            sx={{
                                fontSize: 12,
                                color: "white",
                                fontWeight: "bold",
                                fontFamily: "SourceSansPro",
                            }}
                        >
                            CVV
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={4}>
                        <Typography
                            sx={{
                                color: "white",
                                fontWeight: "bold",
                                fontSize: 18,
                                fontFamily: "SourceSansPro",
                            }}
                        >
                            {`${card.month}/${card.year}`}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography
                            sx={{
                                color: "white",
                                fontWeight: "bold",
                                fontSize: 18,
                                fontFamily: "SourceSansPro",
                            }}
                        >
                            {cvv}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        {pinIcon}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
