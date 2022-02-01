import '../styles/Welcome.css'
import { useState } from 'react';

const Welcome = (props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [display, setDisplay] = useState('login');
    const [showError, setShowError] = useState(false);
    const [loginBtnText, setLoginBtnText] = useState("LOG IN");
    const [signUpBtnText, setSignUpBtnText] = useState("SIGN UP");
    const [errorList, setErrorList] = useState([]);

    const handleLogin = async () => {
        setShowError(false);
        setLoginBtnText("...")
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username: email, password})
        };
        const response = await fetch('/login', requestOptions);
        const responseData = await response.json();
        if(responseData.success){
            props.handleLoginSuccess();
        }else {
            setShowError(true);
            setLoginBtnText("LOG IN");
        }
    }

    const handleSignUp = async () => {
        setSignUpBtnText('...');
        if(password !== confirmPassword){
            setSignUpBtnText('SIGN UP');
            setShowError(true);
            return;
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email, password})
        };
        const response = await fetch('/signup', requestOptions);
        const responseData = await response.json();
        if(responseData.success){
            setDisplay('login');
            reset();
        }else{
            setErrorList(responseData.errors.map((e)=>{
                return <li key={e.param}>{e.msg}</li>
            }));
        }
        setSignUpBtnText('SIGN UP');
    }

    const reset = () => {
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setShowError(false);
        setLoginBtnText('LOG IN');
        setSignUpBtnText('SIGN UP');
    }

    switch(display){
        case 'login': 
            return (
                <div class='welcome-form'>
                    <label>Email</label>
                    <input placeholder='Enter Email' type='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                    <label>Password</label>
                    <input placeholder='Enter Password' type='password' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    <button className='login-btn' onClick={handleLogin}>{loginBtnText}</button>
                    <p className={showError ? 'incorrect-msg visible' : 'incorrect-msg'}>Incorrect Email or Password</p>
                    <p className='link'>Don't have an account? 
                        <a 
                            onClick={()=>{
                                setDisplay('signup');
                                reset();
                            }}
                        > Sign Up</a>
                    </p>
                </div>
            )
            break;
        case 'signup':
            return (
                <div class='welcome-form'>
                <label>Email</label>
                <input placeholder='Enter Email' type='email' value={email}  onChange={(e)=>setEmail(e.target.value)}/>
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
                <button className='login-btn' onClick={handleSignUp}>{signUpBtnText}</button>
                <ul className='error-list'>
                    {errorList}
                </ul>
                <p className='link'>Already have an account ? 
                    <a 
                        onClick={()=>{
                            setDisplay('login');
                            reset();
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