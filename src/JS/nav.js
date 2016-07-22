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
        window.location.hash = '#repoDetail/' + e.target.innerText;
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
