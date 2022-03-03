import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import APIUtils from "../../api/APIUtils.js";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import TimelapseIcon from "@mui/icons-material/Timelapse";
import GoogleIcon from "@mui/icons-material/Google";

const EndAdornment = ({ showRetry, remainingTime, handleResendClick }) => {
    if (showRetry) {
        return (
            <Button
                position="end"
                sx={{ height: "100%" }}
                onClick={handleResendClick}
            >
                <Typography>Resend</Typography>
            </Button>
        );
    } else {
        return (
            <InputAdornment position="end">
                <Typography sx={{ marginRight: 1 }}>{remainingTime}</Typography>
                <TimelapseIcon />
            </InputAdornment>
        );
    }
};

export default function (props) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [pin, setPin] = useState("");
    const [emailCode, setEmailCode] = useState("");
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPin, setShowPin] = useState(false);
    const [showRetry, setShowRetry] = useState(false);
    const [locked, setLocked] = useState(false);
    const [emailUnverified, setEmailUnverified] = useState(false);
    const [emailCodeHelperText, setEmailCodeHelperText] = useState(
        "Your email appears to be unverified. Please enter the 6 digit code we sent to your email to continue."
    );
    const [emailTimestamp, setEmailTimestamp] = useState(0);
    const [remainingTime, setRemainingTime] = useState(0);

    const handleLogin = async () => {
        setLoading(true);

        if (
            email.length === 0 ||
            password.length === 0 ||
            (locked && pin.length < 6) ||
            (emailUnverified && emailCode.length < 6)
        ) {
            setShowError(true);
            setLoading(false);
            return;
        }

        const response = locked
            ? await APIUtils.loginLockedUser(email, password, pin)
            : emailUnverified
            ? await APIUtils.loginLockedUser(email, password, emailCode)
            : await APIUtils.loginUser(email, password);
        if (response.success) {
            props.handleLoginSuccess(locked);
        } else {
            if (response.message === "Account Locked") {
                setLocked(true);
                setEmailUnverified(false);
            } else if (response.message === "Email Unverified") {
                setEmailUnverified(true);
                setLocked(false);
                setRemainingTime(Math.ceil(response.duration / 60000) + "m");
                setTimeout(() => setShowRetry(true), response.duration);
            } else if (response.message === "Incorrect email code")
                setEmailCodeHelperText("Incorrect code");
            else if (response.message === "Email already sent") {
                setEmailUnverified(true);
                setShowRetry(false);
                if (response.retries >= 2) {
                    setEmailCodeHelperText(
                        "Email resend limit reached. Please wait 24 hours to try again or enter the last code you received."
                    );
                    setRemainingTime("24h");
                } else {
                    const rmTime =
                        response.duration -
                        (Date.now() - response.emailTimestamp);
                    setRemainingTime(Math.ceil(rmTime / 60000) + "m");
                    setTimeout(() => setShowRetry(true), rmTime);
                }
            }
            setShowError(true);
            setLoading(false);
        }
    };

    const handleResendClick = async () => {
        const response = await APIUtils.resendEmail(email);
        if (response.success) {
            setShowRetry(false);
            setRemainingTime(Math.ceil(response.duration / 60000) + "m");
            setTimeout(() => setShowRetry(true), response.duration);
            setEmailCodeHelperText("Email sent again.");
        } else if (response.msg === "Resend Limit reached") {
            setShowRetry(false);
            setRemainingTime("24h");
            setEmailCodeHelperText(
                "Email resend limit reached. Please wait 24 hours to try again."
            );
        }
    };

    return (
        <Box sx={{ marginTop: 10 }}>
            <Typography
                sx={{
                    textAlign: "center",
                    fontSize: "25px",
                    fontWeight: "bold",
                }}
            >
                Log in
            </Typography>
            <Typography sx={{ textAlign: "center" }}>
                Enter your credentials to continue
            </Typography>
            <TextField
                name="email"
                type="email"
                error={showError}
                value={email}
                fullWidth={true}
                variant="outlined"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                sx={{ marginTop: 5, height: 70 }}
            />
            <TextField
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                error={showError}
                fullWidth={true}
                variant="outlined"
                placeholder="Enter password"
                onChange={(e) => setPassword(e.target.value)}
                sx={{ marginTop: 2, height: 60 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment
                            position="end"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {!showPassword ? (
                                <VisibilityIcon />
                            ) : (
                                <VisibilityOffIcon />
                            )}
                        </InputAdornment>
                    ),
                }}
            />
            {locked && (
                <TextField
                    name="pin"
                    type={showPin ? "number" : "password"}
                    value={pin}
                    error={showError}
                    helperText="Uh-oh, it seems your account is locked. Please enter your PIN to continue"
                    fullWidth={true}
                    onPaste={(e) => e.preventDefault()}
                    variant="outlined"
                    placeholder="6 Digit PIN"
                    onChange={(e) => {
                        if (
                            !isNaN(e.target.value) &&
                            ((e.nativeEvent.inputType.includes("insert") &&
                                pin.length < 6) ||
                                (e.nativeEvent.inputType.includes("delete") &&
                                    pin.length > 0))
                        )
                            setPin(e.target.value);
                    }}
                    sx={{ marginTop: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment
                                position="end"
                                onClick={() => setShowPin(!showPin)}
                            >
                                {!showPin ? (
                                    <VisibilityIcon />
                                ) : (
                                    <VisibilityOffIcon />
                                )}
                            </InputAdornment>
                        ),
                    }}
                />
            )}
            {emailUnverified && (
                <TextField
                    name="emailCode"
                    type="number"
                    value={emailCode}
                    error={showError}
                    fullWidth={true}
                    onPaste={(e) => e.preventDefault()}
                    variant="outlined"
                    helperText={emailCodeHelperText}
                    placeholder="6 Digit Verification Code"
                    onChange={(e) => {
                        if (
                            !isNaN(e.target.value) &&
                            ((e.nativeEvent.inputType.includes("insert") &&
                                emailCode.length < 6) ||
                                (e.nativeEvent.inputType.includes("delete") &&
                                    emailCode.length > 0))
                        )
                            setEmailCode(e.target.value);
                    }}
                    sx={{ marginTop: 2 }}
                    InputProps={{
                        endAdornment: (
                            <EndAdornment
                                showRetry={showRetry}
                                remainingTime={remainingTime}
                                handleResendClick={handleResendClick}
                            />
                        ),
                    }}
                />
            )}
            <LoadingButton
                loading={loading}
                sx={{
                    "&.MuiButton-root:hover": {
                        background: "#1865F2",
                    },
                    marginTop: 5,
                    padding: "15px 0",
                    width: "100%",
                    background: "#1865F2",
                    color: "white",
                }}
                onClick={handleLogin}
            >
                Sign In
            </LoadingButton>
            <Typography sx={{ textAlign: "center", marginTop: 2 }}>
                or
            </Typography>
            <div style={{ textAlign: "center" }}>
                <Button
                    sx={{
                        margin: "auto",
                        marginTop: 2,
                        width: "100%",
                        height: "6vh",
                        border: "1px solid #1865F2",
                        fontWeight: "bold",
                        boxShadow: "0 6px 5px rgba(0, 0, 0, 0.2)",
                        color: "#1865F2",
                    }}
                    startIcon={<GoogleIcon style={{ marginRight: 10 }} />}
                    href="http://localhost:3000/auth/google"
                >
                    <p style={{ fontSize: 15 }}>Sign in with Google</p>
                </Button>
            </div>
            <Typography sx={{ margin: "50% 0 0 15%" }}>
                Don't have an account ?
                <Link
                    sx={{
                        fontWeight: "bold",
                        color: "#1865F2",
                        textDecoration: "none",
                        fontSize: 18,
                    }}
                    onClick={props.handleSignUpClick}
                >
                    {" "}
                    Sign Up
                </Link>
            </Typography>
        </Box>
    );
}
