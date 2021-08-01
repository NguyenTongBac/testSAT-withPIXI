//Aliases
let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Graphics = PIXI.Graphics,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Text = PIXI.Text,
    TextStyle = PIXI.TextStyle;

// create canvas
let app = new PIXI.Application({
    width: 800,
    height: 800,
    antialiasing: true,
    transparent: false,
    resolution: 1,
});
document.body.appendChild(app.view);
app.renderer.view.style.position = "absolute";
app.renderer.view.style.left = "50%";
app.renderer.view.style.top = "50%";
app.renderer.view.style.transform = "translate(-50%,-50%)";
app.renderer.view.style.border = "2px solid black";
app.renderer.backgroundColor = 0x808080;
// var canvas = document.getElementsByName("canvas");
// var ctx = canvas.getContext('2d');
// create polygon 

var speed = 3;
var
    a1 = new xy(0, 0),
    a2 = new xy(200, 20),
    a3 = new xy(300, 100),
    a4 = new xy(100, 150),
    adx = speed,
    ady = speed

var A = [a1, a2, a3, a4];
var B
b1 = new xy(600, 600),
    b2 = new xy(800, 700),
    b3 = new xy(700, 800),
    b4 = new xy(400, 700),
    bdx = -speed,
    bdy = -speed

var B = [b1, b2, b3, b4];
//Make the game scene and add it to the stage
gameScene = new Container();
gameScene.height = 800;
gameScene.width = 800;
app.stage.addChild(gameScene);
// draw polygon A
var polA = new Graphics();
polA.beginFill(0x66CCFF);
polA.moveTo(A[0].x, A[0].y);
polA.lineTo(A[1].x, A[1].y);
polA.lineTo(A[2].x, A[2].y);
polA.lineTo(A[3].x, A[3].y);
polA.x = 100;
polA.y = 100;
polA.endFill();
gameScene.addChild(polA);

// draw polygon B
var polB = new Graphics();
polB.beginFill(0x66CCFF);
polB.moveTo(B[0].x, B[0].y);
polB.lineTo(B[1].x, B[1].y);
polB.lineTo(B[2].x, B[2].y);
polB.lineTo(B[3].x, B[3].y);
polB.x = -100;
polB.y = -100;
polB.endFill();
gameScene.addChild(polB);
var appWidth = 800;
var appHeight = 800;


// draw
let verticesA = [A[0], A[1], A[2], A[3]];
let edgesA = [vector(A[0], A[1]), vector(A[1], A[2]), vector(A[2], A[3]), vector(A[3], A[0])];

let verticesB = [B[0], B[1], B[2], B[3]];
let edgesB = [vector(B[0], B[1]), vector(B[1], B[2]), vector(B[2], B[3]), vector(B[3], B[0])];

let polygonA = new polygon(verticesA, edgesA);
let polygonB = new polygon(verticesB, edgesB);
var state;
loader
    .add("")
    .load(setup);

for (var i = 0; i < A.length; i++) {
    console.log(A[i].x, A[i].y)
}

function setup() {
    //Set the game state
    state = play;
    //Start the game loop 
    app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta) {
    //Update the current game state:
    state(delta);
}

function play(delta) {
    sat(polygonA, polygonB);
    polA.x += adx;
    polA.y += ady;
    polB.x += bdx;
    polB.y += bdy;
    collisionDetection();
}

// collision
function collisionDetection() {
    for (let i = 0; i < A.length; i++) {
        if (A[i].y + polA.y < 0 || A[i].y + polA.y > appHeight) {
            ady = -ady;
        } else if (A[i].x + polA.x <= 0 || A[i].x + polA.x > appWidth) {
            adx = -adx;
        }
    }
    for (let i = 0; i < B.length; i++) {
        if (B[i].x + polB.x < 0 || B[i].x + polB.x > appWidth) {
            bdx = -bdx;
        } else if (B[i].y + polB.y < 0 || B[i].y + polB.y > appHeight) {
            bdy = -bdy;
        }
    }
}

// Polygon
function polygon(vertices, edges) {
    this.vertex = vertices;
    this.edge = edges;
}

// vector
function vector(A, B) {
    return new xy((B.x - A.x), (B.y - A.y));
}

// xy
function xy(x, y) {
    this.x = x;
    this.y = y;
}

// sat
function sat(polygonA, polygonB) {
    let perpendicularLine = null;
    let dot = 0;
    let perpendicularStack = [];
    let amin, amax, bmin, bmax;
    for (let i = 0; i < polygonA.edge.length; i++) {
        perpendicularLine = new xy(-polygonA.edge[i].y, polygonA.edge[i].x);
        perpendicularStack.push(perpendicularLine);
    }
    for (let i = 0; i < polygonB.edge.length; i++) {
        perpendicularLine = new xy(-polygonB.edge[i].y, polygonB.edge[i].x);
        perpendicularStack.push(perpendicularLine);
    }
    for (let i = 0; i < perpendicularStack.length; i++) {
        amin = null;
        amax = null;
        bmin = null;
        bmax = null;
        for (let j = 0; j < polygonA.vertex.length; j++) {
            dot = ((polygonA.vertex[j].x + polA.x) * perpendicularStack[i].x) +
                ((polygonA.vertex[j].y + polA.y) * perpendicularStack[i].y);
            if (amax === null || dot > amax) {
                amax = dot;
            }
            if (amin === null || dot < amin) {
                amin = dot;
            }
        }
        for (var j = 0; j < polygonB.vertex.length; j++) {
            dot = ((polygonB.vertex[j].x + polB.x) * perpendicularStack[i].x) +
                ((polygonB.vertex[j].y + polB.y) * perpendicularStack[i].y);
            if (bmax === null || dot > bmax) {
                bmax = dot;
            }
            if (bmin === null || dot < bmin) {
                bmin = dot;
            }
        }
        if ((amin < bmax && amin > bmin) ||
            (bmin < amax && bmin > amin)) {
            continue;
        } else {
            return false;
        }
    }
    adx = -adx;
    ady = -ady;
    bdx = -bdx;
    bdy = -bdy;
}