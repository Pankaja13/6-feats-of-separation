import './App.css';
import { SpotifyAuth } from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css'
import SpotifyWebApi from "spotify-web-api-node";
import Cookies from 'js-cookie'
import {useEffect, useState} from "react";
import WelcomeMessage from "./components/WelcomeMessage";


function App() {

    const [token, setToken] = useState("")

    useEffect(()=>{
        setToken(Cookies.get('spotifyAuthToken'))
    },[])

    function Main(){
        return (
            <div>
                <WelcomeMessage token={token} expireToken={expireToken} />
                <button>
                    hello!
                </button>
            </div>
        )
    }

    let spotifyApi = new SpotifyWebApi()

    function expireToken() {
        setToken("")
    }

    return (
        <div className="App">
            <header className="App-header">
                {
                    token ?
                    <Main/> :
                    <SpotifyAuth
                        redirectUri={process.env.REACT_APP_URL}
                        clientID={process.env.REACT_APP_CLIENT_ID}
                        scopes={['user-read-private']}
                        onAccessToken={token => {
                            setToken(token);
                            spotifyApi.setAccessToken(token);
                        }}
                    />
                }
            </header>
        </div>
    )
}

export default App;
