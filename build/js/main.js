(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    var authView = '#authorization';
    var logoutView = '#logout';
    ns.$nav = $('.nav');

    window.addEventListener('hashchange', function() {
        console.log('hash change');
        ns.loadView( window.location.hash );
    });

    window.addEventListener( 'load', function() {
        console.log('load');
        ns.loadView( window.location.hash || authView );
    });

    $('#repos').on('click', '.toRepoDetail', function(e) {
        ns.chosenRepo = e.target.innerText;
        window.location.hash = '#repoDetail/' + ns.chosenRepo;
        ns.getRepo(ns.chosenRepo);
    });

    ns.loadView = function loadView(view) {
        console.log('loadview');

        if (!ns.token && view !== authView) {
            window.location.hash = authView;
            return;
        } else if (view === logoutView) {
            ns.logout();
            return;
        }

        $('.view').hide();

        var viewBase = view.split('/')[0];//find the view module we care about
        var $view = $( viewBase );
        //Remember: jquery object is array-like so you can get length
        $('.nav [href="' + ns.lastView + '"]')
            .parent()
                .removeClass('active');

        $('.nav [href="' + viewBase + '"]')
            .parent()
                .addClass('active');

        if (!$view.length) {
            $view = $('#authorization');
        }

        $view.show();
        ns.lastView = viewBase;
        //excecute function to initialize chosen module

        if ( ns[viewBase.substr(1)] && ns[viewBase.substr(1)].load ) {
            ns[viewBase.substr(1)].load( view );//substr will return everything after #
        }
    };

    ns.dispNav = function dispNav() {
        if (window.location.hash !== '#authorization') {
            $('.nav').show();
        }
        return;
    };

    ns.logout = function logout() {
        window.location.hash = authView;
        ns.$nav.hide();
        ns.token = '';
        ns.$tokenInput.val('');
    };

})(window.tracker);

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

        ns.token = $('#API-token').val();
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

(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    ns.profile = {};
    ns.profile.load = function initProfile() {
        console.log('hash', window.location.hash);
        ns.dispNav();
        ns.dispProfile(ns.userData);
    };

    ns.dispProfile = function dispProfile(data) {
        //
        // if (!data) {
        //     $('#profile')
        //         .append('<p class="no-data">Strange, no info in your GitHub account</p>');
        //         .find('ul')
        //             .hide();
        //     return;
        // }
        ns.username = data.login;

        $('.avatar')
            .attr('src', data.avatar_url);
        $('.userPage')
            .text(ns.username)
            .attr('href', data.html_url);
        $('.name')
            .text('Name: ' + data.name);
        $('.repos')
            .text('Repos: ' + data.public_repos);
        $('.followers')
            .text('Followers: ' + data.followers + ' (following ' + data.following + ')');
        $('.acct-created')
            .text('Account created: ' + data.created_at);

    };

})(window.tracker);

(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});


    ns.getRepo = function getRepo(repoName) {
        $.ajax({
            url: 'https://api.github.com/repos/' + ns.username + '/' + repoName,
            get: 'get',
            headers: {
                'Authorization': 'token ' + ns.token
            },
            dataType: 'json'
        })
        .done( dispRepoDetail )
        .fail( ns.error );
    };

    function dispRepoDetail(data) {
        console.log(data);
    }

})(window.tracker);

(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    $('a[href="#repos"]').on('click', function() {
        if (!ns.repoDataArr) {
            getRepoList()
                .done(function(data) {
                    ns.repoDataArr = data;

                    ns.repoDataArr.forEach( ns.dispRepoList );
                })
                .fail( ns.error );
        }
    });

    function getRepoList() {
        return $.ajax({
            url: 'https:api.github.com/user/repos',
            get: 'get',
            headers: {
                'Authorization': 'token ' + ns.token
            },
            dataType: 'json'
        });
    }

    ns.dispRepoList = function dispRepoList(repo) {
        ns.repoName = repo.name;
        console.log( 'repo name', ns.repoName );
        // ns.repoURL = repo.svn_url;

        $('.repoTable')
            .append('<tr class=' + ns.repoName + '> \
                        <td class="toRepoDetail">' + ns.repoName + '</td> \
                        <td>' + repo.stargazers_count + '</td> \
                        <td>' + repo.open_issues_count + '</td> \
                    </tr>');
    };

})(window.tracker);

//# sourceMappingURL=main.js.map