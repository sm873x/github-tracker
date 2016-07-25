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
