function GenderChange(selectElement) {
    const gender = selectElement.value;
    const pregnancySelect = document.getElementById('pregnancy-select');
    const NursingSelect = document.getElementById('nursing-select');

    // Show the pregnancy dropdown only if the gender is Female
    if (gender === 'Male') {
        pregnancySelect.disabled = true; // Disable the pregnancy dropdown
        pregnancySelect.value = ""; // Reset to the default option
        NursingSelect.disabled = true;
        NursingSelect.value = ""; // Reset to the default option
    } else {
        pregnancySelect.style.display = 'block'; // Show the pregnancy dropdown
        pregnancySelect.disabled = false; // Enable the pregnancy dropdown
        NursingSelect.style.display = 'block'; // Show the pregnancy dropdown
        NursingSelect.disabled = false; // Enable the pregnancy dropdown
    }
}

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

async function checkNewImage(event) {
    // Get the file from the input element
    const file = event.target.files[0];
    // Check if a file is selected
    if (file) {
        try {
            // Wait for the checkImage function to complete
            const result = await checkImage(file);
            if (!result) {
                alert("You inserted a wrong face image! Please change the image.");
                
                // Clear the image input
                event.target.value = '';
            }

        } catch (error) {
            console.error("Error checking image:", error);
        }
    }
}

function calculateAge() {
    const birthdateInput = document.getElementById('birthdate').value;
    const birthdate = new Date(birthdateInput);
    const now = new Date();
    
    if (!birthdateInput) {
        document.getElementById('age-display').textContent = 'Age: ';
        return;
    }

    let ageMonths = (now.getFullYear() - birthdate.getFullYear()) * 12;
    ageMonths -= birthdate.getMonth();
    ageMonths += now.getMonth();

    const ageYears = Math.floor(ageMonths / 12);
    const remainingMonths = ageMonths % 12;

    document.getElementById('age-display').textContent = `Age: ${ageYears}.${remainingMonths}`;
}  

// Set the max attribute for the date input to prevent selecting future dates
document.addEventListener('DOMContentLoaded', function() {
    const birthdateInput = document.getElementById('birthdate');
    const today = new Date().toISOString().split('T')[0];
    birthdateInput.setAttribute('max', today);
});