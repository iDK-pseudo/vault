import React from 'react'
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';


export default function CardList() {
    const styles = {
        ListItem: {
            backgroundColor: 'wheat',
            borderRadius: 5
        }
    }

    return (
        <List >
            <ListItem disablePadding sx={styles.ListItem}>
                <ListItemButton >
                <ListItemText primary="Card 1" />
                </ListItemButton>
            </ListItem>
        </List>
    )
}
