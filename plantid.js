function uploadAndIdentifyPlantID(){
    // Retrieve the photo from the frontend
      const photoInput = document.getElementById('photoInput');
    // If no photos are selected, it alerts the user to upload a photo
      if(photoInput.files.length === 0){
        alert("Please select a photo to upload.");
        return;
      }
      // select the first file from the files arrart of an input element
      const selectedFile = photoInput.files[0];
      // create a new file reader object so that we can read the contents of the file
      const reader = new FileReader ();
      // set up the event handler for the onload for the file reader Object
      // the onload event is triggered when the reading operation of the file is completed
      reader.onload = function (e) {
        // store the base64image in a variable
        const base64Image = e.target.result;
        console.log('base64Image',base64Image);
        // store all the variables for the API call
        // 12-27-24 attempt to change API key. Old one is in my notes.
        const apiKey = 'KC6CD5x3GdJEXZmoFSiudYey9db1zltyjvVilBXQejlFv27EMG';
        const latitude = 49.207;
        const longitude = 16.608;
        const health = 'all';
        const similarImages = true;
        const details = 'common_names,url,description,taxonomy,rank,gbif_id,inaturalist_id,image,synonyms,edible_parts,watering,propagation_methods,treatment,cause'
        const language = 'en';
        const apiUrlPlantID = `https://plant.id/api/v3/identification?details=${details}&language=${language}`;
       //Making the first API call with the base64 image
        axios.post(apiUrlPlantID,{
          "images": [base64Image],
          "latitude": latitude,
          "longitude": longitude,
          "health": health,
          "similar_images": similarImages
        },{
          headers: {
            "Api-Key": apiKey,
            "Content-Type": "application/json"
          }
        })
        //successful state of promise
        .then(function (response){
          console.info('Response from Plant ID API',response.data);
          displayPlantIDInfo(response.data,base64Image);
        })
        //error state of promise
        .catch(function(error) {
            alert(`Error: ${error}❌❌❌`);
            console.error('Error:',error);
        });
      };
    //Read the selected file as a data URL which is a base64 encoded representation of the file's content
      reader.readAsDataURL(selectedFile);
    }

