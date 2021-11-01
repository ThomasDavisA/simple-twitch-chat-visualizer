const koboldList = [];
const WANDER_DISTANCE = 3,
    SINE_AMP = 20,
    SINE_LENGTH = .2,
    HOP_DISTANCE = Math.PI * 10;


const TextureCache = PIXI.utils.TextureCache,
    Loader = PIXI.Loader.shared,
    Resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite;

const nameStyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 16,
    fill: 'white',
    stroke: '#FFFFFF',
    strokeThickness: 0,
    align: 'center'
})

function addNewKobold(data, yAxisLower, yAxisHigher, xAxisLower, xAxisHigher) {
    const positionY = Math.floor(Math.random() * (yAxisHigher - yAxisLower + 1) + yAxisLower);
    const positionX = Math.floor(Math.random() * (xAxisHigher - xAxisLower + 1) + xAxisLower);
    const newKobold = {
        userId: data.userId,
        name: data.displayName,
        posx: positionX,
        posy: positionY,
        vSpeed: 2,
        moveTimer: 0
    }

    newKobold.destinationX = newKobold.posx;
    newKobold.destinationY = newKobold.posy;
    newKobold.wanderTick = 0;

    const koboldName = new PIXI.Text(newKobold.name, nameStyle);    
    let koboldNumber = Math.floor(Math.random() * 9) + 1;
    const koboldSprite = new Sprite(Resources[`files/sprites/kobold/Kobold_00${koboldNumber}.png`].texture);    

    koboldSprite.scale.x = .25;
    koboldSprite.scale.y = .25;
    koboldSprite.anchor.set(0.5);
    //console.log(koboldSprite.x, koboldSprite.y)
    const koboldPlate = new PIXI.Container();
    koboldPlate.x = newKobold.posx;
    koboldPlate.y = newKobold.posy;
    koboldPlate.addChild(koboldSprite);
    koboldPlate.addChild(koboldName);


    //console.log(koboldSprite.getGlobalPosition().x, koboldSprite.y)

    koboldName.position.set(koboldSprite.x - (koboldSprite.width / 4), koboldSprite.y + (koboldSprite.height / 2) - 5)

    koboldPlate.zIndex = newKobold.posy;

    newKobold.koboldSprite = koboldSprite;
    newKobold.koboldPlate = koboldPlate;

    //console.log(newKobold)

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

function updateKoboldPosition(width, heightMin, heightMax, delta) {
    koboldList.forEach(kobold => {
    const { wanderTick, koboldSprite, vSpeed, moveTimer, koboldPlate } = kobold;
    kobold.wanderTick--;
    if (wanderTick < 0) {
        //set new point to go to based on number of hops
        let koboldDistance = ((Math.floor(Math.random() * ((WANDER_DISTANCE * 2) + 1)) - WANDER_DISTANCE) * HOP_DISTANCE);
        if (((koboldDistance + koboldPlate.x + HOP_DISTANCE) >= width) || ((koboldDistance + koboldPlate.x - HOP_DISTANCE) <= 0)) {
            koboldDistance = koboldDistance * -1;
        }

        kobold.destinationX = koboldDistance + koboldPlate.x;
        kobold.wanderTick = 60 + Math.floor(Math.random() * 180);

        let koboldDistanceY = ((Math.floor(Math.random() * (heightMax + heightMin) + 1) - heightMin));
        if (koboldDistance != 0)
            kobold.vy = koboldDistance / (koboldDistanceY - koboldPlate.y) ;

        kobold.destinationY = koboldDistanceY;

        console.log(kobold.vy, kobold.destinationY, koboldDistance)
    }

    if (koboldPlate.x !== kobold.destinationX) {
        let vel = vSpeed * delta;
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
        koboldPlate.y += kobold.vy;

        kobold.chatBubble.update(delta, koboldSprite);
        koboldPlate.zIndex = koboldPlate.y;
        kobold.moveTimer++;
        koboldSprite.y = (-1 * Math.abs(SINE_AMP * Math.sin(SINE_LENGTH * moveTimer * delta)));
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