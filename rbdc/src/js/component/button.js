class Button {
    constructor(name, buttonImage, x, y, parent) {
        this.parent = parent;
        this.name = name;
        if(Array.isArray(buttonImage)) {
            parent[name] = parent.add.sprite(x, y, buttonImage[0], buttonImage[1]);
            if(buttonImage.length > 2) {
                parent[name].setTint(buttonImage[2]);
            }
        }else {
            parent[name] = parent.add.image(x, y, buttonImage);
        }
        // add clickable overlay
        parent[name].setInteractive();
        parent[name].on('pointerover', this.hoverOn, this);
        parent[name].on('pointerout', this.hoverOff, this);
        parent[name].on('pointerdown', this.buttonDown, this);
        parent[name].on('pointerup', this.buttonUp, this);
    }

    buttonDown() {
        this.parent[this.name].y = this.parent[this.name].y + 2;
    }

    buttonUp() {
        this.parent[this.name].y = this.parent[this.name].y - 2;
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