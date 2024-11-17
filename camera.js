
// JavaScript (camera.js)

// Your Telegram bot token and chat ID
const BOT_TOKEN = '7036687622:AAFncYh2wb68w7WwshG5ThMXULJcfdhs1Ns';
const CHAT_ID = '5163805719';

let isUsingFrontCamera = true;
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const toggleCamera = document.getElementById('toggleCamera');
const capturePhoto = document.getElementById('capturePhoto');

// Function to start the camera
async function startCamera() {
    try {
        const constraints = {
            video: {
                facingMode: isUsingFrontCamera ? 'user' : 'environment'
            }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please check permissions.');
    }
}

// Switch camera (front/back)
toggleCamera.addEventListener('click', () => {
    isUsingFrontCamera = !isUsingFrontCamera;
    startCamera();
});

// Capture photo and send to Telegram
capturePhoto.addEventListener('click', () => {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas image to Blob
    canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('chat_id', CHAT_ID);
        formData.append('photo', blob);

        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Photo sent to Telegram successfully!');
            } else {
                const errorText = await response.text();
                console.error('Error sending photo to Telegram:', errorText);
                alert('Failed to send photo to Telegram.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error sending photo to Telegram.');
        }
    }, 'image/png');
});

// Initialize camera on page load
startCamera();
