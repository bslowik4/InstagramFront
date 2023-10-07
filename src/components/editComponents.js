import { React } from "react";
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux'

function EditProfilePicture() {
    const [cookies, setCookie] = useCookies();
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
        delete options.headers['Content-Type'];
        fetch('http://localhost:3000/api/profile', options)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                navigate("/dashboard")
            });
    }
    return (
        <div className='pictureForm'>
            <form id='form'>
                <input type='file' accept="image/png, image/jpeg" required name='profile' />
                <input type='hidden' value={login} name='album' />
                <button onClick={(e) => { handleSubmit(e) }}>submit</button>
            </form>
        </div>
    )
}

function EditProfileData() {
    const [cookies, setCookie] = useCookies();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        const form = e.target
        const formData = new FormData(form);
        const formJson = Object.fromEntries(formData.entries());
        console.log(formJson)
        const options = {
            method: "PATCH",
            body: JSON.stringify(formJson),
            headers: { authorization: `Bearer ${cookies.jwt}` }
        }
        fetch('http://localhost:3000/api/profile', options)
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                navigate("/dashboard")
            });
    }

    return (
        <div className='pictureForm'>
            <form method="PATCH" onSubmit={handleSubmit}>
                <label>
                    Name: <input type='text' name="name" required />
                </label>
                <label>
                    LastName: <input type='text' name='lastName' required />
                </label>
                <button type='submit'>submit</button>
            </form>
        </div>
    )
}


export { EditProfileData, EditProfilePicture }