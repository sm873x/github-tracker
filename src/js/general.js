(function(ns) {
    'use strict';

    window.tracker = ns = ( ns || {} );

    ns.error = function handleAjaxFail(xhr) {
        ns.statCode = xhr.status;
        if ( 400 <= ns.statCode && ns.statCode < 500 ) {
            ns.$alertArea.text('Check your token');
        } else if ( ns.statCode >= 500){
            ns.$alertArea.text('Ruh roh, looks like we\'re having problems. Check back later please');
        }
    };

    ns.date = function justDate(dateTime){
        ns.dateArr = dateTime.split('T');
        return ns.dateArr[0];
    };

})(window.tracker);
