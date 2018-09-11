let submit_id = null;

$(function () {
  let id = getParameterByName('id');
  $.getJSON('/show/details?id='+id, function (data) {
    console.log(data);
    for(let i = 0; i < data.items.length; i++){
      addItem(i+1, data.items[i]);
    }
    showTotalPrice(data.items);
    showAddress(data.address);
    showUser(data.buyer);
    showTime(data.send_date, data.send_time);
    submit_id = data._id;
    if(data.status === 1){
      $('#mark').remove();
    }else if(data.status === 2){
      $('#mark').remove();
      $('#mark1').remove();
    }
  });

  $('#mark').click(function () {
    if(!submit_id){
      alert('失败，请稍后再试');
      return;
    }
    $.ajax({
      type: "GET",
      url: "/show/mark?type=1&id="+submit_id,
      success: function(){
        alert('成功标记为已发货');
        $(location).attr('href', '/order.html?type=status0');
      },
      error:function () {
        alert('失败，请稍后再试');
      }
    });
  });

  $('#mark1').click(function () {
    if(!submit_id){
      alert('失败，请稍后再试');
      return;
    }
    $.ajax({
      type: "GET",
      url: "/show/mark?type=2&id="+submit_id,
      success: function(){
        alert('成功标记为已完成');
        $(location).attr('href', '/order.html?type=status0');
      },
      error:function () {
        alert('失败，请稍后再试');
      }
    });
  })
});

function showTotalPrice(item_array){
  let sum = 0;
  for(let i = 0; i < item_array.length; i++){
    sum += item_array[i].amount * item_array[i].price;
  }
  $('#total_price span').html(sum.toFixed(2));
}


function addItem(index, data){
  $('tbody').append(
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

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  let regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function showAddress(address) {
  let fullname = address.fullname;
  let address_line1 = address.address_line1;
  let address_line2 = address.address_line2;
  let postcode = address.postcode;
  let phone = address.phone;
  let city = address.city;
  $('#address').append(
    '<p>' + fullname + '</p>' +
    '<p>' +address_line1+ '</p>'+
    '<p>' +address_line2+ '</p>'+
    '<p>' +city+ '</p>'+
    '<p>' +postcode + '</p>'+
    '<p>' +phone+ '</p>'
  );

}

function showTime(send_date, send_time){
  $('#send_timedate').append(
    '<p>' + new Date(send_date).toLocaleDateString() + '</p>' +
    '<p>' + (send_time === 0?'五点到六点': '九点以后') + '</p>'
  );
}

function showUser(user) {
  $('#user').append(
    '<p>' + user.lastname + '&nbsp;&nbsp;' +user.firstname + '</p>' +
    '<p>' + user.phone+ '</p>'+
    '<p>' + user.username+ '</p>'
  );
}