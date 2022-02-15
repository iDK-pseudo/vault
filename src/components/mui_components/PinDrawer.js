import React, {useState} from 'react'
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import BackspaceIcon from '@mui/icons-material/Backspace';
import APIUtils from '../../api/APIUtils.js';

export default function PinDrawer(props) {

    const [pin, setPin] = useState("");
    const [error, setError] = useState(false);

    const handleEntry = (e) => {
        if(e.currentTarget.id === "backspace"){
            if(pin.length>0){
                setPin(pin.substring(0, pin.length-1));
            }
            return;
        }
        const value = e.target.innerText;
        if(!isNaN(value)){
            if(pin.length !== 6){
                setPin(pin+value);
                setError(false);
            }
        }
    }

    const handlePinCheck = async () => {
        if(pin.length < 6){
            setError(true);
            return;
        }
        if(await APIUtils.verifyUserPin(pin)){
            console.log("Verified");
        }
    }

    return (
        <Drawer
            open={props.open}
            anchor="bottom"
            PaperProps = {{sx: {padding: 5, height: "52vh"}}}
            onClose={()=>{props.handleDrawerClose()}}
        >
            <Typography sx={{textAlign: "center", marginBottom: 2}}>Enter 6 Digit PIN</Typography>
            <TextField 
                disabled
                type="text"
                value={pin}
                error={error}
                variant="standard"
                sx={{
                    marginBottom: 2
                }}
                inputProps = {{
                    sx: {
                        fontSize: 30,
                        letterSpacing: 15,
                        textAlign: "center"
                    }
                }}
            />
            <Grid container columnSpacing={5} rowSpacing={3}>
                <Grid item xs={4}><Button sx={{fontSize: 30}} onClick={handleEntry}>1</Button></Grid>
                <Grid item xs={4}><Button sx={{fontSize: 30}} onClick={handleEntry}>2</Button></Grid>
                <Grid item xs={4}><Button sx={{fontSize: 30}} onClick={handleEntry}>3</Button></Grid>
                <Grid item xs={4}><Button sx={{fontSize: 30}} onClick={handleEntry}>4</Button></Grid>
                <Grid item xs={4}><Button sx={{fontSize: 30}} onClick={handleEntry}>5</Button></Grid>
                <Grid item xs={4}><Button sx={{fontSize: 30}} onClick={handleEntry}>6</Button></Grid>
                <Grid item xs={4}><Button sx={{fontSize: 30}} onClick={handleEntry}>7</Button></Grid>
                <Grid item xs={4}><Button sx={{fontSize: 30}} onClick={handleEntry}>8</Button></Grid>
                <Grid item xs={4}><Button sx={{fontSize: 30}} onClick={handleEntry}>9</Button></Grid>
                <Grid item xs={4}><IconButton id="backspace" onClick={handleEntry}><BackspaceIcon fontSize="large" color="primary"/></IconButton></Grid>
                <Grid item xs={4}><Button sx={{fontSize: 30}} onClick={handleEntry}>0</Button></Grid>
                <Grid item xs={4}><IconButton id="check" onClick={handlePinCheck}><CheckIcon fontSize="large" color="primary"/></IconButton></Grid>
            </Grid>
        </Drawer> 
    )
}
