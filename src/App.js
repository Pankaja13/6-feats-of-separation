import './App.css';
import {SpotifyAuth} from 'react-spotify-auth'
import 'react-spotify-auth/dist/index.css'
import SpotifyWebApi from "spotify-web-api-node";
import Cookies from 'js-cookie'
import {useEffect, useState} from "react";
import WelcomeMessage from "./components/WelcomeMessage";
import ArtistInput from "./components/ArtistInput";
import {Container} from "@material-ui/core";
import ArtistDisplay from "./components/ArtistDisplay";
import ArtistGraph from "./components/ArtistGraph";



function App() {

    const [token, setToken] = useState("")
    const [artist, setArtist] = useState({"name": "", "id": ""});

    useEffect(()=>{
        setToken(Cookies.get('spotifyAuthToken'))
    },[token])

    function Main(){

        return (
            <Container>
                <WelcomeMessage token={token} expireToken={expireToken} />
                <ArtistInput token={token} setArtistID={setArtist} />
                {artist.name &&
                <Container>
                    <ArtistDisplay artistName={artist.name} />
                    <ArtistGraph artistID={artist.id} token={token} />
                </Container>
                }
            </Container>
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
                                window.location.href = process.env.REACT_APP_URL;
                            }}
                        />
                }
            </header>
        </div>
    )
}

export default App;
