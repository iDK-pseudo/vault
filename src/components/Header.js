function Header (props) {
    return (
        <header>
            <h1> Wallet </h1>
            {props.display==='homepage' && <button onClick={props.handleLogout}> LOG OUT </button>}
        </header>
    );
}

export default Header;