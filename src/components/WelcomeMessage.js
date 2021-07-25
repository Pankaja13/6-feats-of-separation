import {useEffect, useState} from "react";
import SpotifyWebApi from "spotify-web-api-node";


function WelcomeMessage(props) {
    const [username, setUsername] = useState();

    useEffect(()=>{
        let spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(props.token);
        spotifyApi.getMe().then(
            data=>{
                setUsername(data.body.display_name);
            },
            error=>{
                if (error.body.error.status === 401) {
                    props.expireToken()
                }
            }
        );
    })

    return <h1> Hello, {username}! </h1>

}

export default WelcomeMessage;