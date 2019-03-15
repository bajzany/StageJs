(function(){
    var Stage = {};
    window.Stage = Stage;
    Stage.version = '1.0';
    Stage.extensions = {};
    Stage.components = {};
    Stage.Parameters = {};

    /**
     * @param {{}} parameters
     */
    Stage.setParameters = function(parameters) {
        Object.assign(Stage.Parameters, parameters);
    };

    /**
     * @param name
     * @param extension
     */
    Stage.addExtension = function(name, extension){

        if(typeof Stage.extensions[name] !== "undefined"){
            console.error("Extension "+name+" exist");
            return;
        }
        if(typeof extension !== "object"){
            console.error("TODO");
            return;
        }
        Stage.extensions[name] = extension;
    };

    /**
     * @param name
     * @param component
     */
    Stage.addComponent = function(name, component){

        if(typeof Stage.extensions[name] !== "undefined"){
            console.error("Component "+name+" exist");
            return;
        }
        if(typeof component !== "object"){
            console.error("TODO");
            return;
        }
        Stage.components[name] = component;
    };

    Stage.getComponentByName = function (name) {

        if(typeof Stage.components[name] === "undefined"){
            console.error("Component "+name+" doesn't exist");
            return;
        }

        return Stage.components[name];
    };

    Stage.getExtensionByName = function (name) {

        if(typeof Stage.extensions[name] === "undefined"){
            console.error("Extension "+name+" doesn't exist");
            return;
        }

        return Stage.extensions[name];
    };


    /**
     * ON BUILD METHOD
     */
    Stage.build = function() {
        $.each(Stage.extensions, function (i, extension) {
            if(typeof extension.onBuild === "function"){
                extension.onBuild(Stage);
            }
        });

        $.each(Stage.components, function (i, component) {
            if(typeof component.onBuild === "function"){
                component.onBuild(Stage);
            }
        });
    };

    /**
     * INIT METHODS
     */
    Stage.init = function() {
        $.each(Stage.extensions, function (i, extension) {
            if(typeof extension.init === "function"){
                extension.init(Stage);
            }
        });

        $.each(Stage.components, function (i, component) {
            if(typeof component.init === "function"){
                component.init(Stage);
            }
        });
    };

    /**
     * RUN STAGE
     * @return {Stage}
     */
    Stage.run = function () {
        Stage.build();
        Stage.init();
        return Stage;
    };


    /**
     * @param newObject
     * @param Stage
     * @return {{}}
     */
    this.createInstance = function(newObject, Stage) {
        return new newObject(Stage);
    };


    /**
     * @param {string} url_string
     * @return {*}
     */
    Stage.validateUrl = function (url_string) {
        var pat = /^https?:\/\//i;
        if (!pat.test(url_string))
        {
            var a = document.createElement('a');
            a.href = url_string;
            url_string = a.href;
        }

        return url_string;
    }

})();

