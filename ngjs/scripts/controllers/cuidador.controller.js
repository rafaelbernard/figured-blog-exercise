(function ()
{

    angular.module("app")
        .controller("CuidadorController", CuidadorController);

        CuidadorController.$inject = [
            "$rootScope",
        ];

    function CuidadorController($rootScope)
    {
        $rootScope.verificarAutenticacao();

        //var self = this;

    }

})();