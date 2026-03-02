// 1. Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');

    // 2. Listen for the "Submit" button click
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Stop the page from refreshing

        // 3. Extract data from the form fields
        const formData = new FormData(clientForm);
        const payload = Object.fromEntries(formData.entries());

        try {
            // 4. Send the data to Spring Boot
            const response = await fetch('http://localhost:8080/client', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json' // Crucial for @RequestBody
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Success! Client ${result.name} saved with ID: ${result.id}`);
                clientForm.reset(); // Clear the form
            } else {
                const errorData = await response.json();
                alert("Error saving client: " + (errorData.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Connection failed:", error);
            alert("Could not connect to the server. Is Spring Boot running?");
        }
    });
});