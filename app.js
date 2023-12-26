const cron = require('node-cron');
const axios = require('axios');


async function getDeviceIdList() {
    const fbAdmin = require('firebase-admin');

    // Replace with your Firebase service account credentials JSON file path
    const serviceAccount = require('./yews-news-firebase-adminsdk.json');

    // Initialize Firebase Admin SDK
    fbAdmin.initializeApp({
        credential: fbAdmin.credential.cert(serviceAccount)
        // Add any other Firebase configuration options if needed
    });

        // Get a Firestore reference
    const db = fbAdmin.firestore();

    // Fetch data from a Firestore collection
    const collectionRef = db.collection('users');

    // Retrieve documents from the collection
    collectionRef.get()
    .then((snapshot) => {
        if (snapshot.empty) {
        console.log('No documents found.');
        return;
        }

        // Process each document
        snapshot.forEach((doc) => {
        console.log('Document ID:', doc.id);
        console.log('Document data:', doc.data());
        });
    })
    .catch((error) => {
        console.error('Error fetching documents:', error);
    });
}

async function sendPushNotification() {
    
  const url = 'https://fcm.googleapis.com/fcm/send';

  const headers = {
    'Content-Type': 'application/json', 
    'Authorization': 'Key=AAAAQPv5zbo:APA91bGwq-z_qkNd-Ia_VXpDiL-QKbQDUnsFVmaC82vFjj0O0PnfrgIxU1s55iguQw6pmAr0TdU7ltWB5452VGhVs9H7GnggAnvQ2nbIWhwVGxtuR47COACawpeViM64TM3Yi4-xwYIg'
  };

  const requestBody = {
    to: "/topics/all",//"c5k2G4ge_vJVbX78hpEj26:APA91bHDYA6iPMZ0tQMtSOcBKAX1pKjJs8oQscP7jmaDZwMZ43HCUDNgsrZ6c2Y7ExCMdz0xyx2zwpyPmhki5Ngm-juRiX9TTQco8nLbLIjm4HEFghOaDwwg_wPsM66E5rs1voLLSmUU",
    notification: {
        title: "Notification",
        body: "It’s 3pm, come check out the latest news on Yews News!"
    }
  };

  try {
    const response = await axios.post(url, requestBody, { headers });

    console.log('HTTP Request Sent!');
    console.log('Status:', response.status);
    console.log('Response Data:', response.data);
  } catch (error) {
    console.error('Error Sending HTTP Request:', error.message);
    if (error.response) {
      console.error('Response Status:', error.response.status);
      console.error('Response Data:', error.response.data);
    }
  }
}


sendPushNotification()

// Schedule the function to run at 10am, 3pm, and 8pm
cron.schedule('0 10,15,20 * * *', () => {
    
  sendPushNotification();
}, {
  timezone: 'America/New_York' // Replace 'Your_Time_Zone' with your desired timezone (e.g., 'America/New_York')
});


console.log('Scheduled tasks are set.');
