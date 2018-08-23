class Estado {

    constructor(ID, inicial, final) {
        this.id = ID;
        this.final = final;
        this.inicial = inicial;
    }
    
    getID(){return this.id;}
    
    getInicial(){return this.inicial;}
    
    getFinal(){return this.final;}
    
}