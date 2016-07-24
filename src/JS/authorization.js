(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    ns.$authArea = $('.auth-area');
    ns.userData = {};
    var $alertArea = $('.alert-area');
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

    ns.error = function handleAjaxFail(xhr) {
        var statCode = xhr.status;
        if ( 400 <= statCode && statCode < 500 ) {
            $alertArea.text('Check your token');
        } else if ( statCode >= 500){
            $alertArea.text('Ruh roh, looks like we\'re having problems. Check back later please');
        }
    };

})(window.tracker);
