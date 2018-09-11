$(function () {
  $('#login_submit').click(function login_submit() {
    $('#login_submit').unbind('click');
    $('#login_submit').click(function(){return false});
    let $inputs = $('.login-form-grids input');
    let username = $($inputs[0]).val();
    let password = $($inputs[1]).val();
    let submit_content = {username:username, password:password};
    $.ajax({
      type: "POST",
      url: "/users/login",
      data: submit_content,
      dataType: 'json',
      success: function(data){
        localStorage.setItem('mytoken', data.token);
        $(location).attr('href', '/checkout.html');
      },
      error:function () {
        alert('用户名或密码错误');
        $('#login_submit').click(login_submit);
      }
    });
    return false;
  });
});