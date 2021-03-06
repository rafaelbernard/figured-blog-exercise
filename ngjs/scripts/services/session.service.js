(function ()
{
    //"use strict";
    angular
        .module('app')
        .service('Session', Session);

    Session.$inject = ['localStorageService', "timestampToDateObjectFilter"];

    function Session(localStorageService, timestampToDateObjectFilter)
    {
        var self = this;

        self.user  = null;
        self.token = null;

        // BOOLEAN
        var logged = false;

        // OBJECTS - MODELOS
        var AUTH_MODEL_DATA = {
            _login: {createdat: null},
            id: "",
            email: "",
            name: "",
            token: {},
            object: {},
            getId: function ()
            {
                return this.id;
            }
        };

        var armazenarEmLocalStorage = function ()
        {
            //devConsoleLog("sessao._armazenarEmLocalStorage");
            localStorageService.set("user", self.user);
        };

        var deleteLocalStorage = function ()
        {
            //devConsoleLog("sessao._limparLocalStorage");
            localStorageService.remove('user');
        };

        var recoverLocalStorage = function ()
        {
            devConsoleLog("sessao._recoverLocalStorage");
            var localStorage = localStorageService.get('user');
            //devConsoleLog(localStorage);

            if (localStorage)
            {
                if (!validLocalStorage(localStorage))
                {
                    devConsoleLog("!validLocalStorage(localStorage)");
                    return;
                }

                self.setLogged(true);
                self.setAuthenticationData(localStorage, localStorage.token);

                devConsoleLog(self.token);
            }
        };

        var validLocalStorage = function (localStorage)
        {
            devConsoleLog("sessao.var.validLocalStorage");

            // @todo implement front-end token expiration
            return true;

            if (localStorage._login && localStorage._login.createdat)
            {
                var _DATE_NOW                            = new Date();
                //devConsoleLog("_DATE_NOW: " + _DATE_NOW);
                var _DATE_NOW_TIMEZONE_OFFSET_IN_MINUTES = _DATE_NOW.getTimezoneOffset();
                /**
                 * convert to ms
                 * @type {number}
                 */
                var millisecondsDateNowTimezoneOffset    = (_DATE_NOW_TIMEZONE_OFFSET_IN_MINUTES * 60 * 1000);
                var millisecondsDateNowWithOffset        = (_DATE_NOW.getTime() - millisecondsDateNowTimezoneOffset);

                var _MINUTOS_VALIDADE_DADOS_LOCAL_STORAGE  = 60;
                //devConsoleLog("_MINUTOS_VALIDADE_DADOS_LOCAL_STORAGE: " + _MINUTOS_VALIDADE_DADOS_LOCAL_STORAGE);
                var milissegundosValidadeDadosLocalStorage = _MINUTOS_VALIDADE_DADOS_LOCAL_STORAGE * 60 * 1000;
                var milissegundosSessaoLocalStorage        = timestampToDateObjectFilter(localStorage._login.createdat).getTime();
                //devConsoleLog("localStorage._login.inclusao: " + localStorage._login.inclusao);

                if ((millisecondsDateNowWithOffset - milissegundosSessaoLocalStorage) < milissegundosValidadeDadosLocalStorage)
                {
                    //devConsoleLog("valida");
                    // renovando?
                    //devConsoleLog("teste de renovacao de sessao");
                    localStorage._login.createdat = _DATE_NOW;
                    return true;
                }
            }

            //devConsoleLog("invalid");
            return false;
        };

        self.isUserLoggedOrLocalStorageV1 = function ()
        {
            devConsoleLog("session.isUserLoggedOrLocalStorageV1");

            if (!self.getUser())
            {
                recoverLocalStorage();
            }

            return (self.getLogged() && self.getUser());
        };

        self.getLogged = function ()
        {
            return logged;
        };

        self.setLogged = function (value)
        {
            logged = Boolean(value);
            return self;
        };

        self.cleanSessionData = function ()
        {
            //devConsoleLog("sessao.cleanSessionData");
            self.setLogged(false);
            self.user = null;
            deleteLocalStorage();
        };

        self.getUser = function ()
        {
            //devConsoleLog("sessao.getUser");
            return self.user;
        };

        self.setUser = function (data)
        {
            //devConsoleLog("sessao.setUser");
            self.setAuthenticationData(data);
        };

        self.getToken = function ()
        {
            return self.token;
        };

        self.setAuthenticationData = function (user, token)
        {
            //devConsoleLog("sessao.setAuthenticationData");
            self.user       = user;
            self.user.token = token || {};
            self.token      = token || {};
            armazenarEmLocalStorage();
        };

    }
})();