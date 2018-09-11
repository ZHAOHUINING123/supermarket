let item_array = [];
let valid_user = false;
let submit_address;

$(function () {
  if(!getParameterByName('mode')){
    //get cart information
    let array = JSON.parse(localStorage.getItem('cart'));
    if(!array)
      return;
    item_array = array;
    for(let i = 0; i < array.length; i++)
      addItem(i+1, array[i]);
    showTotalPrice();

    showAddress();
    configureSubmit();
  }else if(getParameterByName('mode') === 'history'){
    show_history();
  }

});

function show_history() {
  $('.checkout-left').html('');
  $.ajax({
    type: "GET",
    url: "/product/order_history?mode=complex&id="+getParameterByName('id'),
    headers:{'Authorization': 'bearer '+ localStorage.getItem("mytoken")},
    success: function(data){
      item_array = data.items;
      showTotalPrice();
      for(let i = 0; i < data.items.length; i++)
        addItem(i+1, data.items[i]);
      $('#address').append(
        '<p>' + data.address.fullname + '</p>' +
        '<p>' + data.address.address_line1+ '</p>'+
        '<p>' + data.address.address_line2+ '</p>'+
        '<p>' + data.address.city+ '</p>'+
        '<p>' + data.address.postcode + '</p>'+
        '<p>' + data.address.phone+ '</p>'
      );
    },
  });
}

function configureSubmit() {
  $('#save_button').click(function save_submit() {
    $('#save_button').unbind("click");
    $('#save_button').click(function(){return false});
    if(!submit_address){
      $('#save_button').click(save_submit);
      alert('地址错误');
      $(location).attr('href', '/checkout.html');
      return false;
    }
    if(item_array.length === 0){
      $('#save_button').click(save_submit);
      alert('请买点东西吧');
      $(location).attr('href', '/');
      return false;
    }
    let submit_content = {};
    submit_content.items = item_array;
    submit_content.address = submit_address;
    submit_content.send_date = new Date(Number(getParameterByName('send_date')));
    submit_content.send_time = Number(getParameterByName('send_time'));
    $.ajax({
      type: "POST",
      url: "/product",
      headers:{'Authorization': 'bearer '+ localStorage.getItem("mytoken")},
      data:JSON.stringify(submit_content),
      contentType: "application/json; charset=utf-8",
      success: function(){
        $('.checkout-left').html('');
        $('#successdiv').html('<h4 id="success">购买成功</h4>');
        localStorage.removeItem("cart");
      },
      error:function (data) {
        if(data.err === 'no_user'){
          alert('请登陆');
          $(location).attr('href', '/login.html');
        }else if(data.err === 'no_amount'){
          alert('存货不足');
          $(location).attr('href', '/checkout.html');
        }else if(data.err === 'no_address'){
          alert('地址错误');
          $(location).attr('href', '/checkout.html');
        }else if(data.err === 'no_item'){
          alert('请购买东西');
          $(location).attr('href', '/');
        }
        else{
          alert('错误，请重试');
          $(location).attr('href', '/checkout.html');
        }
      }
    });
  });
}

function showAddress() {
  let fullname = getParameterByName('fullname');
  let address_line1 = getParameterByName('address_line1');
  let address_line2 = getParameterByName('address_line2');
  let postcode = getParameterByName('postcode');
  let phone = getParameterByName('phone');
  let city = getParameterByName('city');
  if(fullname && address_line1 && postcode && phone && city){
    submit_address = {
      fullname:fullname, address_line1:address_line1,address_line2:address_line2,
      postcode:postcode,phone:phone,city:city
    }
  }
    $('#address').append(
      '<p>' + fullname + '</p>' +
      '<p>' +address_line1+ '</p>'+
      '<p>' +address_line2+ '</p>'+
      '<p>' +city+ '</p>'+
      '<p>' +postcode + '</p>'+
      '<p>' +phone+ '</p>'
    );
  let send_date = Number(getParameterByName('send_date'));
  let send_time = getParameterByName('send_time');
  $('#send_datetime').append(
    '<p>' + new Date(send_date).toLocaleDateString() + '</p>' +
    '<p>' +(send_time==='0'?'五点到六点':'九点以后')+ '</p>'
  );
}

function addItem(index, data){
  $('.timetable_sub tbody').append(
    '<tr class="rem' + index + '">'+
    '<td class="invert">' + index + '</td>'+
    '<td class="invert">'+data.name+'</td>'+
    '<td class="invert">'+
    '<div class="quantity">'+
    '<div><span>' + data.amount + '</span></div>'+
    '</div>'+
    '</td>'+
    '<td class="invert">￡'+data.price+'</td>'+
    '</tr>'
  );
}

function showTotalPrice(){
  let sum = 0;
  for(let i = 0; i < item_array.length; i++){
    sum += item_array[i].amount * item_array[i].price;
  }
  $('#total_price span').html(sum.toFixed(2));
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