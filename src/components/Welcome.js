import '../styles/Welcome.css'
import { useState } from 'react';

const Welcome = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        console.log(username, password)
    }

    return (
        <div class='welcome-form'>
            <label>Username</label>
            <input placeholder='Enter Username' type='text' onChange={(e)=>setUsername(e.target.value)}/>
            <label>Password</label>
            <input placeholder='Enter Password' type='password' onChange={(e)=>setPassword(e.target.value)}/>
            <button className='login-btn' onClick={handleLogin}>LOG IN</button>
            <p className='sign-up-link'>Don't have an account? <a>Sign Up</a></p>
        </div>
    )
}

export default Welcome;