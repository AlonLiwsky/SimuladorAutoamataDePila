class Transicion {

    constructor(estadoOrigenVar, caracterCintaVar, caracterLecturaPilaVar, caracterEscrituraPilaVar, estadoDestinoVar) {
        this.estadoOrigen = estadoOrigenVar;
        this.estadoDestino = estadoDestinoVar;
        this.caracterLecturaPila = caracterLecturaPilaVar;
        this.caracterEscrituraPila = caracterEscrituraPilaVar;
        this.caracterCinta = caracterCintaVar;
    }
    
    getEstadoOrigen(){return this.estadoOrigen;}
    getCaracterCinta(){return this.caracterCinta;}
    getCaracterLecturaPila(){return this.caracterLecturaPila;}
    getCaracterEscrituraPila(){return this.caracterEscrituraPila;}
    getEstadoDestino(){return this.estadoDestino;}
    
//    esValida(caracterLecturaPila, caracterEscrituraPila){
//        if();
//    }
}