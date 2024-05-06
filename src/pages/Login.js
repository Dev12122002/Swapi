import React, { useState, useEffect } from 'react'
import './Login.css'
import { toast } from 'react-hot-toast';
import Cookies from 'js-cookie';
import { generateJWT, verifyJWT } from '../Helper/LoginHelper';

export default function Login(props) {

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');

    const refreshTokenIfExpired = async () => {
        let accessToken = localStorage.getItem('token');
        let refreshToken = Cookies.get('refresh_token');

        const data = await verifyJWT(accessToken);
        let data1;
        if (data.data === '') {
            // console.log('Access token expired');
            if (refreshToken !== undefined && (data1 = await verifyJWT(refreshToken))) {
                if (data1.data === '') {
                    // console.log('Invalid refresh token');
                    return;
                }
                const newAccessToken = await generateJWT('30m', username);
                localStorage.setItem('token', newAccessToken);
                props.setLoggedIn(true);
            }
        }
    };

    useEffect(() => {
        refreshTokenIfExpired();
        // eslint-disable-next-line
    }, [])


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            toast.error('Username and Password are required!');
            return;
        }

        if (username !== process.env.REACT_APP_DEFAULT_USERNAME || password !== process.env.REACT_APP_DEFAULT_PASSWORD) {
            toast.error('Invalid Username or Password!');
            return;
        }

        const accessToken = await generateJWT('30m', username);
        const refreshToken = await generateJWT('1d', username);

        Cookies.set('refresh_token', refreshToken, {
            // HttpOnly: true,
            path: '/',
            expires: 1
        })

        localStorage.setItem("token", accessToken);
        props.setLoggedIn(true);

    };

    return (
        <div className='container fctn w-25'>
            <form className="row g-3 needs-validation" noValidate>
                <h3>Swapi Login</h3>
                <div className="col-12">
                    <label htmlFor="validationCustom01" className="form-label">Username</label>
                    <input type="text" className="form-control" id="validationCustom01" value={username} required onChange={(e) => setUserName(e.target.value)} />
                    < div className="invalid-feedback" >
                        Username is required!
                    </div >
                </div >
                <div className="col-12">
                    <label htmlFor="validationCustom02" className="form-label">Password</label>
                    <input autoComplete='false' type="password" className="form-control" id="validationCustom02" value={password} required onChange={(e) => setPassword(e.target.value)} />
                    <div className="invalid-feedback">
                        Password is required!
                    </div >
                </div >

                <div className="col-12">
                    < button className="btn btn-danger" type="submit" onClick={handleSubmit}>Login</button>
                </div >
            </form >
        </div >
    )
}
