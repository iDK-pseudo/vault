import React from 'react'
import Drawer from '@mui/material/Drawer';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import LockIcon from '@mui/icons-material/Lock';
import Button from '@mui/material/Button';
import AddCardIcon from '@mui/icons-material/AddCard';

export default function AddCardDrawer(props) {
  return (
    <Drawer 
        open={props.open} 
        anchor="bottom" 
        PaperProps = {{sx: {padding: 5}}}
        onClose={props.handleDrawerClose}
    >   
        <InputLabel>
                Card Number
        </InputLabel>
        <Input
            startAdornment={
                <InputAdornment position="start">
                    <CreditCardIcon fontSize="small"/>
                </InputAdornment>
            }
            placeholder="1234 2232 1232 1223"
            sx = {{
                fontSize: '25px',
                fontWeight: 'bolder'
            }}
        />
        <div style= {{display: 'flex', marginTop: '30px'}}>
            <div>
            <InputLabel>
                    Month
            </InputLabel>
            <Input
                startAdornment={
                    <InputAdornment position="start">
                        <EventIcon fontSize="small"/>
                    </InputAdornment>
                }
                placeholder="01"
                sx = {{
                    fontSize: '20px',
                    marginRight: '20px',
                    fontWeight: 'bolder'
                }}
            />
            </div>
            <div>
            <InputLabel>
                    Year
            </InputLabel>
            <Input
                startAdornment={
                    <InputAdornment position="start">
                        <EventIcon fontSize="small"/>
                    </InputAdornment>
                }
                placeholder="2020"
                sx = {{
                    fontSize: '20px',
                    marginRight: '20px',
                    fontWeight: 'bolder'
                }}
            />
            </div>
            <div>
            <InputLabel>
                    CVV
            </InputLabel>
            <Input
                startAdornment={
                    <InputAdornment position="start">
                        <LockIcon fontSize="small"/>
                    </InputAdornment>
                }
                placeholder="123"
                sx = {{
                    fontSize: '20px',
                    fontWeight: 'bolder'
                }}
            />
            </div>
        </div>
        <Button variant="contained" size="large" sx={{marginTop: "50px"}} startIcon={<AddCardIcon/>}>
            Add
        </Button>
    </Drawer>
  )
}
