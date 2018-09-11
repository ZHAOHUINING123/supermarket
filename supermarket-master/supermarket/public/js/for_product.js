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
  let search_content = getParameterByName('search');
  if(search_content){
    $.getJSON('/product?search='+search_content, function (data) {
      data_global = data;
      let total_index = Math.ceil(data.length / 12);
      createIndex(total_index-1);
      showpage(0);
    });
  }else{
    let large = Number(getParameterByName('large'));
    let small = Number(getParameterByName('small'));
    //breadcrumbs
    $('.breadcrumb').append('<li class="active">' + large_class[large] + '</li> ');
    if(small !== -1){
      $('.breadcrumb').append('<li class="active">' + small_class[large][small] + '</li> ');
    }
    $.getJSON('/product?large='+large+'&small='+small, function (data) {
      data_global = data;
      let total_index = Math.ceil(data.length / 12);
      createIndex(total_index-1);
      showpage(0);
    });
  }

});

function showpage(num){
  $('.pagination>li').eq(current_index).removeClass("active");
  $('.pagination>li').eq(num).addClass("active");
  $('.pagination2>li').eq(current_index).removeClass("active");
  $('.pagination2>li').eq(num).addClass("active");
  current_index = num;
  $('.agile_top_brands_grids').html('<div class="clearfix"> </div>');
  let end = Math.min((num+1)*12, data_global.length);
  for(let i = num*12; i< end; i++){
    addData(data_global[i]);
  }
  // add to cart button
  $('.button').click(function () {
    let name = $(this).siblings().eq(0).val();
    let amount = Number($(this).siblings().eq(3).val());
    let id = $(this).siblings().eq(1).val();
    let price = Number($(this).siblings().eq(2).val());
    let item = {name:name, amount:amount, id: id, price:price};
    if(!localStorage.getItem('cart')){
      let array = [];
      array.push(item);
      localStorage.setItem('cart', JSON.stringify(array));
    }
    else{
      let array = JSON.parse(localStorage.getItem('cart'));
      array.push(item);
      localStorage.setItem('cart', JSON.stringify(array));
    }
    mergeCart();
    alert('成功加入购物车');
    return false;
  });
}

function addData(data) {
  let pic_path;
  if(data.pic_path){
    let position = data.pic_path.indexOf("publicfiles");
    pic_path = 'http://118.25.73.172:3000' + data.pic_path.substr(position+11);
  }
  else
    pic_path = 'images/no_pic.jpg';
  let price = data.price;
  $('.agile_top_brands_grids').prepend(
    '<div class="col-md-4 top_brand_left">'+
    '<div class="hover14 column">'+
    '<div class="agile_top_brand_left_grid">'+
    '<div class="agile_top_brand_left_grid1">'+
    '<figure>'+
    '<div class="snipcart-item block">'+
    '<div class="snipcart-thumb">'+
    '<a href="#"><img title=" " height="200" width="266.67" alt=" " src="' +pic_path + '"></a>'+
    '<p>'+data.name+'</p>'+
    '<h4>￡'+price+'</h4>'+
    '</div>'+
    '<div class="snipcart-details top_brand_home_details">'+
    '<form>'+
    '<fieldset>'+
    '<input type="hidden" name="name" value="' +data.name+ '">'+
    '<input type="hidden" name="id" value="' +data._id+ '">'+
    '<input type="hidden" name="price" value="' +data.price+ '">'+
    '数量<input type="text" name="add" value="1"><br><br>'+
    '<input type="submit" name="submit" value="加入购物车" class="button">'+
    '</fieldset>'+
    '</form>'+
    '</div>'+
    '</div>'+
    '</figure>'+
    '</div>'+
    '</div>'+
    '</div>'+
    '</div>'
  );
}

function createIndex(total_index) {
  let addStr = '';
  for(let i = 0; i < total_index; i++){
    addStr += '<li><a href="javascript:showpage('+(i+1)+');">'+ (i+2) +'</a></li> ';
  }
  $('.paging').append(addStr);
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

function mergeCart(){
  let array = JSON.parse(localStorage.getItem('cart'));
  for(let i = 0; i < array.length; i++){
    for(let j = i+1; j < array.length; j++){
      if(array[j].id === array[i].id){
        array[i].amount += array[j].amount;
        array.splice(j,1);
      }
    }
  }
  localStorage.setItem('cart', JSON.stringify(array));
}