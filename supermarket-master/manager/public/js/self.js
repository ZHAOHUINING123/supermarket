let large_class = ['酱料','米面粉','新鲜冷藏','冷冻食品','零食饮料','干货','非食品类'];
let small_class = [
  ['中式酱料','日韩调味料','火锅底料','其他'],
  ['米类','面','粉丝粉条','其他'],
  ['果蔬','豆腐','冷藏食品','其他'],
  ['火锅相关','速冻饺子','鱼肉海鲜','其他'],
  ['零食','饮料','其他'],
  ['香料','食材','汤料','其他'],
  ['休闲娱乐','厨具餐具','其他']
];

let data_global;
let current_index = 0;

$(function () {
  let small = getParameterByName('small');
  let large = getParameterByName('large');
  if(small!==null && large !== null){
    small = Number(small);
    large = Number(large);
  }else{
    small = large = -1;
  }
  $.getJSON('/show?small='+small + '&large='+large, function (data) {
    data_global = data;
    let total_index = Math.ceil(data.length / 20);
    createIndex(total_index-1);
    showpage(0);
  });
});

function showpage(num){
  $('.pagination>li').eq(current_index).removeClass("active");
  $('.pagination>li').eq(num).addClass("active");
  $('#table tbody').html('');
  current_index = num;
  let end = Math.min((num+1)*20, data_global.length);
  for(let i = num*20; i< end; i++){
    addData(data_global[i]);
  }
}

function createIndex(total_index) {
  let addStr = '';
  for(let i = 0; i < total_index; i++){
    addStr += '<li><a href="javascript:showpage('+(i+1)+');">'+ (i+2) +'</a></li> ';
  }
  $('.paging').append(addStr);
}

function addData(data) {
  let pic_path = '';
  let isdianji = '';
  if(data.pic_path){
    let position = data.pic_path.indexOf("publicfiles");
    pic_path = 'http://49.51.137.167:3000' + data.pic_path.substr(position+11);
    isdianji = '点击';
  }else{
    pic_path = '#';
    isdianji = '无图片';
  }
  $('#table tbody').append(
    '<tr class="item">' +
    '<td>'+data.name+'</td>'+
    '<td>'+data.price+'</td>'+
    '<td>'+large_class[Number(data.large_class)]+'</td>'+
    '<td>'+small_class[Number(data.large_class)][Number(data.small_class)]+'</td>'+
    '<td>'+data.inventory+'</td>'+
    '<td><a href="'+pic_path+'">'+isdianji+'</a></td>'+
    '<td><a href="/modify?type=change&id='+data._id+'&name='+data.name +
    '&price='+data.price+'&isDiscount='+data.isDiscount+'&new_price='+data.new_price +
    '&large_class='+data.large_class+'&small_class='+data.small_class+'&inventory='+data.inventory+'">点击</a></td>'+
    '<td><a href="javascript:deleteItem(\'' + data._id+ '\');">点击</a></td>'+
    '</tr>'
  )
}

function deleteItem(id){
  $.ajax({
    url: "/modify/delete?id="+id,
    method: "DELETE",
    success: function(){
      alert("删除成功");
      $(location).attr('href', '/');
    },
    error: function () {
      alert("删除失败");
      $(location).attr('href', '/');
    }
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