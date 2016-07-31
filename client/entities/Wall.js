var Wall = function(renderer, material) {
    this.renderer = renderer;
    this.boxShape;
    this.boxBody;
    this.graphics;

    this.initShape(material);
    this.initBody();
    this.createGraphics();
};

Wall.prototype.initShape = function(material) {
    this.boxShape = new p2.Box({width: 2, height: 1, material: material});
};

Wall.prototype.initBody = function() {
    this.boxBody = new p2.Body({
        mass: 15,
        position: [0,2],
        angularDamping:.8
    });
    this.boxBody.damping = .8;
    this.boxBody.allowSleep = true;
    this.boxBody.sleepSpeedLimit = 1;
    this.boxBody.sleepTimeLimit = 1;
    this.boxBody.addShape(this.boxShape);
};

Wall.prototype.createGraphics = function() {
    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(0xff0000);
    this.graphics.drawRect(-this.boxShape.width/2, -this.boxShape.height/2, this.boxShape.width, this.boxShape.height);

    this.renderer.container.addChild(this.graphics);
};

Wall.prototype.draw = function() {
    this.graphics.position.x = this.boxBody.position[0];
    this.graphics.position.y = this.boxBody.position[1];
    this.graphics.rotation = this.boxBody.angle;
};

module.exports = Wall;