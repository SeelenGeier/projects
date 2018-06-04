class Dialog {
    constructor(title, message, parent, confirm = false) {
        this.parent = parent;
        this.confirm = confirm;

        // add grey background to block input outside of dialog box
        this.greyBackground = parent.scene.add.sprite(parent.scene.sys.game.config.width/2,parent.scene.sys.game.config.height/2,'blackBackground');
        this.greyBackground.setScale(parent.scene.sys.game.config.width/this.greyBackground.width,parent.scene.sys.game.config.height/this.greyBackground.height);
        this.greyBackground.alpha = 0.7;
        this.greyBackground.setInteractive();

        // add dialog box in center of screen
        this.dialogBackground = parent.scene.add.sprite(parent.scene.sys.game.config.width/2,parent.scene.sys.game.config.height/2,'dialogBackground');

        // add title to message box
        this.title = parent.scene.add.text(parent.scene.sys.game.config.width/2, parent.scene.sys.game.config.height/2-30, title, { fontFamily: config.default.setting.fontFamily, fontSize: 16, color: '#ffffff' });
        this.title.setOrigin(0.5, 0.5);

        // add text to dialog box
        this.message = parent.scene.add.text(parent.scene.sys.game.config.width/2, parent.scene.sys.game.config.height/2, message, { fontFamily: config.default.setting.fontFamily, fontSize: 16, color: '#ffffff' });
        this.message.setOrigin(0.5, 0.5);

        // scale dialog box to fit title and message
        var backgroundScale = (this.message.width+40)/this.dialogBackground.width;
        if(((this.title.width+40)/this.dialogBackground.width) > backgroundScale){
            backgroundScale = (this.title.width+40)/this.dialogBackground.width;
        }
        this.dialogBackground.setScale(backgroundScale, 1);

        if(confirm){
            // add YES Button
            new Button('buttonYES', 'buttonYes', parent.scene.sys.game.config.width/2+30, parent.scene.sys.game.config.height/2+30, parent.scene);
            parent.scene.buttonYES.on('pointerup', this.stopDialog, this);

            // add NO Button
            new Button('buttonNO', 'buttonNo', parent.scene.sys.game.config.width/2-30, parent.scene.sys.game.config.height/2+30, parent.scene);
            parent.scene.buttonNO.on('pointerup', this.stopDialog, this);
        }else{
            // add OK Button
            new Button('buttonOK', 'buttonYes', parent.scene.sys.game.config.width/2, parent.scene.sys.game.config.height/2+30, parent.scene);
            parent.scene.buttonOK.on('pointerup', this.stopDialog, this);
        }
    }

    stopDialog() {
        if(this.confirm) {
            this.parent.scene.buttonYES.destroy();
            this.parent.scene.buttonNO.destroy();
        }else {
            this.parent.scene.buttonOK.destroy();
        }
        this.message.destroy();
        this.title.destroy();
        this.dialogBackground.destroy();
        this.greyBackground.destroy();
    }
}