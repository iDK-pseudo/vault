import React, {useState, useReducer} from 'react'
import { makeStyles } from '@mui/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import APIUtils from '../../api/APIUtils.js';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import LinearProgress from '@mui/material/LinearProgress';
import { passwordStrength } from 'check-password-strength'
import FormHelperText from '@mui/material/FormHelperText';


const initialState = {
    email: {value: "",helperText: "", error: false},
    password: {value: "", strength: -1, helperText: "Must contain atleast 8 characters, with upper and lowercase and a number and symbol", error: false},
    confirmPassword: {value: "", helperText: "", error: false}
}

function reducer (state, {type, value}) {
    switch(type){
        case 'email': 
            if(value==="error-empty") 
                return {...state, [type]:{value: state[type].value, helperText: "Please enter an email", error: true}}; 
            if(value==="error-duplicate") 
                return {...state, [type]:{value: state[type].value, helperText: "User with this email already exists", error: true}};
            if(value==="error-invalid")
                return {...state, [type]:{value: state[type].value, helperText: "Please enter valid email", error: true}}; 
            return {...state, [type]:{value, error: false}};
        case 'password':
            if(value==="error-empty") 
                return {...state, [type]:{value: state[type].value, strength: -1, helperText: "Password cannot be empty", error: true}};
            if(value==="error-weak")    
                return {...state, [type]:{value: state[type].value, strength: state[type].strength, helperText: "Password too weak. Please choose a strong password.", error: true}};
            return {...state, [type]:{value, strength: value === "" ? -1 : passwordStrength(value).id, helperText: "Must contain atleast 8 characters, with upper and lowercase and a number and symbol", error: false}};
        case 'confirmPassword': 
            if(value === "error") return {...state, [type]:{value: state[type].value, helperText: "Passwords do not match", error: true}}; 
            else return {...state, [type]:{value, error: false}};
    }
}

const useStyles = makeStyles({
    root:{
        "&.MuiLinearProgress-root": {
            backgroundColor: "lightgray"
        },
        "&.MuiLinearProgress-root .MuiLinearProgress-bar1Determinate": {
            backgroundColor: (props) => props.color,
        }
    }
});

function ColoredLinearProgress (props) {
    const classes = useStyles(props);
    return <LinearProgress variant="determinate" value={props.value} className={classes.root}/>
}

export default function SignUpScreen(props) {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [{email, password, confirmPassword}, dispatch] = useReducer(reducer, initialState);

    async function handleSignUp () {
        let valid = true;
        setLoading(true);
        if(email.value === ""){
            valid = false;
            dispatch({type: "email", value: "error-empty"});
        }
        if(password.value===""){
            valid = false;
            dispatch({type: "password", value: "error-empty"});
        }
        else if(password.strength<2){
            valid=false;
            dispatch({type: "password", value:"error-weak"});
        }
        if(password.value !== confirmPassword.value){
            valid = false;
            dispatch({type: "confirmPassword", value:"error"});
        }
        if(valid){
            const response = await APIUtils.signUpUser(email.value, password.value);
            if(response.success){
                props.handleSignUpSuccess();
            }else {
                response.errors.forEach((e)=>{
                    switch(e.param){
                        case 'duplicate-email': dispatch({type: "email", value: "error-duplicate"}); break;
                        case 'email' : dispatch({type: "email", value: "error-invalid"}); break;
                    }
                })
                console.log("Failed", response);
            }
        }
        setLoading(false);
        return;
    }

    return (
        <Box sx={{marginTop: 10}}>
            <Typography sx={{textAlign: 'center', fontSize: "20px"}}>
                Create an account, it's free
            </Typography>
            <TextField
                name="email"
                type="email"
                error={email.error}
                value={email.value}
                fullWidth={true}
                variant="outlined"
                placeholder="Enter email"
                onChange={(e)=>dispatch({type: "email", value: e.target.value})}
                sx = {{ marginTop: 5 }}
            />
            <FormHelperText sx={{height: 15}}>{email.helperText}</FormHelperText>
            <TextField
                name="password"
                type="password"
                value={password.value}
                error={password.error}
                fullWidth={true}
                variant="outlined"
                placeholder="Enter password"
                onChange={(e)=>dispatch({type: "password", value: e.target.value})}
                sx = {{ marginTop: 2 }}
            />
            <ColoredLinearProgress 
                color={password.strength === -1 ? "lightgray" : password.strength === 0 ? "#E75408": password.strength < 2 ? "#DC993D" : "#3EB060"}
                value={password.strength === -1 ? 0 : password.strength === 0 ? 25: password.strength < 2 ? 50 : 100}
            />
            <FormHelperText sx={{height: 40}}>{password.helperText}</FormHelperText>
            <TextField
                name="confirmPassword"
                type={showPassword ? "text":"password"}
                value={confirmPassword.value}
                error={confirmPassword.error}
                fullWidth={true}
                onPaste={(e)=>e.preventDefault()}
                variant="outlined"
                placeholder="Confirm password"
                onChange={(e)=>dispatch({type: "confirmPassword", value: e.target.value})}
                sx = {{ marginTop: 2 }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end" onClick={()=>setShowPassword(!showPassword)}>
                        {!showPassword ? <VisibilityIcon/> : <VisibilityOffIcon />}
                        </InputAdornment>
                    ),
                }}
            />
            <FormHelperText sx={{height: 20}}>{confirmPassword.helperText}</FormHelperText>
            <LoadingButton 
                loading={loading}
                variant="contained"
                sx={{
                    marginTop: 5,
                    padding: "15px 0",
                    width:"100%"
                }}
                onClick={handleSignUp}
            >
                Sign Up
            </LoadingButton >
            <Typography sx={{margin:"30% 0 0 15%"}}>
                Already have an account ?
                <Link sx={{fontWeight: "bold"}} onClick={props.handleLoginClick}> Login </Link>
            </Typography>
        </Box>
    )
}
