import { React, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faKey, faIdCard, faEye } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

import { change } from './loginSlice'

import { useDispatch } from 'react-redux'


function Register() {


    const [firstPassword, setFirstPassword] = useState(false)
    const [secondPassword, setSecondPassword] = useState(false)
    const [login, setSwitchDestin] = useState(false)

    const [alertOpen, setAlertOpen] = useState(false)
    const [fetchResponse, setFetchResponse] = useState("")
    const [cookies, setCookie] = useCookies('jwt');
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        switch (name) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'confirmPassword':
                setConfirmPassword(value);
                break;
            case 'firstName':
                setFirstName(value);
                break;
            case 'lastName':
                setLastName(value);
                break;
            default:
                console.log("error in switch");
                break;
        }
    }

    const handleSubmit = async () => {

        console.log(firstName, lastName, email, password, confirmPassword);

        if (!login) {
            let credentials = { name: firstName, lastName: lastName, email: email, password: password }
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            };
            fetch('http://localhost:3000/api/user/register/', requestOptions)
                .then((res) => res.json())
                .then((data) => {
                    setAlertOpen(true)
                    setFetchResponse(data)
                    console.log(data)
                });
        }
        else {
            let credentials = { email: email, password: password }
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            };
            fetch('http://localhost:3000/api/user/login', requestOptions)
                .then((res) => res.json())
                .then((data) => {
                    setAlertOpen(true)
                    setFetchResponse(data)
                    setCookie('jwt', data.token, { path: '/', maxAge: 3600 });
                    dispatch(change(credentials.email))
                    navigate("/dashboard");
                });
        }

    }
    return (
        <div className='RegisterForm'>
            <div className={alertOpen ? "alert" : "hide"}><span>{JSON.stringify(fetchResponse)}</span></div>
            <div className="form_wrapper">
                <div className="form_container">
                    <div className="title_container">
                        <h2>Welcome to Instagram!</h2>
                        <h3>Please register to continue</h3>
                    </div>
                    <div className="row clearfix">
                        <div className="">
                            <div className="input_field">
                                <span>{<FontAwesomeIcon icon={faEnvelope} />}</span>
                                <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => handleInputChange(e)} required />
                            </div>
                            <div className="input_field">
                                <span onClick={() => setFirstPassword(!firstPassword)}>{<FontAwesomeIcon icon={firstPassword ? faEye : faKey} />}</span>
                                <input type={firstPassword ? "text" : "password"} name="password" placeholder="Password" value={password} onChange={(e) => handleInputChange(e)} required />
                            </div>
                            <div className={login ? "off" : "onn"}>
                                <div className="input_field">
                                    <span onClick={() => setSecondPassword(!secondPassword)}>{<FontAwesomeIcon icon={secondPassword ? faEye : faKey} />}</span>
                                    <input type={secondPassword ? "text" : "password"} name="confirmPassword" placeholder="Re-type Password" value={confirmPassword} onChange={(e) => handleInputChange(e)} />
                                </div>
                                <div className="row clearfix">
                                    <div className="col_half">
                                        <div className="input_field"> <span>{<FontAwesomeIcon icon={faIdCard} />}</span>
                                            <input type="text" name="firstName" placeholder="First Name" value={firstName} onChange={(e) => handleInputChange(e)} />
                                        </div>
                                    </div>
                                    <div className="col_half">
                                        <div className="input_field"> <span>{<FontAwesomeIcon icon={faIdCard} />}</span>
                                            <input type="text" name="lastName" placeholder="Last Name" value={lastName} onChange={(e) => handleInputChange(e)} />
                                        </div>
                                    </div>
                                </div>
                                <div className="input_field checkbox_option">
                                    <input type="checkbox" id="cb1" />
                                    <label htmlFor="cb1">I agree with terms and conditions</label>
                                </div>
                            </div>
                            <input className="button" type="submit" value={login ? "Login" : "Register"} onClick={() => handleSubmit()} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="form_wrapper unique">
                <div className="form_container">
                    <div className="title_container">
                        <h2>{login ? "Click here to create account" : "Already have an account?"}</h2>
                        <input type="submit" value={login ? "Register" : "Login"} onClick={() => setSwitchDestin(!login)} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register