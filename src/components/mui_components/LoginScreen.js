import React, {useState} from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import APIUtils from '../../api/APIUtils.js';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import TimelapseIcon from '@mui/icons-material/Timelapse';

const EndAdornment = ({showRetry, remainingTime, handleResendClick}) => {
    if(showRetry){
        return (
        <Button position="end" sx={{height: "100%"}} onClick={handleResendClick}>
            <Typography>Resend</Typography>
        </Button>
        )
    }else{
        return (
            <InputAdornment position="end">
                <Typography sx={{marginRight: 1}}>{remainingTime}s</Typography>
                <TimelapseIcon/>
            </InputAdornment>
        );
    }
}

export default function (props) {

    const WAITING_TIME = 10000;
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
    const [emailCodeHelperText, setEmailCodeHelperText] = useState("Your email appears to be unverified. Please enter the 6 digit code we sent to your email to continue.");
    const [emailTimestamp, setEmailTimestamp] = useState(0);
    const [remainingTime, setRemainingTime] = useState(Math.ceil(WAITING_TIME/1000));

    const handleLogin = async () => {
       setLoading(true);

        if(email.length===0 || password.length===0 || (locked && pin.length < 6) || (emailUnverified && emailCode.length < 6)){
            setShowError(true);
            setLoading(false);
            return;
        }

        const response = locked ? 
                        await APIUtils.loginLockedUser(email, password, pin) :
                        emailUnverified ?
                        await APIUtils.loginLockedUser(email, password, emailCode) :
                        await APIUtils.loginUser(email, password);
        if(response.success){
            props.handleLoginSuccess();
        }else{
            if(response.message==="Account Locked"){
                setLocked(true);
                setEmailUnverified(false);
            }
            else if(response.message === "Email Unverified"){
                setEmailUnverified(true);
                setLocked(false);
                setTimeout(()=>setShowRetry(true), WAITING_TIME);
            }
            else if(response.message === "Incorrect email code") 
                setEmailCodeHelperText("Incorrect code");
            else if(response.message === "Email already sent"){
                setEmailUnverified(true);
                setEmailCodeHelperText("Email already sent.");
                setShowRetry(false);
                const rmTime = WAITING_TIME - (Date.now() - response.emailTimestamp);
                setRemainingTime(Math.ceil(rmTime/1000));
                setTimeout(()=>setShowRetry(true), rmTime);
            }
            setShowError(true);
            setLoading(false);
        }
    }

    const handleResendClick = async () => {
        const response = await APIUtils.resendEmail(email);
        if(response.success){
            setShowRetry(false);
            setRemainingTime(Math.ceil(WAITING_TIME/1000));
            setTimeout(()=>setShowRetry(true), WAITING_TIME);
            setEmailCodeHelperText("Email sent again.");
        }
    }

    return (
        <Box sx={{marginTop: 10}}>
            <Typography sx={{textAlign: 'center', fontSize: "25px", fontWeight: "bold"}}>
                Hello Again !
            </Typography>
            <Typography sx={{textAlign: 'center'}}>
                Welcome back, you've been missed
            </Typography>
            <TextField
                name="email"
                type="email"
                error={showError}
                value={email}
                fullWidth={true}
                variant="outlined"
                placeholder="Enter email"
                onChange={(e)=>setEmail(e.target.value)}
                sx = {{ marginTop: 5, height: 70 }}
            />
            <TextField
                name="password"
                type={showPassword ? "text":"password"}
                value={password}
                error={showError}
                fullWidth={true}
                variant="outlined"
                placeholder="Enter password"
                onChange={(e)=>setPassword(e.target.value)}
                sx = {{ marginTop: 2, height: 60 }}
                InputProps={{
                    endAdornment: (
                      <InputAdornment position="end" onClick={()=>setShowPassword(!showPassword)}>
                        {!showPassword ? <VisibilityIcon/> : <VisibilityOffIcon />}
                      </InputAdornment>
                    ),
                  }}
            />
            {locked && 
            <TextField
                name="pin"
                type={showPin ? "number":"password"}
                value={pin}
                error={showError}
                helperText="Uh-oh, it seems your account is locked. Please enter your PIN to continue"
                fullWidth={true}
                onPaste={(e)=>e.preventDefault()}
                variant="outlined"
                placeholder="6 Digit PIN"
                onChange={(e)=>{
                        if(
                            (!isNaN(e.target.value)) &&
                            ((e.nativeEvent.inputType.includes("insert") && pin.length<6) ||
                            (e.nativeEvent.inputType.includes("delete") && pin.length>0))
                        )
                            setPin(e.target.value);
                    }
                }
                sx = {{ marginTop: 2 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" onClick={()=>setShowPin(!showPin)}>
                        {!showPin ? <VisibilityIcon/> : <VisibilityOffIcon />}
                        </InputAdornment>
                    ),
                }}
            />}
            {emailUnverified &&
            <TextField
            name="emailCode"
            type="number"
            value={emailCode}
            error={showError}
            fullWidth={true}
            onPaste={(e)=>e.preventDefault()}
            variant="outlined"
            helperText={emailCodeHelperText}
            placeholder="6 Digit Verification Code"
            onChange={(e)=>{
                    if(
                        (!isNaN(e.target.value)) &&
                        ((e.nativeEvent.inputType.includes("insert") && emailCode.length<6) ||
                        (e.nativeEvent.inputType.includes("delete") && emailCode.length>0))
                    )
                        setEmailCode(e.target.value);
                    }
                }
                sx = {{ marginTop: 2 }}
                InputProps={{
                    endAdornment: <EndAdornment showRetry={showRetry} remainingTime={remainingTime} handleResendClick={handleResendClick}/>
                }}
            />
            }
            <LoadingButton 
                loading={loading}
                variant="contained"
                sx={{
                    marginTop: 5,
                    padding: "15px 0",
                    width:"100%"
                }}
                onClick={handleLogin}
            >
                Sign In
            </LoadingButton >
            <Typography sx={{margin:"70% 0 0 15%"}}>
                Don't have an account ?
                <Link sx={{fontWeight: "bold"}} onClick={props.handleSignUpClick}> Sign Up</Link>
            </Typography>
        </Box>
    )
}
