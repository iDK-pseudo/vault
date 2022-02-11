import React, {useEffect, useState} from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import {ReactComponent as Visa} from '../../static/visa.svg';
import {ReactComponent as Rupay} from '../../static/rupay.svg';
import {ReactComponent as MasterCard} from '../../static/mastercard.svg';
import {ReactComponent as AmericanExpress} from '../../static/american_express.svg';

export default function CardList(props) {
    const [cardList, setCardList] = useState([]);
    useEffect(()=>{
        props.cardList.forEach((each)=>{
            if(each.cardType === "Mastercard"){
                each.cardTypeElement = <MasterCard/>
            }else if(each.cardType==="Visa"){
                each.cardTypeElement = <Visa/>
            }else if(each.cardType==="American Express"){
                each.cardTypeElement = <AmericanExpress/>
            }else if(each.cardType==="Discover"){
                each.cardTypeElement = <Rupay/>
            }else{
                each.cardTypeElement = <CreditCardIcon sx={{fontSize: "45px"}}/>
            }
        });

        setCardList(props.cardList.map(each=>
            <ListItem disablePadding
                key={each._id} 
                sx={{
                        backgroundColor: '#EBE3D5',
                        borderRadius: 2,
                        marginBottom: 1,
                    }}
            >
                <ListItemButton>
                    <ListItemIcon sx={{marginRight: "20px"}}>
                        {each.cardTypeElement}
                    </ListItemIcon>
                    <ListItemText 
                        primary={"*"+each.cardnum.toString().slice(-4)}
                        secondary={"Expires on "+each.month+"/"+each.year}
                        primaryTypographyProps={{
                            fontSize: "20px",
                            fontFamily: "Calibri",
                            fontWeight: "bold"
                        }}
                    />
                </ListItemButton>   
            </ListItem>
        ));
    },[props.cardList]);

    return (
        <List >
           {cardList}
        </List>
    )
}
