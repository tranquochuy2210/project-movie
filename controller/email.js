const sgMail = require('@sendgrid/mail')

sgMail.setApiKey('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')

const payEmail = (email, name,id) => {
    
    sgMail.send({
        to: email,
        from: 'tranquochuy221096@gmail.com',
        subject: 'payment success !',
        text: `Welcome to the cinema, ${name}. your order for ticket ${id} get paid successfully.`
    })
}



module.exports = {
    payEmail
}