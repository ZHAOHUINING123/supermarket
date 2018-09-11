let sinchClient;
let verification;
$(function () {
  //获取验证码
  $('#obtain_validation').click(function clickevent() {
    $('#obtain_validation').unbind('click');
    $('#obtain_validation').click(function(){return false});
    let phone = $($('.login-form-grids input')[2]).val();
    let phone_check = /^[0]?[12378]\d{8,9}$/;
    if(!phone || !phone_check.test(phone)){
      alert('请正确输入手机号');
      return false;
    }
    sinchClient = new SinchClient({applicationKey: '<please register a account in Sinch by yourself>'});
    verification = sinchClient.createSmsVerification('+44'+phone);
    verification.initiate(function () {
      $('#obtain_validation').html('已发送，请稍后');
      setTimeout(function(){
        $('#obtain_validation').html('重新发送');
        $('#obtain_validation').click(clickevent);
      },  5000);

    }, function () {
      alert('验证短信发送失败，请重试');
      $('#obtain_validation').click(clickevent);
    });
    return false;
  });
  //add event for clicking register button
  $('#register_submit').click(function register_submit() {
    $('#register_submit').unbind('click');
    $('#register_submit').click(function(){return false});
    let $inputs = $('.login-form-grids input');
    let firstname = $($inputs[0]).val();
    let lastname = $($inputs[1]).val();
    let phone = $($inputs[2]).val();
    let validation = $($inputs[3]).val();
    let username = $($inputs[4]).val();
    let password1 = $($inputs[5]).val();
    let password2 = $($inputs[6]).val();
    if(!checkValidation(firstname, lastname, phone, username, password1, password2))
      return false;
    let submit_content = {
      firstname:firstname,
      lastname: lastname,
      phone: phone,
      username: username,
      password: password1
    };

    verification.verify(validation, function () {
      $.ajax({
        type: "POST",
        url: "/users/signup",
        data: submit_content,
        dataType: 'json',
        success: function(data){
          $('.register').html('<h5 id="suc">注册成功，请登陆</h5>');
          setTimeout(function () {
            $(location).attr('href', '/login.html');
          }, 2000);
        },
        error:function (data) {
          alert(JSON.parse(data.responseText).err.message);
          $('#register_submit').click(register_submit);
        }
      });
      return false;
    }, function () {
      $('#register_submit').click(register_submit);
      alert('验证码错误');
      return false;
    });
    return false;
  });
});

function checkValidation(firstname, lastname, phone, username, password1, password2) {
  if(!firstname || !lastname || !phone || !username || !password1 || !password2){
    alert('请填写所有项');
    return false;
  }
  let email_check = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(!email_check.test(username)){
    alert('请正确填写email');
    return false;
  }
  let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
  if(!mediumRegex.test(password1)){
    alert('密码不符合规则');
    return false;
  }
  if(password1 !== password2){
    alert('两次密码不一样');
    return false;
  }
  if(!$("input[type='checkbox'][name='checkbox']").is(':checked')){
    alert('请同意服务条款');
    return false;
  }

  return true;
}