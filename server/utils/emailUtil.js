const sgMail = require('@sendgrid/mail')

module.exports = class EmailHelper {
    
    static get WAITING_TIME(){
        return 10000;
    }

    static isEmailRequired(emailCode, emailTimestamp){
        const elapsedTime = Date.now()-emailTimestamp;
        return emailCode && elapsedTime > this.WAITING_TIME;
    }

    static sendEmail = (email, reqSession) => {
        const emailCode = Math.floor(100000 + Math.random() * 900000);
        const msg = {
            to: email, // Change to your recipient
            from: 'shivamsharma151999@gmail.com', // Change to your verified sender
            subject: 'Please verify your email address',
            html: ` <html>
                    <body>
                        <p> Hi, </p>
                        <p> To complete your signup, please verify your email: <p>
                        <p> <strong> ${emailCode} </strong> </p>
                        <p> Thank you, </p>
                        <p> Bankers </p>
                    <body>
                    <html>`,
        }
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
        return [emailCode, Date.now()];
    }
}