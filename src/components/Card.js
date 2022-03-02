import { useState, useEffect } from "react";
import "../styles/Card.css";

function Card(props) {
    const [card, setCard] = useState({});
    const [logo, setLogo] = useState(null);

    /*
    useEffect( async ()=>{
        const card = {};
        let useLogo = "", logoImg = "";
        if(props.selectedCard){
            card.cardnum1 = props.selectedCard.cardnum.slice(0,4);
            card.cardnum2 = props.selectedCard.cardnum.slice(4,8);
            card.cardnum3 = props.selectedCard.cardnum.slice(8,12);
            card.cardnum4 = props.selectedCard.cardnum.slice(12,16);
            card.expires = props.selectedCard.expires.slice(5,7)+"/"+props.selectedCard.expires.slice(2,4);
            if(props.selectedCard.bank.includes("IDBI")){
                // useLogo = await import('../static/IDBI Logo.png');
                logoImg = <img className="logo" src={useLogo.default}/>
            }else if(props.selectedCard.bank.includes("HDFC")){
                // useLogo = await import('../static/HDFC Logo.jpg');
                logoImg = <img className="logo" src={useLogo.default}/>
            }else if(props.selectedCard.bank.includes("SBI")){
                // useLogo = await import('../static/SBI Logo.png');
                logoImg = <img className="logo" src={useLogo.default}/>
            }
        }
        setCard(card);
        setLogo(logoImg);
    },[props.selectedCard]);
    */
    return (
        <div className="card">
            <div className="logo-wrapper">{logo}</div>
            <div className="card-number">
                <div>{card.cardnum1}</div>
                <div>{card.cardnum2}</div>
                <div>{card.cardnum3}</div>
                <div>{card.cardnum4}</div>
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
