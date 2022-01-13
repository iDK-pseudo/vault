import SBILogo from '../static/SBI-logo.svg';
import '../styles/Card.css';

function Card () {
    return (
        <div className="card">
            <img className="bank-logo" src={SBILogo}/>
            <div className="card-number">
                <div>
                    1234
                </div>
                <div>
                    5678
                </div>
                <div>
                    9011
                </div>
            </div>
            <div className="card-detail-grid">
            <div>
                <p className="card-detail-title"> Card Holder </p>
                <p> Alex Ferg </p>
            </div>
            <div>
                <p className="card-detail-title">Expires</p>
                <p>06/22</p>
            </div>
            <div>
                <p> Provider </p>
            </div>
            </div>
        </div>
    );
}

export default Card;