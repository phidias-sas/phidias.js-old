Estructura de directorios:

phidias-js/
    angular
        src/
    polymer
    js
    scss
    css






Estructura de una APP:

/
    bower.json  // {"directory":"public/bower_components"}
    
    gulpfile.js
        ...
        phidias.angular('src/angular', 'public/angular');
        gulp-vulcanize (etc etc)


    src/
        angular/
            application/
            global/
        index.html  // <link rel="import" href="bower_components/... dependencies...." >
                    // <link rel="import" href="angular/app.min.js" >

    public/
        bower_components/
            phidias-js/
                angular/
                polymer/
                vanilla/
                ...
        angular/
            // built angular files
        img/
        index.html  // src/index.html vulcanized
        
