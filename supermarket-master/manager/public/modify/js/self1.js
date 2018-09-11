$(function () {
  $('#submit').click(function () {
    let pic1 = $('#pic1')[0].files[0];
    let fd_pic = new FormData();
    fd_pic.append('pic', pic1);

    let pic2 = $('#pic2')[0].files[0];
    pic2.name = '2.jpg';
    fd_pic.append('pic', pic2);

    let pic3 = $('#pic3')[0].files[0];
    pic3.name = '3.jpg';
    fd_pic.append('pic', pic3);

    if(!(pic1 && pic2 && pic3)){
      alert('请填写所有项');
      return false;
    }
    if(pic1.name === pic2.name || pic1.name === pic3.name || pic2.name === pic3.name){
      alert('请不要上传名字相同的图片');
      return false;
    }

    $.ajax({
      url: "/modify/pic_index",
      method: "POST",
      data: fd_pic,
      contentType: false,
      processData: false,
      cache: false,
      success: function(data){
        alert("成功更新图片");
        $(location).attr('href', '/');
      },
      error: function () {
        alert("失败");
      }
    });
    return false;
  });
});