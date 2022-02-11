import React, {useEffect, useState} from 'react'
import Drawer from '@mui/material/Drawer';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import LockIcon from '@mui/icons-material/Lock';
import AddCardIcon from '@mui/icons-material/AddCard';
import handleAddNewCardAPI from '../../api/APIUtils.js'
import LoadingButton from '@mui/lab/LoadingButton';

export default function AddCardDrawer(props) {
    const [cardnum, setCardNum] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [cvv, setCVV] = useState("");
    const [loading, setLoading] = useState(false);

    const [cardnumError, setCardNumError] = useState(false);
    const [monthError, setMonthError] = useState(false);
    const [yearError, setYearError] = useState(false);
    const [cvvError, setCVVError] = useState(false);

    const initialState = {
        cardnum2 : {
            value: "",
            error: false
        },
        month2: {
            value: "",
            error: false
        },
        year2: {
            value: "",
            error: false
        },
        cvv2: {
            value: "",
            error: false
        }
    }

    const handleEntry = (e) => {
        const {name, value} = e.target;
        switch(name){
            case 'cardnum': 
                if(e.nativeEvent.inputType.includes("insert") && cardnum.length<16) setCardNum(e.target.value); 
                else if(e.nativeEvent.inputType.includes("delete") && cardnum.length>0) setCardNum(e.target.value);
                setCardNumError(false);
                break;
            case 'month': 
                if(e.nativeEvent.inputType.includes("insert") && month.length<2) setMonth(e.target.value); 
                else if(e.nativeEvent.inputType.includes("delete") && month.length>0) setMonth(e.target.value);
                setMonthError(false);
                break;
            case 'year':
                if(e.nativeEvent.inputType.includes("insert") && year.length<4) setYear(e.target.value); 
                else if(e.nativeEvent.inputType.includes("delete") && year.length>0) setYear(e.target.value);
                setYearError(false);
                break;
            case 'cvv':
                if(e.nativeEvent.inputType.includes("insert") && cvv.length<3) setCVV(e.target.value); 
                else if(e.nativeEvent.inputType.includes("delete") && cvv.length>0) setCVV(e.target.value);
                setCVVError(false);
                break;
        }
    }

    const handleAddNewCard = async () => {
        setLoading(true);
        const response = await handleAddNewCardAPI(cardnum, month, year, cvv);
        if(!response.success){
            response.errors.forEach((e)=>{
                switch(e.param){
                    case "cardnum": setCardNumError(true); break;
                    case "year": setYearError(true); break;
                    case "month": setMonthError(true); break;
                    case "cvv": setCVVError(true); break;
                }
            })
        }else if(response.success){
            setLoading(false);
            // props.handleAddNewCardSuccess();
        }
        setLoading(false);
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
                error={cardnumError}
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
                    error={monthError}
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
                    error={yearError}
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
                    error={cvvError}
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
            <LoadingButton loading={loading} variant="contained" size="large" sx={{marginTop: "50px"}} startIcon={<AddCardIcon/>} onClick={handleAddNewCard}>
                Add
            </LoadingButton>
        </Drawer>
    )
}
