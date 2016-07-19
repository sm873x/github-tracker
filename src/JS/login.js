(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    $('.login').on('submit', function(e){
        e.preventDefault();

        var token = $('#API-token').val();
        console.log('token', token);

        ns.login(token)
            .done(function(data) {
                console.log('login', data);
            });
    });

    ns.login = function loginAPI(token) {
        return $.ajax({
            url: 'https://api.github.com/user/',
            method: 'get',
            headers: {
                'Authorization': 'token ' + token
            },
            dataType: 'json'
        });
    };

})(window.tracker);
