define(function() {

    'use strict';
    var word = 'aprender_';

    return {
        modem: function(type, url, sucess, error, data) {

            $.ajax({
                async: true,
                cache: false,
                type: type || 'GET',
                url: 'https://letrinhas.ipt.pt/webservice/'+url+'?prefix='+word,
                //url: 'http://192.168.0.32:446/'+url+'?prefix='+word,
                dataType: 'json',
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Basic ' + (window.sessionStorage.getItem("keyo")));
                },
                data: data,
                success: sucess,
                error: error,
                processData: false,
                contentType: 'application/json',
            });
        }
    };
});
