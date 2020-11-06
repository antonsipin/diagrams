const nodemailer = require("nodemailer");

const renderSendMailForm = (req, res) => {
  res.render('testMail')
}

const sendMail = async (req, res) => {

  let src = req.body.src
  console.log('src>>>>>>>>>>>>>>>', src);

  
  let transporter = nodemailer.createTransport({
    host: "smtp.mail.ru",
    port: 465,
    secure: true,
    auth: {
      user: process.env.mailuser,
      pass: process.env.mailpassword
    },
  });

  let info = await transporter.sendMail({
    from: `"From Travel Budget" <${process.env.mailuser}>`,
    to: "testabc.testabc@mail.ru",
    subject: "Here is your report ✔",
    text: "Here is your report",
    html: `<p>Click <a href="${src}' + '">here</a> Here is your report</p>`
  });

res.redirect('/account')

}

module.exports = {
  renderSendMailForm,
  sendMail
}
