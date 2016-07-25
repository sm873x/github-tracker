(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    ns.$authArea = $('.auth-area');
    ns.userData = {};
    ns.$alertArea = $('.alert-area');
    var $logToken = $('.logToken');
    ns.$tokenInput = $('#API-token');

    $logToken.on('submit', function(e){
        console.log('start');
        e.preventDefault();

        ns.token = ns.$tokenInput.val();
        console.log('token', ns.token);

        ns.authorize(ns.token)
            .done(function(data) {
                ns.userData = data;
                ns.username = data.login;
                console.log(ns.userData);

                window.location.hash = '#profile';
            })
            .fail( ns.error );
    });

    /**
     * Use GitHub token to authorize retrieval of user info
     * @param  {String} token Person Access Token
     * @return {Promise} jQuery XHR Object containing promise method
     */
    ns.authorize = function loginAPI(token) {
        if (!token) {
            var def = $.Deferred();
            def.reject({status: 400});
            return def.promise();
        }

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
