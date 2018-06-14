class Button {
    constructor(name, buttonImage, x, y, parent) {
        this.parent = parent;
        this.name = name;
        parent[name] = parent.add.sprite(x, y, 'uipack_rpg').setFrame('buttonSquare_beige.png');
        parent[name].insideImage = parent.add.image(this.parent[name].x+this.parent[name].width/2, this.parent[name].y+this.parent[name].height/2, buttonImage);
        // add clickable overlay
        parent[name].setInteractive();
        parent[name].on('pointerover', this.hoverOn, this);
        parent[name].on('pointerout', this.hoverOff, this);
        parent[name].on('pointerdown', this.buttonDown, this);
        parent[name].on('pointerup', this.buttonUp, this);
    }

    buttonDown() {
        this.parent[this.name].setFrame('buttonSquare_beige_pressed.png');
    }

    buttonUp() {
        this.parent[this.name].setFrame('buttonSquare_beige.png');
    }

    hoverOff() {
        this.buttonUp();
    }

    hoverOn() {
        if (this.parent.input.activePointer.isDown) {
            this.buttonDown();
        }
    }
}