(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    ns.$nav = $('.nav');
    var authView = '#authorization';
    var logoutView = '#logout';
    var $reposView = $('#repos');
    ns.$details = $('.details');
    ns.$repoForm = $('.inputRepo');

    window.addEventListener('hashchange', function() {
        console.log('hash change');
        ns.loadView( window.location.hash );
    });

    window.addEventListener( 'load', function() {
        console.log('load');
        ns.loadView( window.location.hash || authView );
    });

    $reposView.on('click', '.toRepoDetail', function(e) {
        window.location.hash = '#repoDetail/' + ns.chosenRepo;
        
        ns.$repoForm.hide();
        ns.$details.show();

        ns.chosenRepo = e.target.innerText;
        ns.getRepo(ns.username, ns.token, ns.chosenRepo)
            .done(function(data) {
                console.log(data);
                ns.dispRepoDetail(data);
            })
            .fail( ns.error );
    });

    $('.inpRepo').on('click', function() {
        console.log('repoName', ns.repoName);
        if (!ns.repoName) {
            ns.$details.hide();
            ns.$repoForm.show();
        }
    });

    ns.loadView = function loadView(view) {
        console.log('loadview');
        var viewBase = view.split('/')[0];
        var $viewBase = $( viewBase );

        $('.view').hide();

        if (!ns.token && view !== authView) {
            window.location.hash = authView;
            return;
        } else if (view === logoutView) {
            ns.logout();
            return;
        }

        $('.nav [href="' + ns.lastView + '"]')
            .parent()
                .removeClass('active');

        $('.nav [href="' + viewBase + '"]')
            .parent()
                .addClass('active');

        if (!$viewBase.length) {
            $viewBase = $(authView);
        }

        $viewBase.show();

        ns.lastView = viewBase;

        if ( ns[viewBase.substr(1)] && ns[viewBase.substr(1)].load ) {
            ns[viewBase.substr(1)].load( view );
        }
    };

    ns.dispNav = function dispNav() {
        if (window.location.hash !== authView) {
            ns.$nav.show();
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

(function(ns) {
    'use strict';

    window.tracker = ns = ( ns || {} );


    ns.error = function handleAjaxFail(xhr) {
        var statCode = xhr.status;
        if ( 400 <= statCode && statCode < 500 ) {
            ns.$alertArea.text('Check your token');
        } else if ( statCode >= 500){
            ns.$alertArea.text('Ruh roh, looks like we\'re having problems. Check back later please');
        }
    };

    ns.date = function justDate(dateTime){
        var dateArr = dateTime.split('T');
        return dateArr[0];
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
            .text('Account created: ' + ns.date(data.created_at) );
    };

})(window.tracker);

(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    ns.$theRepoName = $('.repo-name');
    ns.$repoIssUrl = $('.issues-url');
    ns.$repoForm = $('.inputRepo');

    ns.$repoForm.on('submit', function(e) {
        e.preventDefault();

        var theRepo = $('#Repo-name').val();
        // console.log('testing this', ns.username);

        ns.getRepo(ns.username, ns.token, theRepo)
            .done(function(data) {
                console.log(data);
                ns.dispRepoDetail(data);

                ns.$details.show();
                ns.$repoForm.hide();
            })
            .fail( ns.error );
    });

    ns.getRepo = function getRepo(username, token, repo) {

        if (!username || !token || !repo) {
            var def = $.Deferred();
            def.reject({status: 401});
            return def.promise();
        }

        return $.ajax({
            url: 'https://api.github.com/repos/' + username + '/' + repo,
            get: 'get',
            headers: {
                'Authorization': 'token ' + token
            },
            dataType: 'json'
        });
    };

    ns.dispRepoDetail = function dispRepoDetail(data) {
        console.log(data);
        dispIssue(data);

        ns.$theRepoName
            .attr('href', data.html_url)
            .text(data.name);

        $('.repo-text').text(data.description);

        $('.owner').text(ns.username);

        $('.stars').text(data.stargazers_count);

        $('.forks').text(data.forks_count);

        $('.created-on').text( ns.date(data.created_at) );
    };

    function dispIssue(data) {
        console.log(data.has_issues);
        if (data.has_issues) {
            ns.$repoIssUrl.show();
            ns.$repoIssUrl.attr('href', (data.html_url + '/issues') );
            $('.open-issues').text(JSON.stringify(data.open_issues_count));
        } else {
            ns.$repoIssUrl.hide();
        }
    }

})(window.tracker);

(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    $('a[href="#repos"]').on('click', function() {
        if (!ns.repoDataArr) {
            ns.getRepoList(ns.token)
                .done(function(data) {
                    ns.repoDataArr = data;
                    console.log(ns.repoDataArr);
                    ns.repoDataArr.forEach( ns.dispRepoList );
                })
                .fail( ns.error );
        }
    });

    ns.getRepoList = function getRepoList(token) {
        return $.ajax({
            url: 'https://api.github.com/user/repos',
            get: 'get',
            headers: {
                'Authorization': 'token ' + token
            },
            dataType: 'json'
        });
    };

    ns.dispRepoList = function dispRepoList(repo) {
        ns.repoName = repo.name;

        $('.repoTable')
            .append('<tr class=' + ns.repoName + '> \
                        <td class="toRepoDetail">' + ns.repoName + '</td> \
                        <td>' + repo.stargazers_count + '</td> \
                        <td>' + repo.open_issues_count + '</td> \
                    </tr>');
    };

})(window.tracker);

//# sourceMappingURL=main.js.map