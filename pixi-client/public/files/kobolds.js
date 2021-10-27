const koboldList = [];
const WANDER_DISTANCE = 4,
    SINE_AMP = 20,
    SINE_LENGTH = .2,
    HOP_DISTANCE = 35;
    //35 is the distance for one 'hop', learn why this number is later


const TextureCache = PIXI.utils.TextureCache,
    Loader = PIXI.Loader.shared,
    Resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite;

function addNewKobold(data) {
    const newKobold = {
        userId: data.userId,
        name: data.displayName,
        posx: 500,
        posy: 100,
        vSpeed: 2,
        moveTimer: 0
    }

    let koboldNumber = Math.floor(Math.random() * 3) + 1;
    const koboldSprite = new Sprite(Resources[`files/sprites/kobold/Kobold_00${koboldNumber}.png`].texture);
    koboldSprite.x = newKobold.posx;
    newKobold.destinationX = newKobold.posx;
    koboldSprite.y = newKobold.posy;
    newKobold.destinationY = newKobold.posy;
    koboldSprite.scale.x = .25;
    koboldSprite.scale.y = .25;
    newKobold.wanderTick = 0;
    newKobold.koboldSprite = koboldSprite;

    koboldSprite.anchor.set(0.5);

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
    const { wanderTick, koboldSprite, vSpeed, moveTimer } = kobold;
    kobold.wanderTick--;
    if (wanderTick < 0) {
        //set new point to go to based on number of hops
        kobold.destinationX = koboldSprite.x + (Math.floor((Math.random() * (WANDER_DISTANCE * 2) + 1) - WANDER_DISTANCE) * HOP_DISTANCE);
        if (kobold.destinationX - WANDER_DISTANCE <= 0) kobold.destinationX = Math.abs(koboldSprite.width * koboldSprite.scale.x * 2);
        if (kobold.destinationX + WANDER_DISTANCE >= width) kobold.destinationX = width - (koboldSprite.width * koboldSprite.scale.x * 2) - 1;

        kobold.wanderTick = 60;
    }

    if (koboldSprite.x !== kobold.destinationX) {
        let vel = kobold.vSpeed * delta;
        let dist = Math.abs(koboldSprite.x - kobold.destinationX)

        if (vel >= dist) 
        vel = dist;

        if (kobold.destinationX > koboldSprite.x) {
            kobold.vx = vel; 
            koboldSprite.scale.x = .25;
        } else {
            kobold.vx = vel * -1;
            koboldSprite.scale.x = -.25;
        }
        
        koboldSprite.x += kobold.vx;


        kobold.chatBubble.update(delta, koboldSprite);

        kobold.moveTimer++;
        koboldSprite.y = kobold.posy + (-1 * Math.abs(SINE_AMP * Math.sin(SINE_LENGTH * moveTimer * delta)));
    }

    if (koboldSprite.x == kobold.destinationX) {
        kobold.moveTimer = 0;
        koboldSprite.y = kobold.posy;
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