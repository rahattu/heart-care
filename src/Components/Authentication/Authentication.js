import React, { useContext, useState } from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import firebaseConfig from './Firebase/FirebaseConfig';
import { userContext } from '../../App';
import { useHistory, useLocation } from 'react-router';
import './Authentication.css';

initializeApp(firebaseConfig);

const Authentication = () => {

    const [auths, setAuth] = useContext(userContext)
    const [bio, setBio] = useState({
        name: '',
        email: '',
        password: ''
    })

    const [newUser, setNewUser] = useState(false)
    const history = useHistory()
    const location = useLocation()

    let { from } = location.state || { from: { pathname: "/" } };


    const handleChange = (e) => {
        setBio({
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e) => {
        const auth = getAuth();
        e.preventDefault()
        createUserWithEmailAndPassword(auth, bio.name, bio.email, bio.password)

            .then((userCredential) => {

                const user = userCredential.user;
                console.log(user)

            })
            .catch((error) => {
                console.log(error.message)
            });
    }

    const handleGoggleSignIn = () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider)
            .then((result) => {


                const user = result.user;
                console.log(user)
                setBio({ user: user.displayName })
                setAuth({ user: user.displayName })
                sessionStorage.setItem('user', user.displayName)
                sessionStorage.setItem('userProfilePic', user.photoURL)
                history.replace(from);

            }).catch((error) => {

                console.log(error)
            });

    }

    return (
        <div className="auth">
            <div className="text-center">
            <input type="checkbox" onChange={() => setNewUser(!newUser)} name="userName" />
            <label htmlFor="newuser">New-user-Sign-up</label>


            <form onSubmit={handleSubmit}>
                {newUser &&
                    <input onChange={handleChange} name="name" type="text" placeholder="name" />


                }
                <br />
                <input required name="email" onChange={handleChange} placeholder="Your Email Address" type="email" />
                <br />
                <input name="password" onChange={handleChange} placeholder="Your Password" type="password" required />
                <br />
                <input type="submit" value={newUser ? 'Sign-up' : 'Sign-in'} />
            </form>



            <button onClick={handleGoggleSignIn} className="btn btn-warning">Sign Up With goggle</button>
        </div>

        </div>
    );
};

export default Authentication;