class Button {
    constructor(name, buttonImage, x, y, parent) {
        this.parent = parent;
        this.name = name;
        parent[name] = parent.add.sprite(x, y, 'uipack_rpg').setFrame('buttonSquare_beige.png');
        parent[name].buttonImage = parent.add.image(parent[name].x, parent[name].y, buttonImage);
        // add clickable overlay
        parent[name].setInteractive();
        parent[name].on('pointerover', this.hoverOn, this);
        parent[name].on('pointerout', this.hoverOff, this);
        parent[name].on('pointerdown', this.buttonDown, this);
        parent[name].on('pointerup', this.buttonUp, this);
    }

    buttonDown() {
        this.parent[this.name].setFrame('buttonSquare_beige_pressed.png');
        this.parent[this.name].buttonImage.y = this.parent[this.name].buttonImage.y + 2;
    }

    buttonUp() {
        this.parent[this.name].setFrame('buttonSquare_beige.png');
        this.parent[this.name].buttonImage.y = this.parent[this.name].buttonImage.y - 2;
    }

    hoverOff() {
        if (this.parent.input.activePointer.isDown) {
            this.buttonUp();
        }
    }

    hoverOn() {
        if (this.parent.input.activePointer.isDown) {
            this.buttonDown();
        }
    }
}