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
