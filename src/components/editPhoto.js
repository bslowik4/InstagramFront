import { React, useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';

function EditPhoto() {
    const { state } = useLocation();
    const id = state.id
    const [profilePic, setProfilePic] = useState("");
    const [filter, setFilter] = useState('rotate');
    const [filterForm, setFilterForm] = useState(['value'])
    const [tag, setTag] = useState('none');
    const [tags, setTags] = useState([])
    const [sendTag, setSendTag] = useState("none");
    const navigate = useNavigate()

    useEffect(() => {
        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ id: id })
        };
        const fetchImage = async () => {
            let result = await fetch('http://localhost:3000/api/photos/getPicture', requestOptions)
            if (result.status === 200) {
                const imageBlob = await result.blob()
                const imageObjectURL = URL.createObjectURL(imageBlob);
                setProfilePic(imageObjectURL)
            }
            if (result.status === 400) {
                console.log("no photo found")
            }
        }
        fetchImage()

        const getRequestOptions = {
            method: 'GET',
        }
        const fetchTags = () => {
            fetch('http://localhost:3000/api/tags', getRequestOptions)
                .then(response => response.json())
                .then((data) => {
                    console.log(data)
                    setTags(data)
                })
        }
        fetchTags()
        console.log(tags)

    }, [])

    const handleChange = (e) => {
        e.preventDefault()
        setFilter(e.target.value)
        let val;
        switch (e.target.value) {
            case 'rotate':
                val = ['value'];
                break;
            case 'resize':
                val = ['width', 'height'];
                break;
            case 'reformat':
                val = ['value'];
                break;
            case 'crop':
                val = ['width', 'height', 'left', 'top'];
                break;
            case 'grayscale':
                val = [];
                break;
            case 'flip':
                val = [];
                break;
            case 'flop':
                val = [];
                break;
            case 'negate':
                val = [];
                break;
            case 'tint':
                val = ['r', 'g', 'b'];
                break;
            default:
                break;
        }
        const changeState = (newValue) => {
            setFilterForm([...newValue]);
        }
        changeState(val)
    }
    const handleChangeTags = (e) => {
        e.preventDefault()
        setTag(e.target.value)
    }
    const handleAddTag = (e) => {
        e.preventDefault()
        setSendTag(e.target.value)
        console.log(e.target.value)
    }

    const submitFilterForm = (e) => {
        const form = document.getElementById('filterForm');
        e.preventDefault()
        const myFormData = new FormData(form);
        const formDataObj = {};
        myFormData.forEach((value, key) => (formDataObj[key] = parseInt(value)));
        formDataObj["filterType"] = filter
        formDataObj["id"] = id
        console.log(formDataObj)

        const options = {
            method: "POST",
            body: JSON.stringify(formDataObj),
            headers: { 'content-type': 'application/json' }
        }
        fetch('http://localhost:3000/api/filters', options)
            .then(window.location.reload(false))
    }
    const submitTagForm = (e) => {
        e.preventDefault()
        const options = {
            method: "POST",
            body: JSON.stringify({ "name": tag }),
            headers: { 'content-type': 'application/json' }
        }
        fetch('http://localhost:3000/api/tags', options).then(window.location.reload(false))
    }
    const submitAddTag = (e) => {
        e.preventDefault()
        const options = {
            method: "PATCH",
            body: JSON.stringify({ "id": id, "tagId": sendTag }),
            headers: { 'content-type': 'application/json' }
        }
        fetch('http://localhost:3000/api/photos/tags', options)
    }

    return (
        <div className='editBox'>
            <img src={profilePic} alt='preview of edited photo' className='editedPhoto'></img>
            <select value={filter} onChange={handleChange}>
                <option value="rotate">rotate</option>
                <option value="resize">resize</option>
                <option value="reformat">reformat</option>
                <option value="crop">crop</option>
                <option value="grayscale">grayscale</option>
                <option value="flip">flip</option>
                <option value="flop">flop</option>
                <option value="negate">negate</option>
                <option value="tint">tint</option>
            </select>
            <form id='filterForm'>
                {filterForm.map((element, id) =>
                    <input type="text" name={element} key={id} placeholder={element} />
                )}
                <input type='submit' onClick={(e) => { submitFilterForm(e) }} />
            </form>
            <select value={sendTag} onChange={handleAddTag}>
                {tags.map((element) => <option value={element.id} key={element.id}>{element.val}</option>)}
            </select>
            <input type='submit' onClick={(e) => { submitAddTag(e) }} />
            <br />
            <form id='newTagForm'>
                <input type="text" onChange={handleChangeTags} />
                <input type='submit' onClick={(e) => { submitTagForm(e) }} />
            </form>
            <button value="Back" onClick={() => { navigate("/dashboard") }}>Back</button>
        </div>
    )
}

export default EditPhoto;