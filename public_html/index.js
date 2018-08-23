/* global go */

var estados = [];
var transiciones = [];
var nodeDataArray = [];
var linkDataArray = [];
var diagram;
var ordenTransiciones = [];
var i = 0;
$(document).ready(function () {

    cargarDiagrama();
    $("#selectEstadoOrigen").on("change", function () {
        $modal = $('#modalEstado');
        if ($(this).val() === 'Añadir estado...') {
            $modal.modal('show');
        }
    });
    $("#selectCaracterCinta").on("change", function () {
        $modal = $('#modalCinta');
        if ($(this).val() === 'Añadir caracter de cinta...') {
            $modal.modal('show');
        }
    });
    $("#selectCaracterLecturaPila").on("change", function () {
        $modal = $('#modalPila');
        if ($(this).val() === 'Añadir caracter de pila...') {
            $modal.modal('show');
        }
    });
    $("#selectCaracterEscrituraPila").on("change", function () {
        $modal = $('#modalPila');
        if ($(this).val() === 'Añadir caracter de pila...') {
            $modal.modal('show');
        }
    });
    $("#selectEstadoDestino").on("change", function () {
        $modal = $('#modalEstado');
        if ($(this).val() === 'Añadir estado...') {
            $modal.modal('show');
        }
    });
});
//Instanciar cada estado
function addEstado() {
    //var final = $("checkFinal").checked;
    var cantDeEstados = estados.length;
    if ($("#checkFinal").is(':checked') && $("#checkInicial").is(':checked')) {
        estados.push(new Estado("q" + cantDeEstados, true, true));
        nodeDataArray.push({key: "q" + cantDeEstados, ancho: 6, color: "yellow"});
    } else if ($("#checkFinal").is(':checked')) {
        estados.push(new Estado("q" + cantDeEstados, false, true));
        nodeDataArray.push({key: "q" + cantDeEstados, ancho: 6, color: "lightblue"});
    } else if ($("#checkInicial").is(':checked')) {
        estados.push(new Estado("q" + cantDeEstados, true, false));
        nodeDataArray.push({key: "q" + cantDeEstados, ancho: 1, color: "yellow"});
    } else {
        estados.push(new Estado("q" + cantDeEstados, false, false));
        nodeDataArray.push({key: "q" + cantDeEstados, ancho: 1, color: "lightblue"});
    }
    //ActualizarDiagramaJSON();

    //Agregar estado a la lista de opciones y seleccionarlo
    $('#selectEstadoOrigen').append($('<option>', {
        value: "q" + cantDeEstados,
        text: "q" + cantDeEstados
                //selected: true
    }));
    $('#selectEstadoDestino').append($('<option>', {
        value: "q" + cantDeEstados,
        text: "q" + cantDeEstados
                //selected: true
    }));
}

//Agregar una opcionde caracter de cinta
function addCaracterCinta() {
    var caracter = $('#inputCaracterCinta').val();
    $('#selectCaracterCinta').append($('<option>', {
        value: caracter,
        text: caracter,
        selected: true
    }));
}

//Agregar una opcionde caracter de pila
function addCaracterPila() {
    var caracter = $('#inputCaracterPila').val();
    $('#selectCaracterEscrituraPila').append($('<option>', {
        value: caracter,
        text: caracter
    }));
    $('#selectCaracterLecturaPila').append($('<option>', {
        value: caracter,
        text: caracter
    }));
}

//Instanciar transicion
function agregarTranscion() {
    var estadoOrigen = $('#selectEstadoOrigen').val();
    var caracterCinta = $('#selectCaracterCinta').val();
    var caracterLecturaPila = $('#selectCaracterLecturaPila').val();
    var caracterEscrituraPila = $('#selectCaracterEscrituraPila').val();
    var estadoDestino = $('#selectEstadoDestino').val();
    var nulo = estadoOrigen === null || caracterCinta === null || caracterLecturaPila === null || caracterEscrituraPila === null || estadoDestino === null;
    var sinComp = estadoOrigen === "Añadir estado..." || caracterCinta === "Añadir caracter de cinta..." || caracterLecturaPila === "Añadir caracter de pila..." || caracterEscrituraPila === "Añadir caracter de pila..." || estadoDestino === "Añadir estado...";
    if (nulo || sinComp) {
        alert("Seleccione al menos una opcion para cada campo");
    } else {
        for (var estado of estados) {
            if (estado.getID() === estadoOrigen) {
                estadoOrigen = estado;
                console.log("estado de origen asociado");
            }
            if (estado.getID() === estadoDestino) {
                estadoDestino = estado;
                console.log("estado de destino asociado");
            }
        }

        var transicion = new Transicion(estadoOrigen, caracterCinta, caracterLecturaPila, caracterEscrituraPila, estadoDestino);
        var encontro = false;
        agregarTransicionAlGrafico(transicion);
        transiciones.push(transicion);
        ActualizarDiagramaJSON();
    }
}

