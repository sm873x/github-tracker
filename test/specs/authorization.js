(function() {
    'use strict';

    var assert = chai.assert;

    suite('get user information with token', function() {

        test('ensure function exists', function() {
            assert.ok( window.tracker.authorize, 'getRepoList exists' );
            assert.strictEqual( typeof(window.gh.getRepoList), 'function', 'getRepoList exists' );
        });
                                    //adding done in argument, means mocha will wait until callback done
        // test('getRepoList makes ajax call', function(doneCallback) {
        //     var returnVal = window.gh.getRepoList('sm873x');
        //
        //     assert.ok( returnVal.done, 'has done method');
        //     assert.ok( returnVal.fail, 'has fail method');
        //
        //     returnVal
        //     .done(function(data) {
        //         assert.isArray(data); //testing server's data response
        //     })
        //     .fail(function(xhr) {
        //         assert.fail();//if hit this line, this test WILL fail
        //     })
        //     .always(function() {
        //         doneCallback(); //no argument here = success
        //     });
        //
        // });
    });



})();
