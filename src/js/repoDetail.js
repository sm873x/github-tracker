(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    ns.$theRepoName = $('.repo-name');
    ns.$repoIssUrl = $('.issues-url');
    ns.$repoForm = $('.inputRepo');

    ns.repoDetail = {};
    ns.repoDetail.load = function(hash) {
        var chosenRepo = hash.split('/')[1];
        ns.getRepo(ns.username, ns.token, chosenRepo)
           .done(function(data) {
               console.log(data);
               ns.dispRepoDetail(data);
           })
           .fail( ns.error );
    };

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
