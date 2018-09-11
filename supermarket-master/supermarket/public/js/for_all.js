
$(function () {
  //determine if the user has logged in
  validateUser();

  $('.w3view-cart').click(function () {
    $(location).attr('href', '/checkout.html');
  });

  //for search button
  $('.search').click(function () {
    let search_content = $(this).prev().val();
    $(location).attr('href', '/product.html?search='+search_content);
    return false;
  });
});

function validateUser() {
  let mytoken = localStorage.getItem("mytoken");
  if(!mytoken)
    return;
  $.ajax({
    type: "POST",
    url: "/users/validate",
    headers:{'Authorization': 'bearer '+mytoken},
    success: function(data){
      $('.agile-login ul').html('<li><a href="/profile.html">Hello, ' + data.lastname + '</a></li>'
      + '<li><a href="javascript:quit();">退出登录</a></li>'
      );
    },
  });
}

function quit() {
  $.ajax({
    type: "GET",
    url: "/users/logout",
    headers:{'Authorization': 'bearer '+ localStorage.getItem("mytoken")},
    success: function(){
      localStorage.removeItem("mytoken");
      $(location).attr('href', '/');
    },
    error: function () {
     alert('退出失败');
    }
  });
}