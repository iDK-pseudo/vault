import React,{useState, useEffect} from 'react'
import Card from '@mui/material/Card';
import {ReactComponent as MasterCard} from '../../static/mastercard.svg';
import BackgroundImage from '../../static/card_bg.jpg';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';

export default function CreditCard({card}) {

  const [cardNumParts, setCardNumParts] = useState([]);

  useEffect(()=>{ 
    let parts = [], cardNumString = card.cardnum.toString();
    parts.push(<div>****</div>);
    parts.push(<div>****</div>);
    parts.push(<div>****</div>);
    parts.push(<div>{cardNumString.substring(12,16)}</div>);
    setCardNumParts(parts);
  },[card]);

  return (
    <Card 
      raised
      sx={{ 
        minHeight: 200,
        margin: "10px 0",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundSize: "cover"
      }}
    >
      <MasterCard style={{height: "50px", float: 'right'}}/>
      <CardContent>
          <Box sx={{display: 'flex', marginTop: 8, color: "white", fontFamily: "Arial", fontSize: 30, justifyContent: "space-between"}}>
            {cardNumParts}
          </Box>
          <Grid container sx={{marginTop: 4}}>
            <Grid item xs={4}>
              <Typography variant="h4" component="div" sx={{fontSize: 12, color: "white", fontWeight: "bolder"}}>
                Expires
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h4" component="div" sx={{fontSize: 12, color: "white", fontWeight: "bolder"}}>
                CVV             
              </Typography>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={4}>
              <Typography sx={{color: "white", fontWeight: "bold", fontSize: 18}}>
                {`${card.month}/${card.year}`}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography sx={{color: "white", fontWeight: "bold", fontSize: 18}}>
                ***
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <IconButton sx={{float: "right", padding: 0}} onClick={()=>console.log("Clicked")}>
                <VisibilityOffIcon fontSize="large"/>
              </IconButton>
            </Grid>
            </Grid>
      </CardContent>
    </Card>
  )
}
