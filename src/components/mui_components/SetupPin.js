import { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import BackspaceIcon from "@mui/icons-material/Backspace";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import APIUtils from "../../api/APIUtils";

export default function SetupPin(props) {
    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);

    const handlePinEntry = async () => {
        if (pin.length < 6) {
            setError(true);
        }
        if (await APIUtils.insertPin(pin)) {
            props.handleLoginSuccess();
        }
    };

    const handleEntry = (e) => {
        if (e.currentTarget.id === "backspace") {
            if (pin.length > 0) {
                setPin(pin.substring(0, pin.length - 1));
            }
            return;
        }
        const value = e.target.innerText;
        if (!isNaN(value)) {
            if (pin.length !== 6) {
                setPin(pin + value);
                setError(false);
            }
        }
    };
    return (
        <div style={{ marginTop: 100 }}>
            <p
                style={{
                    textAlign: "center",
                    fontFamily: "SourceSansPro",
                    fontSize: 20,
                }}
            >
                Choose a strong 6 digit PIN for 2FA
            </p>
            <TextField
                disabled
                type="text"
                value={pin}
                error={error}
                variant="standard"
                sx={{
                    marginTop: 10,
                    marginBottom: 2,
                }}
                inputProps={{
                    sx: {
                        fontSize: 30,
                        letterSpacing: 15,
                        textAlign: "center",
                    },
                }}
            />
            <Grid
                container
                columnSpacing={1}
                rowSpacing={3}
                sx={{ marginLeft: 2 }}
            >
                <Grid item xs={4}>
                    <Button sx={{ fontSize: 30 }} onClick={handleEntry}>
                        1
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button sx={{ fontSize: 30 }} onClick={handleEntry}>
                        2
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button sx={{ fontSize: 30 }} onClick={handleEntry}>
                        3
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button sx={{ fontSize: 30 }} onClick={handleEntry}>
                        4
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button sx={{ fontSize: 30 }} onClick={handleEntry}>
                        5
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button sx={{ fontSize: 30 }} onClick={handleEntry}>
                        6
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button sx={{ fontSize: 30 }} onClick={handleEntry}>
                        7
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button sx={{ fontSize: 30 }} onClick={handleEntry}>
                        8
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <Button sx={{ fontSize: 30 }} onClick={handleEntry}>
                        9
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <IconButton id="backspace" onClick={handleEntry}>
                        <BackspaceIcon fontSize="large" color="primary" />
                    </IconButton>
                </Grid>
                <Grid item xs={4}>
                    <Button sx={{ fontSize: 30 }} onClick={handleEntry}>
                        0
                    </Button>
                </Grid>
                <Grid item xs={4}>
                    <IconButton id="check" onClick={handlePinEntry}>
                        <CheckIcon fontSize="large" color="primary" />
                    </IconButton>
                </Grid>
            </Grid>
        </div>
    );
}
