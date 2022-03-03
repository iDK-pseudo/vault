import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import BackgroundImage from "../../static/card_bg.jpg";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";

export default function CreditCard({ card, handlePinEntry, locked }) {
    const [cardNumParts, setCardNumParts] = useState([]);
    const [cvv, setCVV] = useState("***");
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
            <CardHeader
                subheader="Alex Ferguson"
                subheaderTypographyProps={{
                    sx: {
                        fontWeight: "bold",
                    },
                }}
            />
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "rgba(0, 0, 0, 0.6)",
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
                                color: "rgba(0, 0, 0, 0.6)",
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
                                color: "rgba(0, 0, 0, 0.6)",
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
                                color: "rgba(0, 0, 0, 0.6)",
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
                                color: "rgba(0, 0, 0, 0.6)",
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
