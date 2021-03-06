(function ()
{

    angular.module("app")
        .controller('PostController', PostController);

    PostController.$inject = [
        '$rootScope',
        '$routeParams',
        'PostService',
        "ErrorHandlerService"
    ];

    function PostController($rootScope, $routeParams, postService, errorHandler)
    {
        $rootScope.verifyAuthentication();

        var self = this;

        self.postData = {};

        self._creating         = false;
        self._updating         = false;
        self.requestInProgress = false;

        self.prepareAddPost = function ()
        {
            devConsoleLog("prepareAddPost");
            self._creating             = true;
            self._updating             = false;
            self.postData              = {};
            self.postData.is_published = 1;
        };

        self.prepareEditPost = function (post)
        {
            devConsoleLog("prepareEditPost");
            self._creating        = false;
            self._updating        = true;
            self.postData         = angular.copy(post);
            self.postDataOriginal = post;
        };

        self.resetForm = function ()
        {
            self._creating = false;
            self._updating = false;
            self.postData  = {};
        };

        self.createPost = function ()
        {
            //devConsoleLog(self.postData);
            self.requestInProgress = true;
            $rootScope.messageInfo('Processing...');
            postService.createPost(self.postData)
                .then(
                    function (response)
                    {
                        //devConsoleLog(response.data);

                        self._creating         = false;
                        self._updating         = false;
                        self.requestInProgress = false;
                        self.postData          = {};
                        $rootScope.messageSuccess(response.data.message || "Success");

                        self.listPosts();
                    })
                .catch(function (response)
                    {
                        self.requestInProgress = false;
                        $rootScope.messageError(response.data);
                    }
                );
        };

        self.updatePost = function ()
        {
            //devConsoleLog(self.postData);
            self.requestInProgress = true;
            $rootScope.messageInfo('Processing...');
            postService.updatePost(self.postData)
                .then(
                    function (response)
                    {
                        //devConsoleLog(response.data);

                        self._creating         = false;
                        self._updating         = false;
                        self.requestInProgress = false;
                        self.postData          = {};
                        $rootScope.messageSuccess(response.data.message || "Success");

                        self.listPosts();
                    })
                .catch(function (response)
                    {
                        self.requestInProgress = false;
                        $rootScope.messageError(response.data);
                    }
                );
        };

        self.savePost = function ()
        {
            if (self._updating)
            {
                return self.updatePost();
            }

            return self.createPost();
        };

        self.listPosts = function (query)
        {
            //devConsoleLog(self.postData);

            if (!query)
            {
                query = {};
            }

            $rootScope.messageInfo('Loading posts...');
            postService.listPosts(query)
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

        self.deletePost = function (id)
        {
            //devConsoleLog(self.postData);
            $rootScope.messageInfo('Deleting...');
            postService.deletePost(id)
                .then(
                    function ()
                    {
                        $rootScope.removeMessage();
                        self.listPosts();
                    })
                .catch(function (response)
                    {
                        $rootScope.messageError(response.data);
                    }
                );
        };

        self._initListPosts = function ()
        {
            //$rootScope.verifyAuthentication();
            self.listPosts();
        };

        self._initPostSingle = function ()
        {
            self.getPostById($routeParams.id);
        };
    }

})();
