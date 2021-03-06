(function ()
{

    angular.module('app')
        .controller('PublicPostController', PublicPostController);

    PublicPostController.$inject = [
        '$rootScope',
        '$routeParams',
        'PostService',
        "ErrorHandlerService"
    ];

    function PublicPostController($rootScope,
                                  $routeParams, postService, errorHandler)
    {
        $rootScope.isUserLoggedV1();

        var self = this;

        self.postData = {};

        self._creating         = false;
        self._updating         = false;
        self.requestInProgress = false;

        self.listPublishedPosts = function ()
        {
            //devConsoleLog(self.postData);
            $rootScope.messageInfo('Loading...');
            postService.listPublishedPosts(self.postData)
                .then(
                    function (response)
                    {
                        //self.postList = response.data.posts;
                        self.postList = response.data;
                        $rootScope.removeMessage();
                    })
                .catch(function (response)
                    {
                        $rootScope.messageError(response.data);
                    }
                );
        };

        self.getPostById = function (id)
        {
            //devConsoleLog(self.postData);
            $rootScope.messageInfo('Loading...');
            postService.getPostById(id)
                .then(
                    function (response)
                    {
                        //self.postSingle = response.data.post;
                        self.postSingle = response.data;
                        $rootScope.removeMessage();
                    })
                .catch(function (response)
                    {
                        $rootScope.messageError(response.data);
                    }
                );
        };

        self._init = function ()
        {
            self.listPublishedPosts();
        };

        self._initPostSingle = function ()
        {
            devConsoleLog("_initPostSingle");
            self.getPostById($routeParams.id);
        };
    }

})();
