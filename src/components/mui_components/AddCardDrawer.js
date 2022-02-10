import React, {useState} from 'react'
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
    const [cardnum, setCardNum] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [cvv, setCVV] = useState("");

    const handleEntry = (e) => {
        switch(e.target.name){
            case 'cardnum': 
                if(e.nativeEvent.inputType.includes("insert") && cardnum.length<16) setCardNum(e.target.value); 
                else if(e.nativeEvent.inputType.includes("delete") && cardnum.length>0) setCardNum(e.target.value);
                break;
            case 'month': 
                if(e.nativeEvent.inputType.includes("insert") && month.length<2) setMonth(e.target.value); 
                else if(e.nativeEvent.inputType.includes("delete") && month.length>0) setMonth(e.target.value);
                break;
            case 'year':
                if(e.nativeEvent.inputType.includes("insert") && year.length<4) setYear(e.target.value); 
                else if(e.nativeEvent.inputType.includes("delete") && year.length>0) setYear(e.target.value);
                break;
            case 'cvv':
                if(e.nativeEvent.inputType.includes("insert") && cvv.length<3) setCVV(e.target.value); 
                else if(e.nativeEvent.inputType.includes("delete") && cvv.length>0) setCVV(e.target.value);
                break;
        }
    }

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
                name="cardnum"
                type="number"
                value={cardnum}
                onChange={handleEntry}
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
                    name="month"
                    type="number"
                    value={month}
                    onChange={handleEntry}
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
                    name="year"
                    type="number"
                    value={year}
                    onChange={handleEntry}
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
                    name="cvv"
                    type="number"
                    value={cvv}
                    onChange={handleEntry}
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
            <Button variant="contained" size="large" sx={{marginTop: "50px"}} startIcon={<AddCardIcon/>} onClick={props.handleAddNewCard}>
                Add
            </Button>
        </Drawer>
    )
}
