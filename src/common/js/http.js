// var apiUrl = 'http://api.mofangcar.com:8081';
let apiUrl = 'http://192.168.3.170:8080/';
// 插入loading
let html = '';
html += '<div id="preloader">';
html += '<div id="status"></div>';
html += '</div>';
$('body').append(html);
export function getData (url, type, data) {
    if (type === '') { type = 'GET' }
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: type,
            url: apiUrl + url,
            data: data,
            dataType: 'JSON',
            'Content-Type': 'application/json',
            beforeSend: function () { // 开始loading
                $('#preloader').show();
            },
            success: function (res) {
                resolve(res)
            },
            error: function (error) {
                reject(error)
            },
            complete: function () { // 结束loading
                $('#preloader').hide();
            }
        });
    })
  }