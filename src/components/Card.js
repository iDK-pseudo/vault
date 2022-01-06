import SBILogo from '../static/SBI-logo.svg';
import '../styles/Card.css';

function Card () {
    return (
        <div class="card">
            <img class="bank-logo" src={SBILogo}/>
            <div class="card-number">
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
            <div class="card-detail-grid">
            <div>
                <p class="card-detail-title"> Card Holder </p>
                <p> Alex Ferg </p>
            </div>
            <div>
                <p class="card-detail-title">Expires</p>
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