import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import {Button, Container} from "@material-ui/core";
import SpotifyWebApi from "spotify-web-api-node";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        marginBottom: '2rem'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10,
    }
}));

export default function ArtistInput(props) {
    const classes = useStyles();

    const [searchString, setSearchString] = useState("")
    const [artistResults, setArtistResults] = useState([])

    function search(e) {
        e.preventDefault();
        let spotifyApi = new SpotifyWebApi();
        spotifyApi.setAccessToken(props.token);
        spotifyApi.searchArtists(searchString).then(data=>{
            // noinspection JSUnresolvedVariable
            setArtistResults(data.body.artists.items)
        })
    }

    return (
        <Container maxWidth="sm">
            <Paper component="form" className={classes.root}>
                <InputBase
                    className={classes.input}
                    placeholder="Search Artists"
                    onChange={(event)=>setSearchString(event.target.value)}
                />
                <IconButton onClick={search} className={classes.iconButton} type={"submit"}>
                    <SearchIcon />
                </IconButton>
            </Paper>
            <Container>
                {
                    artistResults.map(artist =>
                        <Button
                            key={artist.id}
                            onClick={()=>props.setArtistID({"name": artist.name, "id":artist.id})}
                        > {artist.name} </Button>
                    )
                }
            </Container>
        </Container>
    );
}
