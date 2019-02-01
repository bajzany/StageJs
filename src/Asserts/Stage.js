(function(){
    var Stage = {};
    window.Stage = Stage;
    Stage.version = '1.0';
    Stage.extensions = {};
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

})();


