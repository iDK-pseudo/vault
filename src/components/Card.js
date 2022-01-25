import { useState, useEffect } from 'react';
import SBILogo from '../static/SBI-logo.svg';
import '../styles/Card.css';

function Card (props) {
    
    const [card, setCard] = useState({});

    useEffect(()=>{
        const card = {};
        if(props.selectedCard){
            card.cardnum1 = props.selectedCard.cardnum.slice(0,4);
            card.cardnum2 = props.selectedCard.cardnum.slice(4,8);
            card.cardnum3 = props.selectedCard.cardnum.slice(8,12);
            card.cardnum4 = props.selectedCard.cardnum.slice(12,16);
            card.expires = props.selectedCard.expires.slice(5,7)+"/"+props.selectedCard.expires.slice(2,4);
        }
        setCard(card);
    },[props.selectedCard]);

    return (
        <div className="card">
            <img className="bank-logo" src={SBILogo}/>
            <div className="card-number">
                <div>
                    {card.cardnum1}
                </div>
                <div>
                    {card.cardnum2}
                </div>
                <div>
                    {card.cardnum3}
                </div>
                <div>
                    {card.cardnum4}
                </div>
            </div>
            <div className="card-detail-grid">
            <div>
                <p className="card-detail-title">Expires</p>
                <p>{card.expires}</p>
            </div>
            </div>
        </div>
    );
}

export default Card;