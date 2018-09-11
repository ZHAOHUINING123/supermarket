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

$(function () {
  let append_to_select1 = '';
  for(let i = 0; i < large_class.length; i++){
    append_to_select1 += '<option value="' + i +'">' + large_class[i] +'</option> ';
  }
  $('#large_class').append(append_to_select1)
    .change(changeSmallClass);
  changeSmallClass();
  let type = getParameterByName('type');
  if(type === 'new'){
    manipulateNew();
  }else if(type ==='change'){
    manipulateModify();
  }
});

function manipulateModify(){
  let $inputs = $('.sign-up-input');
  $inputs.eq(0).val(getParameterByName('name'));
  $inputs.eq(1).val(getParameterByName('price'));
  $inputs.eq(2).val(getParameterByName('inventory'));
  $("#large_class").val("2");
  changeSmallClass();
  $('#submit').click(function () {
    submit(getParameterByName('id'));
    return false;
  });
}

function manipulateNew() {
  // after submitting
  $('#submit').click(function () {
    submit();
    return false;
  });
}

function changeSmallClass() {
  let current_selected = Number($('#large_class').find(":selected").val());
  let append_to_select2 = '';
  for(let i = 0; i < small_class[current_selected].length; i++){
    append_to_select2 += '<option value="' + i +'">' + small_class[current_selected][i] +'</option> ';
  }
  $('#small_class').html(append_to_select2);
}

function submit(id) {
  let submit_content = {};
  if(id)
    submit_content['id'] = id;
  let $inputs = $('.sign-up-input');
  submit_content['name'] = $.trim($inputs.eq(0).val());
  submit_content['price'] = Number($.trim($inputs.eq(1).val()));
  submit_content['inventory'] = Number($.trim($inputs.eq(2).val()));
  submit_content['large_class'] = Number($('#large_class').find(":selected").val());
  submit_content['small_class'] = Number($('#small_class').find(":selected").val());

  let pic = $('#pic')[0].files[0];
  let fd_pic = new FormData();
  fd_pic.append('pic', pic);
  if(!submit_content['name'] || !submit_content['price']){
    alert('请填写所有必填项');
    return false;
  }

  $.ajax({
    url: "/modify/normal",
    method: "POST",
    data: JSON.stringify(submit_content),
    dataType: 'text',
    success: function(data){
      data = JSON.parse(data);
      let id = data.id;
      if(pic){
        $.ajax({
          url: "/modify/pic?id="+id,
          method: "POST",
          data: fd_pic,
          contentType: false,
          processData: false,
          cache: false,
          success: function(data){
            alert("成功更新数据和图片");
            $(location).attr('href', '/modify?type=new');
          },
          error: function () {
            alert("成功更新数据，错误更新图片");
            $(location).attr('href', '/modify?type=new');
          }
        });
      }else{
        alert("成功更新数据");
        $(location).attr('href', '/modify?type=new');
      }
    },
    error: function () {
      alert("错误，请重试");
      $(location).attr('href', '/modify?type=new');
    }
  });
  return false;

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