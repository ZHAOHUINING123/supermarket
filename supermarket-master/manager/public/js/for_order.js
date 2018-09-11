let last_time = 0;
let type = 0;
let current_index = 0;
let timer;
let mode = false;

$(function () {
  $('#graphmode').click(function () {
    if(!mode){
      mode = true;
      timer = setInterval(function(){
        if(!query_string || query_string === 'status0'){
          type = 0;
          init();
        }else if(query_string === 'status1'){
          type = 1;
          init();
        }
        else if(query_string === 'status2'){
          type = 2;
          init();
        }
      }, 5000);
    }
    else{
      clearInterval(timer);
      mode = false;
    }
  });
  let query_string = getParameterByName('type');
  if(!query_string || query_string === 'status0'){
    type = 0;
    init();
  }else if(query_string === 'status1'){
    type = 1;
    init();
  }else if(query_string === 'status2'){
    type = 2;
    init();
  }
});

function init(){
  $.getJSON('/show/order_number?type='+type, function (data) {
    let total_index = Math.ceil(data.count / 30);
    clearIndex();
    createIndex(total_index-1);
    showpage(0);
  })
}

function showpage(num){
  $.getJSON('/show/order?type='+type + '&begin=' + num*30 + '&end=' + (num*30+30),
    function (data) {
      $('tbody').html('');
      showData(data)
  });
  $('.pagination>li').eq(current_index).removeClass("active");
  $('.pagination>li').eq(num).addClass("active");
  $('.pagination2>li').eq(current_index).removeClass("active");
  $('.pagination2>li').eq(num).addClass("active");
  current_index = num;
}


function createIndex(total_index) {
  let addStr = '';
  for(let i = 0; i < total_index; i++){
    addStr += '<li><a href="javascript:showpage('+(i+1)+');">'+ (i+2) +'</a></li> ';
  }
  $('.paging').append(addStr);
}

function clearIndex() {
  $('.paging').html('<li class="active"><a href="javascript:showpage(0);">1</a></li>');
}

function showData(data){
  for(let i = 0; i < data.length; i++){
    $('tbody').append(
      '<tr class="item">' +
       '<td>'+data[i]._id+'</td>'+
       '<td>'+new Date(data[i].createdAt).toLocaleString()+'</td>'+
       '<td>'+new Date(data[i].send_date).toLocaleDateString() + (data[i].send_time===0?'  五点到六点':'九点之后')+'</td>'+
       '<td>'+ (data[i].status === 0?'未发货':(data[i].status === 1?'已发货':'已完成')) +'</td>'+
       '<td>'+getPrice(data[i].items)+'</td>'+
       '<td><a href="/details.html?id=' + data[i]._id + '">点击</a></td>'+
      '</tr>'
    )
  }
}

function getPrice(items) {
  let sum = 0;
  for(let i = 0; i < items.length; i++){
    sum += items[i].amount * items[i].price;
  }
  return sum.toFixed(2);
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