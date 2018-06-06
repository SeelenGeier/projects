class Button {
    constructor(name, spritesheet, x, y, parent) {
        this.parent = parent;
        this.name = name;
        parent[name] = parent.add.image(x, y, spritesheet);
        parent[name].setInteractive();
        parent[name].on('pointerover', this.hoverOn, this);
        parent[name].on('pointerout', this.hoverOff, this);
        parent[name].on('pointerdown', this.buttonDown, this);
        parent[name].on('pointerup', this.buttonUp, this);
    }
    
    hoverOn(){
        this.parent[this.name].setFrame(1);
    }
    
    hoverOff(){
        this.parent[this.name].setFrame(0);
    }
    
    buttonDown(){
        this.parent[this.name].setFrame(2);
    }
    
    buttonUp(){
        this.parent[this.name].setFrame(1);
    }
}