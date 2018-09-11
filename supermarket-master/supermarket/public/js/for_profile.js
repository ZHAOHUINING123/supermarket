$(function () {
  let action = getParameterByName('action');
  if(action === 'change_password'){
    $('.products-right').html('');
    change_password();
  }else if(action === 'orders'){
    $('.products-right').html('');
    show_orders();
  }else if(action === 'change_address'){
    $('.products-right').html('');
    change_address();
  }
});

function change_address(){
  $('.products-right').html(
    '<div id="add_address"><a href="/change_address.html">添加地址</a></div>'+
    '<table class="timetable_sub">'+
    '<thead>'+
    '<tr>'+
    '<th>地址</th>'+
    '<th>删除</th>'+
    '</tr>'+
    '</thead>'+
    '<tbody>'+
    '</tbody>'+
    '</table>'
  );
  $.ajax({
    type: "GET",
    url: "/users/get_address",
    headers:{'Authorization': 'bearer '+ localStorage.getItem("mytoken")},
    success: function(data){
      data.forEach(function (item, index) {
        $('tbody').append(
          '<tr class="rem' + index + '">'+
          '<td class="invert">'+ item.fullname + ' &nbsp;&nbsp;'+
          item.address_line1 + ' &nbsp;&nbsp;' + item.address_line2 + '&nbsp;&nbsp; ' +
          item.city + ' &nbsp;&nbsp;' + item.postcode + '&nbsp;&nbsp; ' +  item.phone  +'</td>'+
          '<td class="invert"><a href="javascript:deleteAddress(\'' + item._id + '\')">删除</a></td>'+
          '</tr>'
        )
      });
    },
  });
}

function deleteAddress(id){
  $.ajax({
    type: "GET",
    url: "/users/delete_address?id="+id,
    headers:{'Authorization': 'bearer '+ localStorage.getItem("mytoken")},
    success: function(){
      $(location).attr('href', '/profile.html?action=change_address');
    },
    error:function () {
      alert('失败，请重试');
    }
  });
}

function show_orders() {
  $('.products-right').html(
    '<table class="timetable_sub">'+
    '<thead>'+
    '<tr>'+
    '<th>No</th>'+
    '<th>日期</th>'+
    '<th>状态</th>'+
    '<th>总计</th>'+
    '</tr>'+
    '</thead>'+
    '<tbody>'+
    '</tbody>'+
    '</table>'
  );
  $.ajax({
    type: "GET",
    url: "/product/order_history?mode=simple",
    headers:{'Authorization': 'bearer '+ localStorage.getItem("mytoken")},
    success: function(data){
      data.forEach(function (item, index) {
        let status = item.status? '已发货':'未发货';
        $('tbody').append(
          '<tr class="rem' + index + '">'+
          '<td class="invert"><a href="/final_checkout.html?mode=history&id=' + item.id + '">' + item.id + '</a></td>'+
          '<td class="invert">'+new Date(data[0].date).toLocaleDateString()+'</td>'+
          '<td class="invert">'+ status + '</td>'+
          '<td class="invert">￡'+item.total_price+'</td>'+
          '</tr>'
        )
      });
    },
  });
}

function change_password() {
  $('.products-right').html('<form action="#" id="change_password"> ' +
    '<h5>更改密码</h5> ' +
    '<input type="password" placeholder="新密码(至少六位，包含大写，小写和数字中的两种)"><br> ' +
    '<input type="password" placeholder="确认新密码"><br> ' +
    '<input id="submit_change_password" type="submit" value="确认">' +
    ' </form>');

  $('#submit_change_password').click(function change_pass() {
    $('#submit_change_password').unbind("click");
    $('#submit_change_password').click(function(){return false});
    let $inputs = $('#change_password input');
    let new1 = $($inputs[0]).val();
    let new2 = $($inputs[1]).val();
    if(new1 !== new2){
      $('#submit_change_password').click(change_pass);
      alert('新密码两次输入必须一样');
      return false;
    }
    let mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
    if(!mediumRegex.test(new1)){
      $('#submit_change_password').click(change_pass);
      alert('新密码不符合规则');
      return false;
    }
    $.ajax({
      type: "POST",
      url: "/users/change_password",
      headers:{'Authorization': 'bearer '+localStorage.getItem("mytoken")},
      data: {'password': new1},
      dataType: 'json',
      success: function(data){
        quit();
      },
      error:function () {
        $('#submit_change_password').click(change_pass);
        alert('修改密码失败，请重试');
      }
    });

    return false;
  });
}

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function quit() {
  $.ajax({
    type: "GET",
    url: "/users/logout",
    headers:{'Authorization': 'bearer '+ localStorage.getItem("mytoken")},
    success: function(){
      localStorage.removeItem("mytoken");
      $(location).attr('href', '/login.html');
    },
    error: function () {
      alert('退出失败');
    }
  });
}