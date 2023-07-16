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

fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(this.state.input))
  .then(response => response.json())
  .then(result => console.log(result))
  .then(response => {

  })
  .catch(err => console.log(err));
