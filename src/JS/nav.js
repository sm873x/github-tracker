(function(ns) {
    'use strict';

    window.tracker = ns = (ns || {});

    window.addEventListener('hashchange', function() {
        console.log('hash change');
        ns.loadView( window.location.hash );
    });

    window.addEventListener( 'load', function() {
        console.log('load');
        ns.loadView( window.location.hash || '#authorization');
    });

    ns.loadView = function loadView(view) {
        console.log('loadview');

        if (!ns.token && view !== '#authorization') {
            window.location.hash = '#authorization';
            return;
        }
        
        $('.view').hide();

        var viewBase = view.split('/')[0];//find the view module we care about
        var $view = $( viewBase );
        //Remember: jquery object is array-like so you can get length

        $('.nav [href="' + viewBase + '"]')
            .parent()
                .addClass('active');

        if (!$view.length) {
            $view = $('#authorization');
        }

        $view.show();

        //excecute function to initialize chosen module

        if ( ns[viewBase.substr(1)] && ns[viewBase.substr(1)].load ) {
            ns[viewBase.substr(1)].load( view );//substr will return everything after #
        }
    };
})(window.tracker);
