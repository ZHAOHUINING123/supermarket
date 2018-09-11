$(function () {
  $.ajax({
    type: 'GET',
    crossDomain: true,
    dataType : 'jsonp',
    url: 'http://118.25.73.172:3000/forpublic/for_index',
    headers: {
      "Access-Control-Allow-Origin":"*",
      'Access-Control-Allow-Credentials': 'true'
    },
  }).done(function(data) {
    console.log(data);
    let $images = $('#demo1 img');
    for(let i = 0; i < data.length; i++){
    $($images[i]).attr("src",'http://118.25.73.172:3000/files/index/' + data[i]);
    }
  });
});