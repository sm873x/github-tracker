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
