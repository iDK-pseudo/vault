const sgMail = require("@sendgrid/mail");

module.exports = class EmailHelper {
    static get WAITING_TIME_A() {
        return 60000;
    }

    static get WAITING_TIME_B() {
        return 300000;
    }

    static get WAITING_TIME_C() {
        return 600000;
    }

    static isEmailRequired({ code, duration, timestamp, retries }) {
        const elapsedTime = Date.now() - timestamp;
        return retries < 2 && code && elapsedTime > duration;
    }

    static sendEmail = (email, session) => {
        const emailCode = Math.floor(100000 + Math.random() * 900000);
        const msg = {
            to: email, // Change to your recipient
            from: "shivamsharma151999@gmail.com", // Change to your verified sender
            subject: "Please verify your email address",
            html: ` <html>
                    <body>
                        <p> Hi, </p>
                        <p> To complete your signup, please verify your email: <p>
                        <p> <strong> ${emailCode} </strong> </p>
                        <p> Thank you, </p>
                        <p> Bankers </p>
                    <body>
                    <html>`,
        };
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        // sgMail
        // .send(msg)
        // .then(() => {
        //     console.log('Email sent')
        // })
        // .catch((error) => {
        //     console.error(error)
        // })
        console.log(emailCode);
        if (!session) {
            return {
                code: emailCode,
                duration: this.WAITING_TIME_A,
                retries: 0,
                timestamp: Date.now(),
            };
        } else {
            let duration = "24h",
                retries = Number.parseInt(session.retries) + 1;
            if (retries === 1) {
                duration = this.WAITING_TIME_B;
            } else if (retries === 2) {
                duration = this.WAITING_TIME_C;
            }
            return {
                code: emailCode,
                duration: duration,
                retries,
                timestamp: Date.now(),
            };
        }
    };
};
