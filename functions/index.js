const functions = require('firebase-functions');
const admin = require('firebase-admin');
// var firebase = require('firebase').initializeApp({
//     serviceAccount: "./ChatBox-728bb1a30fb6.json",
//     databaseURL: "https://chatbox-ce822.firebaseio.com"
// });


// var ref = firebase.database().ref().child('user_master');


admin.initializeApp(functions.config().firebase);
// admin.initializeApp({
//     credential: admin.credential.applicationDefault(),
//     databaseURL: 'https://chatbox-ce822.firebaseio.com/'}
// );
exports.chatBoxFactory = functions.database.ref('message_master/{id}').onWrite(evt => {
    console.log(evt);
    const user_id = evt.after._data['receiver_id'];
    const sender_id = evt.after._data['sender_id'];
    // var sender_name;
    //      admin.database().ref('user_master').orderByChild('user_id').equalTo(sender_id).once("value").then(
    //         abc => {
    //             //var d = abc.val();
    //             const senderData = Object.values(abc.val());
    
    //             sender_name = senderData[0]['user_name'];
    
    //         });

      
    return admin.database().ref('user_master').orderByChild('user_id').equalTo(user_id).once("value").then(user =>  {
        
        console.log('token available');
       // var d = user.val();
        const token = Object.values(user.val());
        const tokenOne = token[0]['user_token'];
        const payload = {
            notification: {
                title: "You have a new message",
                body: evt.after._data['message_text'],
                badge: '1',
                sound: 'default'
            }
        };

        return admin.messaging().sendToDevice(tokenOne, payload);

    });
});




// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);

// exports.helloWorld = functions.database.ref('message_master/{id}').onWrite(evt => {
//     console.log(evt);
//     const user_id = evt.after._data['receiver_id'];
//     const payload = {
//         notification: {
//             title: evt.after._data['message_text'],
//             body: evt.after._data['message_text'],
//             badge: '1',
//             sound: 'default'
//         }
//     };
//     const token;
//     await functions.database().ref('user_master').orderByChild('user_id').equalTo(user_id).once().then(
//         user => {
//             if (user.val()) {
//                 console.log('User Available');
//                 token = user.after._data['user_token'];
//             }
//             return null;
//         }

//     )

//     return admin.database().ref('fcm-token').once('value').then(allToken => {
//         if (allToken.val()) {
//             console.log('token available');
//             //const token = Object.keys(allToken.val());
//             return admin.messaging().sendToDevice(token, payload);
//         } else {
//             console.log('No token available');
//             return null;
//         }
//     });
// });