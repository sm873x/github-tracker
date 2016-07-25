(function(){

    'use strict';

    var assert = window.chai.assert;

    suite('handleAjaxFail', function() {
        teardown(function(){
            window.tracker.statCode = '200';
        });

        test('ensure error function exists', function(){
            assert.ok(window.tracker.error, 'error function exists');
            assert.isFunction( window.tracker.error, 'ns.error is a function');
        });

        test('400 type error results in client side alert', function(){
            window.tracker.xhr = {status: 400};
            assert.isObject(window.tracker.$alertArea, '400 alert for client side errors');
        });

        test('500 type error results in server side alert', function(){
            window.tracker.xhr = {status: 500};
            assert.isObject(window.tracker.$alertArea, '500 alert for server side errors');
        });
    });

    suite('justDate function gives just month, day and year', function() {
        teardown(function(){
            window.tracker.dateArr = null;
        });

        test('ensure date function exists', function(){
            assert.ok(window.tracker.date, 'date function exists');
            assert.isFunction( window.tracker.date, 'ns.date is a function');
        });
        test('date function works with a valid timestamp', function() {
            var dateTime = '2016-07-25T03:14:28';
            window.tracker.dateArr = ['2016-07-25', '03:14:28'];
            assert.isArray(dateTime.split('T'), 'splitting timestamp on T gives an array of two strings');
            assert.strictEqual(window.tracker.dateArr[0], '2016-07-25', 'justDate function provides only year, month and day');
        });
    });

})();
