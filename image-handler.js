document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('patient-select').addEventListener('change', function () {
        const patientId = this.value;
        if (patientId) {
            fetch(`/patient/get_patient_image/${patientId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Image not found');
                    }
                    return response.blob(); // Handle response as a blob
                })
                .then(blob => {
                    const imgElement = document.getElementById('patientImage');
                    imgElement.src = URL.createObjectURL(blob); // Create a URL for the blob
                    document.getElementById('patientImageContainer').style.display = 'flex'; // Show the image container
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert(error.message); // Display the error message
                });
        } else {
            document.getElementById('patientImageContainer').style.display = 'none'; // Hide the image container if no patient is selected
        }
    });
});