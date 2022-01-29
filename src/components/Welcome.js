import '../styles/Welcome.css'
import { useState } from 'react';

const Welcome = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [display, setDisplay] = useState('login');
    const [showError, setShowError] = useState(false);

    const handleLogin = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username, password})
        };
        const response = await fetch('/login', requestOptions);
    }

    const handleSignUp = async () => {
        if(password !== confirmPassword){
            setShowError(true);
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username, password})
        };
        const response = await fetch('/signup', requestOptions);
    }

    switch(display){
        case 'login': 
            return (
                <div class='welcome-form'>
                    <label>Username</label>
                    <input placeholder='Enter Username' type='text' value={username} onChange={(e)=>setUsername(e.target.value)}/>
                    <label>Password</label>
                    <input placeholder='Enter Password' type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <button className='login-btn' onClick={handleLogin}>LOG IN</button>
                    <p className='link'>Don't have an account? 
                        <a 
                            onClick={()=>{
                                setDisplay('signup');
                                setUsername('');
                                setPassword('');
                                setConfirmPassword('');
                            }}
                        > Sign Up</a>
                    </p>
                </div>
            )
            break;
        case 'signup':
            return (
                <div class='welcome-form'>
                <label>Username</label>
                <input placeholder='Enter Username' type='text' value={username}  onChange={(e)=>setUsername(e.target.value)}/>
                <label>Password</label>
                <input placeholder='Enter Password' type='password' value={password}  onChange={(e)=>setPassword(e.target.value)}/>
                <label>Confirm Password</label>
                <input 
                    placeholder='Re-enter Password' 
                    className={showError ? 'error' : ''} 
                    type='text'
                    value={confirmPassword}
                    onChange={(e)=>{
                        setConfirmPassword(e.target.value);
                        setShowError(false);
                    }}
                />
                <button className='login-btn' onClick={handleSignUp}>SIGN UP</button>
                <p className='link'>Already have an account ? 
                    <a 
                        onClick={()=>{
                            setDisplay('login');
                            setUsername('');
                            setPassword('');
                        }}
                    > Log In
                    </a>
                </p>
                </div>
            )
            break;
    }
}

export default Welcome;