
const functions = require("firebase-functions");
const nodemailer = require('nodemailer');

//when this cloud function is already deployed, change the origin to 'https://your-deployed-app-url
const cors = require('cors')({ origin: true });

//create and config transporter
// let transporter = nodemailer.createTransport({
//     host: "smtp.mailtrap.io",
//     port: 2525,
//     secure: false, // true for 465, false for other ports
//     auth: {
//         user: "6a829f7e1de5d9",
//         pass: "5f3fcb76aa7d1d"
//     }
// });

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    },
});

//export the cloud function called `sendEmail`
exports.sendEmail = functions.https.onRequest((req, res) => {
    //for testing purposes
    console.log(
        'from sendEmail function. The request object is:',
        JSON.stringify(req.body)
    );

    //enable CORS using the `cors` express middleware.
    cors(req, res, () => {
        //get contact form data from the req and then assigned it to variables
        const email = req.body.data.email;
        const name = req.body.data.name;
        const message = req.body.data.message;

        //config the email message
        const mailOptions = {
            from: email,
            to: `sample@gmail.com`,
            subject: 'New message from the nodemailer-form app',
            text: `${name} says: ${message} from ${email}`,
        };

        //call the built in `sendMail` function and return different responses upon success and failure
        return transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).send({
                    data: {
                        status: 500,
                        message: error.toString(),
                    },
                });
            }

            return res.status(200).send({
                data: {
                    status: 200,
                    message: 'sent',
                },
            });
        });
    });
});