//Instanciar el diagrama
function cargarDiagrama() {
    diagram = new go.Diagram("myDiagramDiv");
    var A = go.GraphObject.make;
    diagram.nodeTemplate =
            A(go.Node, "Auto",
                    new go.Binding("location", "loc", go.Point.parse),
                    A(go.Shape, "Ellipse",
                            new go.Binding("fill", "color"),
                            new go.Binding("strokeWidth", "ancho")),
                    A(go.TextBlock, {margin: 5},
                            new go.Binding("text", "key"))
                    );
    diagram.linkTemplate =
            A(go.Link, { curve: go.Link.Bezier },
                    A(go.Shape, new go.Binding("stroke", "color"), new go.Binding("strokeWidth", "thick")), // this is the link shape (the line)
                    A(go.Shape, {toArrow: "Standard"}), // this is an arrowhead
                    A(go.TextBlock, // this is a Link label
                            new go.Binding("text", "text"), {segmentOffset: new go.Point(0, -10)})
                    );
    diagram.scale = 1.4;
    diagram.animationManager.isInitial = false;
    diagram.initialContentAlignment = go.Spot.Center;
//    var nodeDataArray = [
//        {key: "q0", loc: "0 0"},
//        {key: "q1", loc: "100 50"}
//    ];
//    var linkDataArray = [
//        {from: "q0", to: "q1", text: "a, Zo/X"},
//        {from: "q0", to: "q1", text: "a, Y/X"},
//        {from: "q0", to: "q0", text: "a, Y/X"}
//    ];
//    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}

//Agregar al diagrama la transicion
function agregarTransicionAlGrafico(t) {
    var texto = t.getCaracterCinta() + ", " + t.getCaracterLecturaPila() + "/" + t.getCaracterEscrituraPila();
    linkDataArray.push(
            {from: t.getEstadoOrigen().getID(), to: t.getEstadoDestino().getID(), text: texto, color: "black", thick: 1}
    );
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
//    linkDataArray[0].color = "red";
//    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);

}

//Probar la tira
function probarTira() {
    ordenTransiciones = [];
    if (validarTira()) {

        var tira = $("#inputTira").val();
        //transformo la tira en aun array con cada letra
        tira = tira.split("");
        //Busco el estado inicial para arrancar por ahi
        for (var estado of estados) {
            if (estado.getInicial()) {
                var estadoActual = estado;
            }
        }
//Inicializo la pila con Z0
        var pila = ["Z0"];
        //se iterara hasta terminar la tira
        while (tira.length > 0) {

//Leeo el primer caracter de la tira
            var caracterActual = tira[0];
            tira.splice(0, 1);
            //Busco las transiciones que salgan del estado acutual
            var transicionesEstado = [];
            for (var transicion of transiciones) {
                //Se los pasa a JSON para que js los vea como el mismo objeto a pesar de que estan instanciados como distintos
                if (JSON.stringify(transicion.getEstadoOrigen()) === JSON.stringify(estadoActual)) {
                    transicionesEstado.push(transicion);
                }
            }


//var transicionesEstado = estadoActual.getTransiciones();
            var encontroAlgo = 0;
            for (var transicion of transicionesEstado) {

//Reviso en cada transicion si se puede entrar con mi caracter
                if (transicion.getCaracterCinta() === caracterActual) {

//Reviso si puedo entrar con mi pila actual                    
                    if (transicion.getCaracterLecturaPila() === pila[pila.length - 1] || transicion.getCaracterLecturaPila() === 'λ') {
//Quiero ver cuantas veces entra para ver si es determinista o no, a la primera vez que entre guardo esa transicion
//y si luego de iterar entro solo una vez too esa transicion como valida
                        if (encontroAlgo === 0) {
                            var transicionValida = transicion;
                        }
                        encontroAlgo++;
                    } else {
//                        console.log("La tira no es valida por la pila");
//                        break;
                    }
                } else {
//                    console.log("la tira no es valida por caracter de cinta");
//                    break;
                }
            }

            if (encontroAlgo === 0) {
                informarResultados("Tira no valida");
                return;
            } else if (encontroAlgo === 1) {
//Tomar transicion
//Elijo esa transicion y actualizo mi contexto

//Actualizo la pila
                pila.pop();
                var escrituraEnPila = transicionValida.getCaracterEscrituraPila().split('');
                //Si la transicion devuelve λ a la pila, no agregar nada
                if (escrituraEnPila[0] !== 'λ') {
                    //En caso de q se esciba en pila "Z0", no tomarlo como dos caracteres diferentes
                    if(escrituraEnPila[0] !== 'Z' && escrituraEnPila[1] !== '0'){
                        for (var i = (escrituraEnPila.length - 1); i >= 0; i--) {
                            pila.push(escrituraEnPila[i]);
                        }
                    }else{
                        pila.push("Z0");
                    }
                    
                }

//Actualizo estado actual
                estadoActual = transicionValida.getEstadoDestino();
                ordenTransiciones.push(transicionValida);
            } else if (encontroAlgo > 1) {
                informarResultados("Automata no determinista");
                return;
            }

        }

//Luiego de vaciar la tira reviso en que estado quedo el automata y la pila
        if (tira.length === 0 && pila.length === 0 && estadoActual.getFinal()) {
            informarResultados("Tira valida");
        } else if (pila.length === 0) {
            informarResultados("La tira no termina en un estado final");
        } else if (estadoActual.getFinal()) {
            informarResultados("La tira no termina con pila vacia");
        } else {
            informarResultados("Tira vacia - algo paso porq no salio por ninguna otra causa");
        }
//AGREGAR VALIDACION DE SI EL AUTOMATA ES VALIDO CON TIRA VACIA




    }
}

//Verificar si el formato es valido
function validarTira() {
    var tira = $("#inputTira").val();
    var hayEstadoFinal = false;
    var unEstadoInicial = 0;
    //Verificio q haya un estado inical (solo 1) y que haya al menos un estado final
    for (var estado of estados) {
        if (estado.getInicial()) {
            unEstadoInicial++;
        }
        if (estado.getFinal()) {
            hayEstadoFinal = true;
        }
    }


    if (unEstadoInicial !== 1) {
        alert("Se requiere de un estado inicial");
        return false;
    } else if (!hayEstadoFinal) {
        alert("Se requiere de un estado final");
        return false;
        //Verfico que la tira sea solo texto en minuscula
    } else if (!soloTextoMinuscula(tira)) {
        alert("La tira no es valida");
        return false;
    } else {
        return true;
    }

}

function soloTextoMinuscula(tira) {
    return /^[a-z]*$/g.test(tira);
}

function mostrarAvance() {
    var transicionValida = ordenTransiciones[i];
    diagram.model.startTransaction("negro");
    var links = diagram.model.linkDataArray;
    for (var link of links) {

        diagram.model.setDataProperty(link, "color", "black");
        diagram.model.setDataProperty(link, "thick", 1);
    }
    diagram.model.commitTransaction("negro");
    var from = transicionValida.getEstadoOrigen().getID();
    var to = transicionValida.getEstadoDestino().getID();
    var text = transicionValida.getCaracterCinta() + ", " + transicionValida.getCaracterLecturaPila() + "/" + transicionValida.getCaracterEscrituraPila();
    diagram.model.startTransaction("ahora");
    var links = diagram.model.linkDataArray;
    for (var link of links) {
        if (link.from === from && link.to === to && link.text === text) {
            diagram.model.setDataProperty(link, "color", "red");
            diagram.model.setDataProperty(link, "thick", 3);
        }
    }
    diagram.model.commitTransaction("ahora");
    i++;
    if (i >= ordenTransiciones.length) {
        i = 0;
    }
}

function informarResultados(resultado) {
    document.getElementById("textInforme").innerHTML = resultado;
    document.getElementById("btnMostrarAvance").style.display = "block";
}

function ActualizarDiagramaJSON() {//No utilizada
    var obj = {estados, transiciones};
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(obj));
    document.getElementById("descargar").href = "data:" + data;
    document.getElementById("descargar").download = "automata.json";
}

