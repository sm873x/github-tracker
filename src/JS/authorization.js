(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    $('.logToken').on('submit', function(e){
        console.log('start');
        e.preventDefault();

        var token = $('#API-token').val();
        console.log('token', token);

        ns.authorize(token)
            .done(function(data) {
                console.log('login', data);
            });
    });

    ns.authorize = function loginAPI(token) {
        return $.ajax({
            url: 'https://api.github.com/user',
            method: 'get',
            headers: {
                'Authorization': 'token ' + token
            },
            dataType: 'json'
        });
    };

})(window.tracker);
