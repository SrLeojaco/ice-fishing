var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var heightMin = 100;
var landBorder = 230;

var coins = 0;
var fish = 0;
var worms = 3;

var Entities = {}, EntityCount = 0;

var Rod = {
  x1: -15,
  y1: -15,
  x2: 15,
  y2: 15,
  x_pos: canvas.width / 2,
  y_pos: heightMin,
  colour: "#FFCACA",
  bitten: false,
  baitless: false,
  bite: function (type) {
    switch (type) {
      case "fluffy":
        this.colour = "#FCCB2D";
        this.fish = "fluffy";
        break;
      case "grey":
        this.colour = "#A09BA0";
        this.fish = "grey";
        break;
      case "mullet":
        this.colour = "#D74C42";
        this.fish = "mullet";
        break;
      default:
        this.colour = "#FCCB2D";
    };
    this.bitten = true;
    if (type === "mullet") {
      this.x1 = -100;
      this.y1 = -15;
      this.x2 = 100;
      this.y2 = 405;
    } else {
      this.x1 = -30;
      this.y1 = -15;
      this.x2 = 30;
      this.y2 = 115;
    };
  },
  fish: undefined,
  reeled: function () {
    fish++;
    this.bitten = false;
    this.x1 = -15;
    this.y1 = -15;
    this.x2 = 15;
    this.y2 = 15;
    this.colour = "#FFCACA";
    this.fish = undefined;
  },
  release: function () {
    this.bitten = false;
    this.x1 = -15;
    this.y1 = -15;
    this.x2 = 15;
    this.y2 = 15;
    this.colour = "#FFCACA";
    this.fish = undefined;
  },
  zap: function () {
    this.bitten = false;
    this.baitless = true;
    this.x1 = 0;
    this.y1 = 0;
    this.x2 = 0;
    this.y2 = 0;
    this.fish = undefined;
  },
  bait: function () {
    this.baitless = false;
    this.x1 = -15;
    this.y1 = -15;
    this.x2 = 15;
    this.y2 = 15;
    this.colour = "#FFCACA";
  },
};

function CreateFish() {
  this.x1 = -130;
  this.y1 = -30;
  this.x2 = 0;
  this.y2 = 30;
  this.x_pos = 0 - this.x2;
  this.y_pos = Math.floor((Math.random() * (canvas.height - landBorder - (this.y2 - this.y1) * 2)) + 1) + landBorder + (this.y2 - this.y1);
  this.speed = Math.random() * 3 + 2;
  this.colour = "#FCCB2D";
  this.collide = function () {
    if (Rod.bitten) {return}; // Don't catch if the line has a bite
    if (Rod.baitless) {return}; // Don't catch if the line doesn't have bait
    Rod.bite("fluffy");
    despawn(this);
  };
};

function CreateGreyFish() {
  this.x1 = -130;
  this.y1 = -30;
  this.x2 = 0;
  this.y2 = 30;
  this.x_pos = 0 - this.x2;
  this.y_pos = Math.floor((Math.random() * (canvas.height - landBorder - (this.y2 - this.y1) * 2)) + 1) + landBorder + (this.y2 - this.y1);
  this.speed = Math.random() * 4 + 5;
  this.colour = "#A09BA0";
  this.collide = function () {
    if (Rod.bitten) {return}; // Don't catch if the line has a bite
    if (Rod.baitless) {return}; // Don't catch if the line doesn't have bait
    Rod.bite("grey");
    despawn(this);
  };
};

function CreateMullet() {
  this.x1 = -420;
  this.y1 = -100;
  this.x2 = 0;
  this.y2 = 100;
  this.x_pos = 0 - this.x2;
  this.y_pos = Math.floor((Math.random() * (canvas.height - landBorder - (this.y2 - this.y1) * 2)) + 1) + landBorder + (this.y2 - this.y1);
  this.speed = Math.random() * 3 + 1;
  this.colour = "#D74C41";
  this.collide = function () {
    if (!Rod.bitten) {return}; // Don't catch if the line does not have a bite
    if (Rod.baitless) {return}; // Don't catch if the line doesn't have bait
    Rod.bite("mullet");
    despawn(this);
  };
}

function CreateBoot() {
  this.x1 = -45;
  this.y1 = -45;
  this.x2 = 45;
  this.y2 = 45;
  this.x_pos = 0 - this.x2;
  this.y_pos = Math.floor((Math.random() * (canvas.height - landBorder - (this.y2 - this.y1) * 2)) + 1) + landBorder + (this.y2 - this.y1);
  this.speed = Math.random() * 3 + 1;
  this.colour = "#996502";
  this.collide = function () {
    if (!Rod.bitten && Rod.fish != "mullet") {return}; // Don't collide if the line doesn't have a bite
    Rod.release();
  };
};

function CreateBarrel() {
  this.x1 = -85;
  this.y1 = -105;
  this.x2 = 85;
  this.y2 = 105;
  this.x_pos = 0 - this.x2;
  this.y_pos = Math.floor((Math.random() * (canvas.height - landBorder - (this.y2 - this.y1) * 2)) + 1) + landBorder + (this.y2 - this.y1);
  this.speed = Math.random() * 3 + 1;
  this.colour = "#D0976A";
  this.collide = function () {
    if (!Rod.bitten) {return}; // Don't collide if the line doesn't have a bite
    Rod.release();
  };
};

function CreateJellyfish() {
  this.x1 = -50;
  this.y1 = -50;
  this.x2 = 50;
  this.y2 = 50;
  this.x_pos = 0 - this.x2;
  this.y_pos = Math.floor((Math.random() * (canvas.height - landBorder - (this.y2 - this.y1) * 2)) + 1) + landBorder + (this.y2 - this.y1);
  this.speed = Math.random() * 3 + 1;
  this.colour = "#2643AC";
  this.collide = function () {
    Rod.zap();
  };
};

