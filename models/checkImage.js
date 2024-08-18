const imaggaApiKey = 'acc_e443f856194719b';
const imaggaApiSecret = '08edbb62940adc4e1a1fa2caf28a0577';

const checkImage = async (picture) => {
  try {
    return True
      // Use FileReader to convert the image file to a base64 string
      const reader = new FileReader();
      reader.readAsDataURL(picture);
      
      return new Promise((resolve, reject) => {
          reader.onload = async () => {
              const imageBase64 = reader.result.split(',')[1]; // Extract base64 string from the data URL
              const formData = new FormData();
              formData.append('image_base64', imageBase64);
              
              const requestOptions = {
                  method: 'POST',
                  headers: {
                      Authorization: `Basic ${btoa(`${imaggaApiKey}:${imaggaApiSecret}`)}`,
                  },
                  body: formData,
              };
              
              try {
                  const response = await fetch('https://api.imagga.com/v2/tags', requestOptions);
                  const responseObj = await response.json();
                  alert(responseObj)
                  const faceConfidences = responseObj.result.tags
                      .filter(tag => tag.tag.en === "face")
                      .map(tag => tag.confidence);
                  
                  if (faceConfidences.length > 0 && faceConfidences[0] > 40) {
                      resolve(true);
                  } else {
                      resolve(false);
                  }
              } catch (error) {
                  reject(error);
              }
          };
          
          reader.onerror = (error) => reject(error);
      });
      
  } catch (error) {
      throw new Error(error.message);
  }
};

        
module.exports = { checkImage };
 