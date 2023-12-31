const cron = require('node-cron');
const axios = require('axios');
const express = require("express");

const app = express();

const port = 4000;

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(express.json());
app.use(logger)
 
app.get('/', (req, res) => {

  // res.send('Welcome to Yews API')
})

const http = require('http');
const httpServer = http.createServer(app);

httpServer.listen(port, async () => {
  try {
    // Schedule the function to run at 10am, 3pm, and 8pm
    cron.schedule('0 10,15,20 * * *', () => {
        
      getDeviceIdList();
    }, {
      timezone: 'America/New_York' // Replace 'Your_Time_Zone' with your desired timezone (e.g., 'America/New_York')
    });
    
    getDeviceIdList()

    console.log('Scheduled tasks are set.');

  } catch (error) {
    console.log(error);
  }
  console.log(`App is Running on PORT ${port}`);
});

const fbAdmin = require('firebase-admin');

const serviceAccount = require('./yews-news-firebase-adminsdk.json');

fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(serviceAccount)
    // Add any other Firebase configuration options if needed
});


async function getDeviceIdList() {
   
  const db = fbAdmin.firestore();
  
  const collectionRef = db.collection('users');

  
  collectionRef.get()
    .then((snapshot) => {
        if (snapshot.empty) {
        console.log('No documents found.');
        return;
        }

        // Process each document
        snapshot.forEach((doc) => {
          console.log('Document ID:', doc.id);
          console.log('Document data:', doc.data().deviceId);

          sendPushNotification(doc.data().deviceId)
          
        });
    })
    .catch((error) => {
        console.error('Error fetching documents:', error);
    });
}

async function sendPushNotification(deviceId) {
    
  const url = 'https://fcm.googleapis.com/fcm/send';

  const headers = {
    'Content-Type': 'application/json', 
    'Authorization': 'Key=AAAAQPv5zbo:APA91bGwq-z_qkNd-Ia_VXpDiL-QKbQDUnsFVmaC82vFjj0O0PnfrgIxU1s55iguQw6pmAr0TdU7ltWB5452VGhVs9H7GnggAnvQ2nbIWhwVGxtuR47COACawpeViM64TM3Yi4-xwYIg'
  };

  const requestBody = {
    to: deviceId,//"/topics/all",
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

function logger(req, res, next) {
  console.log(req.originalUrl) 
  next()
}