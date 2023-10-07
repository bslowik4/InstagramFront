import { React, useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { change } from './loginSlice'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIdCard, faImage } from '@fortawesome/free-solid-svg-icons'


function NavBar() {
    const [cookies, setCookie] = useCookies(['name']);
    const [userData, setUserData] = useState("test")
    const [profilePic, setProfilePic] = useState("test.png");
    const navigate = useNavigate();
    const login = useSelector((state) => state.login.value)
    const dispatch = useDispatch()

    useEffect(() => {
        if (cookies.jwt === undefined) navigate("/");
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ login: login })
        };

        const fetchImage = async () => {
            let result = await fetch('http://localhost:3000/api/profile/pic', requestOptions)
            if (result.status === 200) {
                const imageBlob = await result.blob()
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setProfilePic(imageObjectURL)
            }
            if (result.status === 400) {
                setProfilePic("test.png")
            }
        }

        const fetchUserData = async () => {
            fetch('http://localhost:3000/api/profile', {
                headers: { authorization: `Bearer ${cookies.jwt}` }
            })
                .then((res) => res.json())
                .then((data) => {
                    setUserData(data)
                    if (login !== data.mail) dispatch(change(data.mail))
                })
                .then(fetchImage());
        }
        fetchUserData()
    }, [])


    return (
        <div className='navBar'>
            <div className='logo'>
                <img src='logo192.png' alt='logo strony' className='imgLogo'></img>
                <p>Instagram</p>
            </div>
            <div className='userBox'>
                <img src={profilePic} alt='profile pic' className='profilePic'></img>
                <p>{login}</p>
                <div className='two'><p>{userData.name}</p> <p>{userData.lastName}</p></div>
                <div className="link">{<FontAwesomeIcon icon={faIdCard} />}<a href='/editProfileData'> Edit your profile Data</a></div>
                <div className="link">{<FontAwesomeIcon icon={faImage} />}<a href='/editPicture'> Edit your profile Picture</a></div>
            </div>
        </div>
    )
}

export default NavBar