function CreateCan() {
  this.x1 = -25;
  this.y1 = -25;
  this.x2 = 25;
  this.y2 = 25;
  this.x_pos = 0 - this.x2;
  this.y_pos = Math.floor((Math.random() * (canvas.height - landBorder - (this.y2 - this.y1) * 2)) + 1) + landBorder + (this.y2 - this.y1);
  this.speed = Math.random() * 3 + 1;
  this.colour = "#CCCBD0";
  this.collide = function () {
    worms++;
    despawn(this);
  };
};

function CreateShark() {
  this.x1 = -200;
  this.y1 = -50;
  this.x2 = 200;
  this.y2 = 50;
  this.x_pos = 0 - this.x2;
  this.y_pos = Math.floor((Math.random() * (canvas.height - landBorder - (this.y2 - this.y1) * 2)) + 1) + landBorder + (this.y2 - this.y1);
  this.speed = Math.random() * 3 + 1;
  this.colour = "#CCCBD0";
  this.collide = function () {
    Rod.zap();
  };
};

function calcSize(var1, var2) {
  return var2 - var1;
};

function despawn(entity) {
  entity.x_pos = canvas.width - entity.x1;
};

canvas.addEventListener("mousemove", function(e) {
  var rect = e.target.getBoundingClientRect(), y = e.clientY - rect.top; // https://stackoverflow.com/a/42111623
  if (y <= heightMin) {return}; // Barrier at the top
  Rod.y_pos = y;
});

canvas.addEventListener("mousedown", function(e) {
  if (Rod.y_pos < landBorder) {
    if (Rod.bitten) {
      switch (Rod.fish) {
        case "fluffy":
          coins += 4;
          break;
        case "grey":
          coins += 8;
          break;
        case "fluffy":
          coins += 100;
          break;
        default:

      };
      Rod.reeled();
    };
    if (Rod.baitless && worms > 0) {
      worms--;
      Rod.bait();
      console.log("Re-baited")
    };
  } else if (Rod.bitten) {
    Rod.release();
  };
});

// Spawn entities
setInterval(function () {
  let seed = Math.floor(Math.random() * 10 + 1);
  EntityCount++;
  switch (seed) {
    case 1:
      Entities[EntityCount] = new CreateBoot();
      break;
    case 2:
      Entities[EntityCount] = new CreateBarrel();
      break;
    case 3:
      Entities[EntityCount] = new CreateJellyfish();
      break;
    case 4:
      Entities[EntityCount] = new CreateGreyFish();
      break;
    case 5:
      Entities[EntityCount] = new CreateMullet();
      break;
    case 6:
      Entities[EntityCount] = new CreateCan();
      break;
    case 7:
      Entities[EntityCount] = new CreateShark();
      break;
    default:
      Entities[EntityCount] = new CreateFish();
      break;
  };
}, 3000);

// Update
setInterval(function () {
  for (entity in Entities) {
    let Entity = Entities[entity];
    // Move fish
    Entity.x_pos += Entity.speed;
    // Check collision
    if (checkCollision(Entity)) {Entity.collide()};
    // Out of bounds
    if (Entity.x_pos + Entity.x1 > canvas.width) {
      delete Entities[entity];
      console.log("Entity #" + entity + " despawned.");
    };
  };
}, 1000/60);

function checkCollision(Obj) { // https://stackoverflow.com/a/7301852
  let a = {
    x: Rod.x_pos + Rod.x1,
    y: Rod.y_pos + Rod.y1,
    width: calcSize(Rod.x1, Rod.x2),
    height: calcSize(Rod.y1, Rod.y2),
  },
  b = {
    x: Obj.x_pos + Obj.x1,
    y: Obj.y_pos + Obj.y1,
    width: calcSize(Obj.x1, Obj.x2),
    height: calcSize(Obj.y1, Obj.y2),
  };
  return !(
    ((a.y + a.height) < (b.y)) ||
    (a.y > (b.y + b.height)) ||
    ((a.x + a.width) < b.x) ||
    (a.x > (b.x + b.width))
  );
};

function render() {
  // Backdrop
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, canvas.width, landBorder);
  ctx.fillStyle = "#498BD7";
  ctx.fillRect(0, landBorder, canvas.width, canvas.height - landBorder);

  // Line
  ctx.fillStyle = "#000000";
  ctx.fillRect(Rod.x_pos - 2, heightMin, 4, Rod.y_pos - heightMin);

  // Hook/Bait
  ctx.fillStyle = Rod.colour;
  if (Rod.bite) {
    ctx.fillRect(Rod.x_pos + Rod.x1, Rod.y_pos + Rod.y1, calcSize(Rod.x1, Rod.x2), calcSize(Rod.y1, Rod.y2));
  } else {
    ctx.fillRect(Rod.x_pos + Rod.x1, Rod.y_pos + Rod.y1, calcSize(Rod.x1, Rod.x2), calcSize(Rod.y1, Rod.y2));
  }

  // Entities
  for (entity in Entities) {
    let Entity = Entities[entity];
    ctx.fillStyle = Entity.colour;
    ctx.fillRect(Entity.x_pos + Entity.x1, Entity.y_pos + Entity.y1, calcSize(Entity.x1, Entity.x2), calcSize(Entity.y1, Entity.y2));
  };

  // Print stats
  ctx.font = "30px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("Fish: " + fish + " | Worms: " + worms + " | Coins: " + coins, 20, 40);
};

setInterval(render, 1000/60);