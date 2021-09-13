const sgMail = require('@sendgrid/mail');

const sendMail = ({to, subject, html}) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
        to: to,
        from: 'furbox@gmail.com',
        subject: subject,
        html: html,
    }

    return sgMail
        .send(msg)
        .then(() => {
            //Celebrate
            console.log('Email Sent!');
        })
        .catch(error => {

            //Log friendly error
            console.error('Error1',error.toString());
            //console.log(output)

            //Extract error msg
            const { message, code, response } = error;
            console.error('Error2',message);
            console.error('Error3',code);
            //Extract response msg
            // const { headers, body } = response;
            // console.error('Error4',headers);
            // console.error('Error5',body);
        });
}

module.exports = { sendMail }