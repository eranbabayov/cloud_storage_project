async function checkImage(file) {
    try {
        // Create a FormData object to send the file
        const formData = new FormData();
        formData.append('image', file);

        // API credentials
        const apiKey = 'acc_c4ce731bb14dcf7'; 
        const apiSecret = '8d833fd35787d0450fc558d13451d0f2';

        // Send the image to Imagga for validation
        const response = await fetch('https://api.imagga.com/v2/tags', {
            method: 'POST',
            headers: {
                'Authorization': 'Basic ' + btoa(`${apiKey}:${apiSecret}`),
            },
            body: formData
        });

        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Tags that indicate a face or face-related content
        const faceTags = new Set(['face', 'human']);

        // Check for face-related tags
        const tags = data.result.tags;
        const isFaceImage = tags.some(tag => faceTags.has(tag.tag.en.toLowerCase()));

        return isFaceImage;

    } catch (error) {
        console.error('Error checking image:', error);
        throw error;
    }
}
