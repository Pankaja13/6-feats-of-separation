import SpotifyWebApi from "spotify-web-api-node";
import {useEffect, useState} from "react";
import { Graph } from "react-d3-graph";

export default function ArtistGraph(props) {
    const filterRemixes = process.env.REACT_APP_FILTER_REMIXES === "true";
    const myConfig = {
        node: {
            color: "lightgreen",
            size: 120,
            highlightStrokeColor: "blue",
        },
        link: {
            highlightColor: "lightblue",
            labelProperty: "label",
            renderLabel: true

        },
    };
    const [data, setData] = useState({});


    useEffect(()=>{
        let spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(props.token);

        function getAlbums(artistID) {
            let allAlbumIDs = [];
            let offset = 0

            return new Promise((resolve, reject) => {
                function getAlbum(){
                    try {
                        spotifyApi.getArtistAlbums(artistID, {offset: offset, limit: 50}).then(data=>{
                            let albumIDs = data.body.items.map((data)=> data.id)
                            allAlbumIDs = allAlbumIDs.concat(albumIDs);
                            if (data.body.next) {
                                offset += 50;
                                getAlbum();
                            } else {
                                resolve(allAlbumIDs);
                            }
                        })
                    } catch (e){
                        reject(e)
                    }
                }
                getAlbum();
            })
        }

        async function getTracks() {
            let allTracks = {};
            let queue = [];

            const albumIDs = await getAlbums(props.artistID);

            for (let i = 0; i < albumIDs.length; i++) {
                queue.push(albumIDs[i]);
                if (queue.length === 20 || albumIDs.length - 1 === i) {
                    const data = await spotifyApi.getAlbums(queue)
                    queue = [];
                    const albums = data.body.albums;
                    for (let j = 0; j < albums.length; j++) {
                        const album = albums[j];
                        for (let k = 0; k < album.tracks.items.length; k++) {
                            const track = album.tracks.items[k];
                            const trackName = track.name;


                            let artists = {};
                            for (let l = 0; l < track.artists.length; l++) {
                                let artistID = track.artists[l].id;
                                artists[artistID] = track.artists[l].name;
                            }


                            if (artists.hasOwnProperty(props.artistID) && Object.keys(artists).length >= 2) {
                                if (!(trackName.includes("Remix") && filterRemixes)){
                                    allTracks[trackName] = artists;
                                }
                            }
                        }
                    }
                }
            }
            console.log(allTracks);
            setData({
                nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
                links: [
                    { source: "Harry", target: "Sally" },
                    { source: "Harry", target: "Alice" },
                ],
            })
        }

        getTracks().then();
    }, [props])

    return (
        <Graph id="graph-id" data={data} config={myConfig}/>
    )
}