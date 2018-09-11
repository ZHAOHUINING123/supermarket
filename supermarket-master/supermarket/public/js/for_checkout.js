let item_array = [];
let valid_user = false;
let if_enough = true;

$(function () {
  //get cart information
  let array = JSON.parse(localStorage.getItem('cart'));
  if(!array)
    return;
  item_array = array;
  for(let i = 0; i < array.length; i++)
    addItem(i+1, array[i]);
  setEntryPlusMinus();
  showTotalPrice();

  //manipulate address
  $.ajax({
    type: "POST",
    url: "/users/validate",
    headers:{'Authorization': 'bearer '+ localStorage.getItem("mytoken")},
    success: function(data){
      valid_user = data;
      showAddress(data);
    },
    error:function () {
      $('#address').append('<a href="/login.html"><button>请先登录</button></a>')
    }
  });

  //confirmation button
  $('#save_button').click(function () {
    if(!valid_user){
      alert('请先登录');
      return false;
    }
    if(item_array.length === 0){
      alert('请买点东西吧');
      return false;
    }
    let select_address = $('input[name=address]:checked').val();
    let address = valid_user.address[select_address];
    let send_date = $('#send_date').val();
    let timestamp = Date.parse(send_date);
    
    if (isNaN(timestamp)) {
      alert('请选择一个送货时间');
      return false;
    }

    let send_time = $('#send_time').find(":selected").val();
    if(send_time !== '0' && send_time !== '1'){
      alert('请选择一个送货时间');
      return false;
    }

    if(!address){
      alert('请选择一个地址');
      return false;
    }
    if(!if_enough){
      alert('存货不足');
      return false;
    }

    $(location).attr('href', '/final_checkout.html?fullname='+
    address.fullname+'&address_line1='+address.address_line1+'&address_line2='+address.address_line2
    +'&city='+address.city+'&postcode='+address.postcode+'&phone='+address.phone+'&send_date='+timestamp+'&send_time='+send_time);
    return false;
  });

  //get inventory;
  getInventory();
});

function getInventory() {
  let item_ids = [];
  if(item_array && item_array.length > 0){
    for(let i = 0; i < item_array.length; i++){
      item_ids.push(item_array[i].id);
    }
    $.getJSON('/product/amount', {ids:item_ids}, function (data) {
      let amount = data.amount;
      let $inputs = $('.not_enough');
      let all_enough = true;
      for(let i = 0; i < amount.length; i++){
        if(amount[i] < item_array[i].amount){
          if_enough = false;
          all_enough = false;
          $inputs[i].innerHTML = '存货不足';
        }else{
          $inputs[i].innerHTML = '';
        }
      }
      if(all_enough){
        if_enough = true;
      }
    })
  }else{
    if_enough = false;
  }
}

function showAddress(current_user) {
  let addresses = current_user.address;
  for(let i = 0; i < addresses.length; i++){
    let default_checked = '';
    if(i === 0){
      default_checked = 'checked="checked"';
    }
    $('#address').append(
      '<input type="radio" '+default_checked+' name="address" value="' + i + '"> ' + addresses[i].fullname + ' &nbsp;&nbsp;'+
      addresses[i].address_line1 + ' &nbsp;&nbsp;' + addresses[i].address_line2 + '&nbsp;&nbsp; ' +
      addresses[i].city + ' &nbsp;&nbsp;' + addresses[i].postcode + '&nbsp;&nbsp; ' +  addresses[i].phone  +'<br>'
    );
  }
  $('#address').append(
    '<a href="/change_address.html"><button>添加地址</button></a>'
  );
}

function addItem(index, data){
  $('.timetable_sub tbody').append(
    '<tr class="rem' + index + '">'+
    '<td class="invert">' + index + '</td>'+
    '<td class="invert">'+data.name+'</td>'+
    '<td class="invert">'+
    '<div class="quantity">'+
    '<div class="quantity-select">'+
    '<div class="entry value-minus">&nbsp;</div>'+
    '<div class="entry value"><span>' + data.amount + '</span></div>'+
    '<div class="entry value-plus active">&nbsp;</div>'+
    '<div class="not_enough"></div>'+
    '</div>'+
    '</div>'+
    '</td>'+
    '<td class="invert">￡'+data.price+'</td>'+
    '<td class="invert">'+
    '<a href="javascript:deleteItem('+(index-1)+')">点击</a>'+
    '</td>'+
    '</tr>'
  );
}

function deleteItem(index){
  item_array.splice(index,1);
  localStorage.setItem('cart', JSON.stringify(item_array));
  $(location).attr('href', '/checkout.html');
}

function setEntryPlusMinus(){
  $('.value-minus').click(function () {
    if(Number($(this).next().children().eq(0).html()) === 1)
      return false;
    $(this).next().children().eq(0).html(Number($(this).next().children().eq(0).html()) - 1);
    let this_index = (Number($(this).parent().parent().parent().prev().prev().html()) - 1);
    item_array[this_index].amount = Number($(this).next().children().eq(0).html());
    localStorage.setItem('cart', JSON.stringify(item_array));
    showTotalPrice();
    getInventory();
    return false;
  });
  $('.value-plus').click(function () {
    $(this).prev().children().eq(0).html(Number($(this).prev().children().eq(0).html()) + 1);
    let this_index = (Number($(this).parent().parent().parent().prev().prev().html()) - 1);
    item_array[this_index].amount = Number($(this).prev().children().eq(0).html());
    localStorage.setItem('cart', JSON.stringify(item_array));
    showTotalPrice();
    getInventory();
    return false;
  });
}

function showTotalPrice(){
  let sum = 0;
  for(let i = 0; i < item_array.length; i++){
    sum += item_array[i].amount * item_array[i].price;
  }
  $('#total_price span').html(sum.toFixed(2));
}