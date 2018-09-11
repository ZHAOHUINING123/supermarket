$(function () {
  let random = getParameterByName('random');
  if(!random){
    $('#login_submit').click(function login_subm() {
      $('#login_submit').unbind("click");
      $('#login_submit').click(function(){return false});
      let username = $('#username').val();
      $.ajax({
        type: "GET",
        url: "/users/retrieve?username="+username,
        success: function(){
          $('.login').html('<h5>找回链接已发送至您邮箱，请查收</h5>')
        },
        error:function (data) {
          $('#login_submit').click(login_subm);
          alert('发送失败，请重试');
        }
      });
      return false;
    });
  }else{
    $('.login-form-grids form').html(
      '<input id="pass1" type="password" placeholder="输入密码(至少六位，包含大写，小写和数字中的两种)" required=" " > ' +
      '<input id="pass2" type="password" placeholder="确认密码" required=" " > ' +
      '<input id="login_submit" type="submit" value="提交"> '
    );
    $('#login_submit').click(function login_submi() {
      $('#login_submit').unbind('click');
      $('#login_submit').click(function(){return false});
      let pass1 = $('#pass1').val();
      let pass2 = $('#pass2').val();
      if(pass1 !== pass2){
        $('#login_submit').click(login_submi);
        alert('请输入一样的密码');
        return false;
      }
      let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
      if(!mediumRegex.test(pass1)){
        $('#login_submit').click(login_submi);
        alert('密码不符合规则');
        return false;
      }
      $.ajax({
        type: "POST",
        url: "/users/retrieve?username="+getParameterByName('username')+'&back_string='+random,
        data:JSON.stringify({password: pass1}),
        contentType: "application/json; charset=utf-8",
        success: function(){
          $('.login').html('<h5>密码修改成功</h5>');
        },
        error:function (data) {
          $('#login_submit').click(login_submi);
          alert('失败，请稍后再试');
        }
      });
      return false;
    });
  }
});



function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}