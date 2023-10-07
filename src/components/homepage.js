import { React, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faMessage } from '@fortawesome/free-solid-svg-icons'


function HomePage() {
    const [cookies, setCookie] = useCookies();
    const [userPhotos, setUserPhotos] = useState([]);
    const login = useSelector((state) => state.login.value)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const form = document.getElementById("form")
        const formData = new FormData(form);
        const options = {
            method: "POST",
            body: formData,
            headers: { authorization: `Bearer ${cookies.jwt}` }
        }
        fetch('http://localhost:3000/api/photos', options)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                navigate("/editPhoto", { state: { id: data.id } })
            });
    }

    useEffect(() => {
        let idTab = []
        const fetchImages = async () => {
            let test = await fetch('http://localhost:3000/api/photos').then(res => res.json()).then(
                (data) => {
                    data.forEach(element => {
                        if (element.album == login) idTab.push(element)
                    });
                }
            )
            console.log(test)
            console.log(idTab)
            idTab.forEach(element => {
                console.log(element)
                const requestOptions = {
                    method: 'POST',
                    body: JSON.stringify({ id: element.id })
                };
                const fetchImage = async () => {
                    let result = await fetch('http://localhost:3000/api/photos/getPicture', requestOptions)
                    if (result.status === 200) {
                        const imageBlob = await result.blob()
                        const imageObjectURL = URL.createObjectURL(imageBlob);
                        setUserPhotos(oldArray => [...oldArray, imageObjectURL])
                    }
                    if (result.status === 400) {
                        console.log("no photo found")
                    }
                }
                fetchImage()
            })
        }
        fetchImages()

    }, [login])



    return (
        <div className='homePage'>
            <div className='topBar'>
                <div className='searchBar'>{<FontAwesomeIcon icon={faMagnifyingGlass} />}&nbsp;<input type='text' placeholder='Search Something!' /></div>
                <div className='addPhoto'>
                    {<FontAwesomeIcon icon={faMessage} />}
                    <form id='form'>
                        <label htmlFor="test"> &nbsp;
                            <input type='file' className="photoSend" id="test" accept="image/png, image/jpeg" required name='file' title="a" />
                        </label>
                        <input type='hidden' value={login} name='album' />
                        <button onClick={(e) => { handleSubmit(e) }}>submit</button>
                    </form>
                </div>
            </div>
            <div className="photoAlbum">
                {userPhotos.map((element, id) => (
                    <img src={element} key={id} alt={"userPhoto"} />
                ))}
            </div>
        </div>
    )
}

export default HomePage