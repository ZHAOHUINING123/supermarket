const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: '<host>',
  port: <port>,
  secure: false,
  auth: {
    user: '<username>', // generated ethereal user
    pass: '<password>' // generated ethereal password
  }
});



function getOptaion(receiver, type, back){
  if(type === 'signup'){
    let mailOptions = {
      from: '<from>',
      to: receiver,
      subject: '欢迎注册',
      text: '尊敬的' + receiver + '， 欢迎来到超市'
    };
    return mailOptions;
  }
  else if(type === 'order'){
    let mailOptions = {
      from: '<from>',
      to: receiver,
      subject: '您的订单',
      text: '尊敬的' + receiver + '， 购买成功， 您可以登陆 http://49.51.137.167:3001/profile.html?action=orders' +
      '查看您的订单'
    };
    return mailOptions;
  }
  else if(type === 'back'){
    let mailOptions = {
      from: '<from>',
      to: receiver,
      subject: '找回密码',
      text: '尊敬的' + receiver + '，打开 http://49.51.137.167:3001/retrieve.html?username=' + receiver + '&random='+back
    };
    return mailOptions;
  }
}

module.exports = {
  transporter,
  getOptaion
};