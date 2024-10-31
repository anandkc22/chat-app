import React, { useState } from 'react'
import './Login.css'
import assets from '../../assets/assets'
import {signup, login, resetPassword} from '../../config/firebase'

const Login = () => {

  const [currState, setCurrentState] = useState('Sign Up');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currState === 'Sign Up') {
      signup(username, email, password);
    }
    else {
      login(email, password);
    }
  }

  return (
    <div className='login'>
      <img src={assets.logo_big} alt="" className='logo' />
      <form onSubmit={onSubmitHandler} className='login-form'>
        <h2>{currState}</h2>
        {currState === 'Sign Up' ? <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" className="form-input" placeholder='username' required/> : null}
        <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" className="form-input" placeholder='email' required/>
        <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className="form-input" placeholder='password' required/>
        <button type="submit">{currState}</button>
        <div className='login-term'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy</p>
        </div>
        <div className="login-forgot">
          {currState === 'Sign Up' ? <p className="login-toggle">Already have an account? <span onClick={() => setCurrentState('Login')}>Login</span></p>
          : <p className="login-toggle">Create an account? <span onClick={() => setCurrentState('Sign Up')}>Sign up</span></p>}
          {currState === 'Login' ? <p className="login-toggle">Forgot password? <span onClick={() => resetPassword(email)}>Reset</span></p> : null}
        </div>
      </form>
    </div>
  )
}

export default Login