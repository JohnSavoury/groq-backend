<?php
// Get the raw POST data (sent by the JavaScript fetch request)
$data = file_get_contents('php://input');

// Decode the JSON data into an associative array
$sentences = json_decode($data, true);

// Check if the data is valid
if (is_array($sentences)) {
    // Loop through each category and create a .txt file for each
    foreach ($sentences as $key => $sentenceText) {
        // Sanitize the filename to ensure it's safe
        $fileName = $key . '.txt';

        // Save the sentences as plain text
        file_put_contents($fileName, $sentenceText);
    }

    echo "Sentences saved successfully!";
} else {
    echo "Invalid data!";
}
?>