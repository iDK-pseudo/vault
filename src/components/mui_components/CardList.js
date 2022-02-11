import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {ReactComponent as RupayLogo} from '../../static/rupay.svg';

export default function CardList(props) {

    return (
        <List >
            {props.cardList.map((each)=>
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
                        <RupayLogo/>
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
            )}
        </List>
    )
}