function processFiles(files) {
    var file = files[0];
    var reader = new FileReader();
    var datos;
    reader.onload = function (e) {
        datos = JSON.parse(e.target.result);
        mostrar(datos);
    };
    reader.readAsText(file);
}

function mostrar(datos) {
    nodeDataArray = [];
    linkDataArray = [];
    
    console.log(datos["estados"]);
    estados = [];
    for(var est of datos["estados"]){
        estados.push(Object.assign(new Estado, est));
    }
    console.log(estados);
    
    transiciones = [];
    for(var tra of datos["transiciones"]){
        tra.estadoOrigen = Object.assign(new Estado, tra.estadoOrigen);
        tra.estadoDestino = Object.assign(new Estado, tra.estadoDestino);
        transiciones.push(Object.assign(new Transicion, tra));
    }

    //Quitar las opciones actuales
    $('#selectEstadoOrigen').children().remove();

    //agregar las opciones por defecto        
    $('#selectEstadoOrigen').append($('<option value="" selected disabled>Estado de origen</option>'));
    $('#selectEstadoOrigen').append($('<option data-toggle="modal" data-target="#modalEstado" value="Añadir estado...">Añadir estado...</option>'));

    //Pasar estados al diagrama y agregarlos a los selects
    for (var estado of estados) {
        if (estado.getFinal() && estado.getInicial()) {
            nodeDataArray.push({key: estado.getID(), ancho: 6, color: "yellow"});
        } else if (estado.getFinal()) {
            nodeDataArray.push({key: estado.getID(), ancho: 6, color: "lightblue"});
        } else if (estado.getInicial()) {
            nodeDataArray.push({key: estado.getID(), ancho: 1, color: "yellow"});
        } else {
            nodeDataArray.push({key: estado.getID(), ancho: 1, color: "lightblue"});
        }

        //Agregar estado a la lista de opciones
        $('#selectEstadoOrigen').append($('<option>', {
            value: estado.getID(),
            text: estado.getID()
        }));
        $('#selectEstadoDestino').append($('<option>', {
            value: estado.getID(),
            text: estado.getID()
                    //selected: true
        }));
    }

    //quitar las opciones viejas
    $('#selectCaracterCinta').children().remove();
    $('#selectCaracterEscrituraPila').children().remove();
    $('#selectCaracterLecturaPila').children().remove();

    //Agregar las opciones por defecto
    $('#selectCaracterCinta').append($('<option value="" selected disabled>Caracter de cinta</option>'));
    $('#selectCaracterCinta').append($('<option data-toggle="modal" data-target="#modalCinta">Añadir caracter de cinta...</option>'));

    $('#selectCaracterEscrituraPila').append($('<option value="" selected disabled>Caracter de pila lectura</option>'));
    $('#selectCaracterEscrituraPila').append($('<option data-toggle="modal" data-target="#modalPila">Añadir caracter de pila...</option>'));
    $('#selectCaracterEscrituraPila').append($('<option>λ</option>'));
    $('#selectCaracterEscrituraPila').append($('<option>Z0</option>'));

    $('#selectCaracterLecturaPila').append($('<option value="" selected disabled>Caracter de pila de escritura</option>'));
    $('#selectCaracterLecturaPila').append($('<option data-toggle="modal" data-target="#modalPila">Añadir caracter de pila...</option>'));
    $('#selectCaracterLecturaPila').append($('<option>λ</option>'));
    $('#selectCaracterLecturaPila').append($('<option>Z0</option>'));

    //pasar transiciones al diagrama
    for (var t of transiciones) {
        //Agregarlo al diagrama
        var texto = t.getCaracterCinta() + ", " + t.getCaracterLecturaPila() + "/" + t.getCaracterEscrituraPila();
        linkDataArray.push(
                {from: t.getEstadoOrigen().getID(), to: t.getEstadoDestino().getID(), text: texto, color: "black", thick: 1}
        );

        var caracter = t.getCaracterCinta();
        $('#selectCaracterCinta').append($('<option>', {
            value: caracter,
            text: caracter
        }));
        var caracter = t.getCaracterEscrituraPila();
        $('#selectCaracterEscrituraPila').append($('<option>', {
            value: caracter,
            text: caracter
        }));
        $('#selectCaracterLecturaPila').append($('<option>', {
            value: caracter,
            text: caracter
        }));
    }

    
    //Actualizar grafico
    diagram.model = new go.GraphLinksModel(nodeDataArray, linkDataArray);
}