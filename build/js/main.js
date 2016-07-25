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
     * @param  {String} token Personal Access Token
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

    /**
     * Handles ajax failures
     * @param  {JQuery XHR Object} xhr XHR data with status code
     * @return {void}
     */
    ns.error = function handleAjaxFail(xhr) {
        ns.statCode = xhr.status;
        if ( 400 <= ns.statCode && ns.statCode < 500 ) {
            ns.$alertArea.text('Check your token');
        } else if ( ns.statCode >= 500){
            ns.$alertArea.text('Ruh roh, looks like we\'re having problems. Check back later please');
        }
    };

    /**
     * Splits year-month-day from full timestamp
     * @param  {String} dateTime Timestamp
     * @return {String} Date with just year-month-day
     */
    ns.date = function justDate(dateTime){
        ns.dateArr = dateTime.split('T');
        return ns.dateArr[0];
    };

})(window.tracker);

(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    ns.profile = {};
    ns.profile.load = function initProfile() {
        console.log('hash', window.location.hash);
        ns.dispNav();
        ns.dispProfile(ns.username, ns.userData);
    };

    /**
     * Displays profile information for authorized user
     * @param  {String} username Name of authorized user
     * @param  {JQuery Object} data Object with specified properties and values
     * @return {void}          
     */
    ns.dispProfile = function dispProfile(username, data) {
        $('.avatar')
            .attr('src', data.avatar_url);
        $('.userPage')
            .text(username)
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

    /**
     * Ajax call for data on specific chosen repo
     * @param  {String} username Login name of user
     * @param  {String} token    Personal authorization token
     * @param  {String} repo     Name of repo chosen
     * @return {Promise} jQuery XHR Object containing promise method
     */
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

    /**
     * Display repo details within selected html section element
     * @param  {JQuery XHR Object} data Ajax data with specified properties and values
     * @return {void}
     */
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

    /**
     * Hide .open-issues html class if repo has issues and vice versa
     * @param  {JQuery XHR Object} data Ajax data with specified properties and values
     * @return {void}   
     */
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

    /**
     * Make ajax call to get list of repos
     * @param  {String} token Personal authorized token
     * @return {Promise} jQuery XHR Object containing promise method
     */
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

    /**
     * Display repo list in html table
     * @param  {JQuery object} repo Repo object with specified properties and values within
     * @return {void}
     */
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