const koboldList = [];
const WANDER_DISTANCE = 3,
    SINE_AMP = 20,
    SINE_LENGTH = .2,
    HOP_DISTANCE = Math.PI * 10;

const nameStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 16,
    fill: 'white',
    stroke: '#FFFFFF',
    strokeThickness: 0
})

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

    const koboldName = new PIXI.Text(newKobold.name, nameStyle);
    koboldName.position.set(0, koboldSprite.y + (koboldSprite.height / 2));
    koboldSprite.position.set((koboldName.width / 2), 0)
    koboldPlate.addChild(koboldName);

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

function updateKoboldPosition(width, heightMax, heightMin, delta) {
    koboldList.forEach(kobold => {
        const { wanderTick, koboldSprite, vSpeed, moveTimer, koboldPlate } = kobold;
        let vel = 0;
        let moveFlag = false;

        kobold.wanderTick--;
        kobold.chatBubble.update(delta, koboldSprite);

        if (wanderTick < 0) {
            //set new point to go to
            let koboldDistance = ((Math.floor(Math.random() * ((WANDER_DISTANCE * 2) + 1)) - WANDER_DISTANCE) * HOP_DISTANCE);
            if (((koboldDistance + koboldPlate.x + HOP_DISTANCE) >= width) || ((koboldDistance + koboldPlate.x - HOP_DISTANCE) <= 0)) {
                koboldDistance = koboldDistance * -1;
            }

            kobold.destinationY = ((Math.floor(Math.random() * (heightMax - heightMin) + 1) + heightMin));
            kobold.destinationX = koboldDistance + koboldPlate.x;
            kobold.wanderTick = 60 + Math.floor(Math.random() * 180);
            //console.log(kobold.destinationY, endPointY, koboldPlate.y, koboldDistanceY)
        }

        if (koboldPlate.x !== kobold.destinationX) {
            moveFlag = true;
            vel = vSpeed * delta;

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
        }

        if (koboldPlate.y !== kobold.destinationY) {
            moveFlag = true;
            vel = vSpeed * delta;
            let dist = Math.abs(koboldPlate.y - kobold.destinationY)

            if (vel >= dist)
            vel = dist

            if (kobold.destinationY > koboldPlate.y) {
                kobold.vy = vel; 
            } else {
                kobold.vy = vel * -1;
            }
            
            koboldPlate.y += kobold.vy;
            //console.log(koboldPlate.y, kobold.destinationY)
        }

        if (moveFlag) {
            kobold.moveTimer++;
            koboldSprite.y = (-1 * Math.abs(SINE_AMP * Math.sin(SINE_LENGTH * moveTimer * delta)));
        } else {
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