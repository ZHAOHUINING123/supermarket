$(function () {
  $('#add_submit').click(function() {
    $('#add_submit').unbind('click');
    $('#add_submit').click(function(){return false});
    let $inputs = $('.login-form-grids input');
    let address_line1 = $($inputs[0]).val();
    let address_line2 = $($inputs[1]).val();
    let city = $($inputs[2]).val();
    let postcode = $($inputs[3]).val();
    let phone = $($inputs[4]).val();
    let fullname = $($inputs[5]).val();
    if(!(address_line1&&city&&postcode&&phone&&fullname)){
      alert('请填写所有必填项');
      return false;
    }
    let submit_content = {address_line1:address_line1, address_line2:address_line2,
    city:city, postcode:postcode, phone:phone, fullname:fullname};
    console.log(submit_content);
    $.ajax({
      type: "POST",
      url: "/users/add_address",
      data: submit_content,
      dataType: 'json',
      headers:{'Authorization': 'bearer '+ localStorage.getItem("mytoken")},
      success: function(){
        window.location.href = document.referrer;
      },
      error:function () {
        alert('请先登录');
        $(location).attr('href', '/login.html');
      }
    });
    return false;


  });
});