function displayPlantIDInfo(plantIdResponse,base64Image){
    //============
    //VARIABLE TO STORE THE FIRST FUNCTION
    const plantIdClassification = plantIdResponse.result.classification;
    const plantIdDisease = plantIdResponse.result.disease;
    const plantIdIsHealthy = plantIdResponse.result.is_healthy;
    const plantIdIsPlant = plantIdResponse.result.is_plant;

    //=============
    //Plan Preview Image
    //Grab the preview image element from the front plantidentifier.html
    const previewImage = document.getElementById('previewImage');
    //Set the image HTML src attribute to the preview image we uploaded on the plantidentifier.html file
    previewImage.src = base64Image

    //============
    //PLANT NAME
    //grab the HTML for the plant title container
    const plantNameContainer = document.getElementById('plantNameContainer');//changed for a test, originally plant-name-container
    //create a new <p> tag element for plant title
    const plantNameElement = document.createElement('p');
    //add the name of the plant to the innerHTML of the <p> tag we created
    plantNameElement.innerhtml = `<strong> Name: </strong> ${plantIdClassification.suggestions[0].name}`
    //append the new div we created to the api result container that we grabbed from our html
    console.log(plantNameContainer)//temporary for debugging
    plantNameContainer.appendChild(plantNameElement);        

    //=======
    //SIMILAR IMAGE
    //Grab the similar image from the API Response
    const plantSimilarImage = plantIdClassification.suggestions[0].similar_images[0].url;    
    //grab the HTML where the image will be placed
    const similarImageHTML = document.getElementById('plant-similar-image');
    //set the image HTML src attribute to the image
    similarImageHTML.src = plantSimilarImage;

    //PROBABILITY
    //======
    //Grab the probability score info from the API response
    const probabilityOfPlant = plantIdClassification.suggestions[0].probability;
    //grab the HTML where the probability is going to be placed
    const probabilityNameContainer = document.getElementById('probability-container');
    //create a new <p> tag element for the probability text
    const probabilityNameElement = document.createElement('p');
    //add the probability text to the innerHTML of the new <p> tag created
    probabilityNameElement.innerHTML = `<strong> Probability: </strong> ${probabilityOfPlant}`
    //append the new div we created to the probability
    probabilityNameContainer.appendChild(probabilityNameElement);
    
    //=========
    //IS PLANT?
    //grab the 'is plant' boolbean value from API
    const isPlant = plantIdIsPlant.binary;
    //grab the HTML where the plant boolean will be placed
    const isPlantContainer = document.getElementById('isPlant-container');
    //create a new <p> tag element for the is plant boolean
    const isPlantElement = document.createElement('p');
    //check if user's image is a plant or not (ask question later!) If not, alert the user; this uses an if - else statement
    if (isPlant===false) {
        alert('Your picture has no identified plant ❌🪴❌. Please try another!');
        //reload the page
        window.location.reload();
}
//add the boolean test to the innerHTML of the new p tag we made
isPlantElement.innerHTML = `<strong>Is Plant: </strong> ${isPlant}`;
//append the new div we created to isPlantcontainer we made
isPlantContainer.appendChild(isPlantElement);

    //========
    //Common Name
    //grab the first common name from the API response
    const commonName = plantIdClassification.suggestions[0].details.common_names[0];
    //grab the HTML where the common name will be place
    const commonNameContainer = document.getElementById('common-name-container');
    //create a new p tag element for the common name text
    const commonNameElement = document.createElement('p');
    //add the common name text to the inner html of the new p tag we made
    commonNameElement.innerHTML = `<strong>Common Name:</strong> ${commonName}`;
    //append the new div? we made to the commonNameContainer
    commonNameContainer.appendChild(commonNameElement);

    //====
    //Description
    //====
    //Grab value from API Response
    const plantDescription = plantIdClassification.suggestions[0].details.description.value;
    //Grab container from front end
    const descriptionContainer = document.getElementById('description-container');
    //create new p element for the description text
    const descriptionElement = document.createElement('p');
    //add the description text to the inner html of the new p tag we made
    descriptionElement.innerHTML = `<strong> Description: </strong> ${plantDescription}`;
    //append new div we made to the container grabbed from our html
    descriptionContainer.appendChild(descriptionElement);


    //====
    //Plant health status
    //====
    //Grab value from API Response
    const plantHealthStatus = plantIdIsHealthy.binary;
    //grab container from front end
    const plantHealthStatusContainer = document.getElementById('plant-health-status-container');
    //create a new p tag elelement for the planthealthstatus container
    const plantHealthStatusElement = document.createElement('p');
    //add the text the inner element of this new p
    plantHealthStatusElement.innerHTML = `<strong> Is Plant Healthy? </strong> ${plantHealthStatus}`;
    //append new div to container we grabbed from our html
    plantHealthStatusContainer.appendChild(plantHealthStatusElement);

    //====
    //Similar Image with disease
    //====
    //Grab similar image from from API Response
    const plantSimilarImageWithDisease = plantIdDisease.suggestions[0].similar_images[0].url;
    //grab the html? where image will be place
    const similarImageWithDiseaseHTML = document.getElementById('plant-similar-image-with-disease');
    //set html source attribute
    similarImageWithDiseaseHTML.src = plantSimilarImageWithDisease;
  
    //===
    //Disease name
    //==
    //grab value from api reply
    const plantDiseaseName = plantIdDisease.suggestions[0].name;
    //grab container from front
    const plantDiseaseNameContainer = document.getElementById('plant-disease-name-container');
    //create new p
    const plantDiseaseNameElement = document.createElement('p');
    //add text to inner html of new p
    plantDiseaseNameElement.innerHTML = `<strong> Disease: </strong> ${plantDiseaseName}`;
    //append new div to the container from our html
    plantDiseaseNameContainer.appendChild(plantDiseaseNameElement);

    //========
    //Disease Probability
    //=======
    //Grab value from API response
    const plantDiseaseProbability = plantIdDisease.suggestions[0].probability;
    //Grab container from the front end HTML
    const plantDiseaseProbabilityContainer = document.getElementById('plant-disease-probability');    
    // create a new <p> tag element
    const plantDiseaseProbabilityElement = document.createElement('p');
    // add text to the innerHTML of our newly made <p> tag
    plantDiseaseProbabilityElement.innerHTML = `<strong>Disease Probability:</strong> ${plantDiseaseProbability}`;
    // append the new div we created to the container we grabbed from our html
    plantDiseaseProbabilityContainer.appendChild(plantDiseaseProbabilityElement);    

    //=====
    //Disease Description
    //=====
    // Grab value from API response
    const plantDiseaseDescription = plantIdDisease.suggestions[0].details.description;//changed from details.treatment;
    // Grab container from the front end HTML
    const plantDiseaseDescriptionContainer = document.getElementById('plant-disease-treatment');
    //create a new <p> tag element
    const plantDiseaseDescriptionElement = document.createElement('p');
    //add test to the innerHTML of out newly made <p> tag
    console.log(plantDiseaseDescription)
    plantDiseaseDescriptionElement.innerHTML = `<strong>Disease Description:</strong> ${plantDiseaseDescription}`;//${plantDiseaseDescription}removed!
    //append the new div we created to the container we grabbed from our html
    plantDiseaseDescriptionContainer.appendChild(plantDiseaseDescriptionElement);

    //===========
    //Disease Treatment [Using a loop in the api for treatments!]
    //===========
    //Grab value from API response
    const plantDiseaseTreatment = plantIdDisease.suggestions[0].details.treatment;
    //Grab container from the front end HTML
    const plantDiseaseTreatmentContainer = document.getElementById('plant-disease-treatment');
    // create a new <p> tag element
    const plantDiseaseTreatmentElement = document.createElement('p');

    // Do a check; if the plant is dead and the object is empty we tell the user that there is no treatment available for dead plants
    if (Object.keys(plantDiseaseTreatment).length === 0) {
        // add text to the innerHTML of the new <p> tag we created
        plantDiseaseTreatmentElement.innerHTML = `<strong>Disease Treatment:</strong> There database knows no present treatment for this plant`;
        //append the newly created did to the container grabbed from our html
        plantDiseaseTreatmentContainer.appendChild(plantDiseaseTreatmentElement);
    }
    
    // loop through the object aand map keys to values
    // then attach them to the HTML container
    for (const key in plantDiseaseTreatment) {
      // if the object has a key value pair
      if (plantDiseaseTreatment.hasOwnProperty(key)) {
        // create a variable and store the value of each key on each iteration
        const plantDiseaseTreatmentValues = plantDiseaseTreatment[key].map(value => `<li>${value}</li>`).join('');
        // create a variable that matches the key with the values, then wrap them in HTML
        const plantDiseaseTreatmentText = `<strong>Disease Treatment ${key}:</strong> <ul>${plantDiseaseTreatmentValues}</ul>`;
        // append the text of the key value pairs into the HTML container
        plantDiseaseTreatmentContainer.innerHTML += plantDiseaseTreatmentText;
      }  
    }
}
//const uploadButton = document.getElement