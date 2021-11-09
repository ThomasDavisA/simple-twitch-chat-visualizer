const koboldList = [];
const WANDER_DISTANCE = 3,
    SINE_AMP = 20,
    SINE_LENGTH = .2,
    HOP_DISTANCE = Math.PI * 10;


const TextureCache = PIXI.utils.TextureCache,
    Loader = PIXI.Loader.shared,
    Resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite;

function addNewKobold(data, yAxisLower, yAxisHigher, xAxisLower, xAxisHigher) {
    const newKobold = {
        userId: data.userId,
        name: data.displayName,
        posy: Math.floor(Math.random() * (yAxisHigher - yAxisLower + 1) + yAxisLower),
        posx: Math.floor(Math.random() * (xAxisHigher - xAxisLower + 1) + xAxisLower),
        vSpeed: 2,
        moveTimer: 0,
        wanderTick: 0
    }

    //Inits Kobold Sprite
    let koboldNumber = Math.floor(Math.random() * 3) + 1;
    const koboldSprite = new Sprite(Resources[`files/sprites/kobold/Kobold_00${koboldNumber}.png`].texture);

    koboldSprite.scale.x = .25;
    koboldSprite.scale.y = .25;
    koboldSprite.anchor.set(0.5);

    const koboldPlate = new PIXI.Container();
    koboldPlate.x = newKobold.posx;
    koboldPlate.y = newKobold.posy;
    koboldPlate.addChild(koboldSprite);

    newKobold.koboldPlate = koboldPlate;
    newKobold.koboldSprite = koboldSprite;

    koboldList.push(newKobold);
    return newKobold;
}

function removeKobold(data) {
    const koboldToRemove = koboldList.find(kobold => kobold.userId === data.userId)
    const index = koboldList.indexOf(koboldToRemove)

    if (index !== -1) {
        koboldList.splice(index, 1);
        return koboldToRemove;
    } else {
        return('index not found! Missing userId.');
    }
}

function updateKoboldPosition(width, height, delta) {
    koboldList.forEach(kobold => {
    const { wanderTick, koboldSprite, vSpeed, moveTimer, koboldPlate, destinationX } = kobold;
    let vel = vSpeed * delta;
    kobold.wanderTick--;
    if (wanderTick < 0) {
        //set new point to go to
        let koboldDistance = ((Math.floor(Math.random() * ((WANDER_DISTANCE * 2) + 1)) - WANDER_DISTANCE) * HOP_DISTANCE);
        if (((koboldDistance + koboldPlate.x + HOP_DISTANCE) >= width) || ((koboldDistance + koboldPlate.x - HOP_DISTANCE) <= 0)) {
            koboldDistance = koboldDistance * -1;
        }

        kobold.destinationX = koboldDistance + koboldPlate.x;
        kobold.wanderTick = 60 + Math.floor(Math.random() * 180);
    }

    if (koboldPlate.x !== kobold.destinationX) {
        let dist = Math.abs(koboldPlate.x - kobold.destinationX)

        if (vel >= dist) 
        vel = dist;

        if (kobold.destinationX > koboldPlate.x) {
            kobold.vx = vel; 
            koboldSprite.scale.x = .25;
        } else {
            kobold.vx = vel * -1;
            koboldSprite.scale.x = -.25;
        }
        
        koboldPlate.x += kobold.vx;

        kobold.moveTimer++;
        koboldSprite.y = (-1 * Math.abs(SINE_AMP * Math.sin(SINE_LENGTH * moveTimer * delta)));
        kobold.chatBubble.update(delta, koboldSprite);
    }

    if (koboldPlate.x == kobold.destinationX) {
        kobold.moveTimer = 0;
        koboldSprite.y = 0;
    }
})
}

function addMessage(message) {
    koboldList.forEach(kobold => {
        if (kobold.userId === message.userId) {
            kobold.chatBubble.addMessage(message);
        }
    });
}

export {addNewKobold, removeKobold, updateKoboldPosition, addMessage};