import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ParticlesBg from 'particles-bg';
import './App.css';

const initialState = {
    input: '',
    imageUrl: '',
    box: {},
    route: 'signin',
    isSignedIn: false,
    user: {
        email: '',
        id: '',
        name: '',
        entries: 0,
        joined: ''
    }
};

class App extends Component {  
    constructor() {
        super();
        this.state = initialState;
    }

    calculateFaceLocation = (data) => {
        // console.log(data);
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
        }
    }

    loadUser = (data) => {
        this.setState({user: {
            email: data.email,
            id: data.id,
            name: data.name,
            entries: data.entries,
            joined: data.joined
        }});
    }

    displayFaceBox = (box) => {
        this.setState({box: box});
    }
    
    onInputChange = (event) => {
        this.setState({input: event.target.value});
    }

    /* onPictureSubmit = () => {
        this.setState({imageUrl: this.state.input});
        fetch('http://localhost:3001/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
        })
        .then(imageData => imageData.json())
        .then(imageData => {
            if (imageData) {
                console.log(imageData);
                fetch('http://localhost:3001/image', {
                    method: 'put',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        id: this.state.user.id
                    })
                })
                .then(response => response.json())
                .then(count => {
                    this.setState(Object.assign(this.state.user, { entries: count }))
                })
                .catch(console.log);
            }
            this.displayFaceBox(this.calculateFaceLocation(imageData));
        })
        .catch(err => console.log(err));
    } */

    onPictureSubmit = () => {
        this.setState({imageUrl: this.state.input});
        fetch("https://api.clarifai.com/v2/models/face-detection/outputs", returnClarifaiRequestOptions(this.state.input))
        .then(response => response.json())
        .then(response => {
            if (response) {
                console.log(response);
                fetch('http://localhost:3001/image', {
                    method: 'put',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        id: this.state.user.id
                    })
                })
                .then(response => response.json())
                .then(count => {
                    this.setState(Object.assign(this.state.user, { entries: count }))
                })
                .catch(console.log);
            }
            this.displayFaceBox(this.calculateFaceLocation(response));
        })
        .catch(err => console.log(err));
    }

    onRouteChange = (route) => {
        if (route === 'signout') {
            this.setState(initialState);
            return;
        } else if (route === 'home') {
            this.setState({isSignedIn: true})
        }
        this.setState({route: route});
    }
    
    render() {
        return (
            <div className="App">
                <ParticlesBg type="square" num={3} bg={true} />
                <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
                {
                    this.state.route === 'home' ?
                        <div>
                            <Logo />
                            <Rank userName={this.state.user.name} userEntries={this.state.user.entries} />
                            <ImageLinkForm onInputChange={this.onInputChange} onPictureSubmit={this.onPictureSubmit} />
                            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
                        </div>
                    :
                        (
                            this.state.route === 'signin' ?
                                <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                            :
                                <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                        )
                }
            </div>
        )
    }
}

const returnClarifaiRequestOptions = (imageUrl) => {
    
    // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '381fb3e3ac09431d8dd7144bfc46a05d';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'km1984';       
    const APP_ID = 'test';
    
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    return requestOptions;
}

export default App;
