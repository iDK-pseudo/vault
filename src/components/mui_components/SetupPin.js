import { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";
import BackspaceIcon from "@mui/icons-material/Backspace";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import APIUtils from "../../api/APIUtils";
import CheckBoxRoundedIcon from "@mui/icons-material/CheckBoxRounded";
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";

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
            if (pin.length < 6) {
                setPin(pin + value);
                setError(false);
            }
        }
    };

    const StyledButton = (props) => {
        return (
            <Button
                variant="contained"
                sx={{
                    "&.MuiButton-root:hover": {
                        background: "#98a7bb",
                    },
                    fontSize: 20,
                    height: 55,
                    borderRadius: 4,
                    boxShadow: "0 5px 5px rgb(0, 0, 0, 0.5)",
                    background: props.id == "submit" ? "#049f00" : "#98a7bb",
                }}
                id={props.id}
                onClick={props.id == "submit" ? handlePinEntry : handleEntry}
            >
                {props.num}
            </Button>
        );
    };

    return (
        <div style={{ marginTop: 50 }}>
            <h2 style={{ fontWeight: "bold", fontFamily: "SourceSansPro" }}>
                Setup 2FA
            </h2>
            <ul
                style={{
                    marginTop: 30,
                    fontFamily: "SourceSansPro",
                    fontSize: 18,
                }}
            >
                <li style={{ marginBottom: 10 }}>
                    Choose a strong 6 digit code for two factor authentication.{" "}
                </li>
                <li style={{ marginBottom: 10 }}>
                    Make it as random/strong as possible.
                </li>
                <li style={{ marginBottom: 10 }}>
                    This will be used to verify your identity after password is
                    verified for better security.
                </li>
            </ul>
            <TextField
                disabled
                type="text"
                value={pin}
                error={error}
                variant="standard"
                sx={{
                    marginTop: 15,
                    marginBottom: 2,
                }}
                inputProps={{
                    sx: {
                        fontSize: 35,
                        letterSpacing: 15,
                        textAlign: "center",
                    },
                }}
            />
            <Grid container rowSpacing={3} sx={{ marginLeft: 6, width: "80%" }}>
                <Grid item xs={4}>
                    <StyledButton num="1" />
                </Grid>
                <Grid item xs={4}>
                    <StyledButton num="2" />
                </Grid>
                <Grid item xs={4}>
                    <StyledButton num="3" />
                </Grid>
                <Grid item xs={4}>
                    <StyledButton num="4" />
                </Grid>
                <Grid item xs={4}>
                    <StyledButton num="5" />
                </Grid>
                <Grid item xs={4}>
                    <StyledButton num="6" />
                </Grid>
                <Grid item xs={4}>
                    <StyledButton num="7" />
                </Grid>
                <Grid item xs={4}>
                    <StyledButton num="8" />
                </Grid>
                <Grid item xs={4}>
                    <StyledButton num="9" />
                </Grid>
                <Grid item xs={4}>
                    <StyledButton
                        id="backspace"
                        num={<BackspaceIcon fontSize="medium" />}
                    />
                </Grid>
                <Grid item xs={4}>
                    <StyledButton num="0" />
                </Grid>
                <Grid item xs={4}>
                    <StyledButton
                        id="submit"
                        onClick={handlePinEntry}
                        num={<CheckBoxRoundedIcon fontSize="medium" />}
                    />
                </Grid>
            </Grid>
        </div>
    );
}
