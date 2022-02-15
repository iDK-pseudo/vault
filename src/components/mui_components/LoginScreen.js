import React, {useState} from 'react'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import APIUtils from '../../api/APIUtils.js';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';

export default function (props) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
       setLoading(true);
       const response = await APIUtils.loginUser(email, password);
        if(response.success){
            props.handleLoginSuccess();
        }else{
            setShowError(true);
        }
        setLoading(false);
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
