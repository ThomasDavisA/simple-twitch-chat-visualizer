const koboldList = [];
const WANDER_DISTANCE = 3,
    SINE_AMP = 20,
    SINE_LENGTH = .2,
    HOP_DISTANCE = Math.PI * 10;

const STREAMER_WIDTH = 200;
const KOBOLD_SCALE = .25;

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

const colorMatrix = new PIXI.filters.colorMatrixFilter();

function addNewKobold(data, yAxisLower, yAxisHigher, xAxisLower, xAxisHigher, resourceName) {
    const newKobold = {
        userId: data.userId,
        name: data.displayName,
        posy: Math.floor(Math.random() * (yAxisHigher - yAxisLower + 1) + yAxisLower),
        posx: Math.floor(Math.random() * (xAxisHigher - xAxisLower + 1) + xAxisLower),
        vSpeed: 2,
        moveTimer: 0,
        wanderTick: 0,
        isStreamer: data.isStreamer || false,
        isCustom: data.isCustom
    }

    //Inits Kobold Sprite
    /*
    
    try
    check if sprite is already in resources
    if not

    loader.add(files/spriets/kobold/`resourcename`.png)
    .load()
        load sprite (resource[resourcename])
        catch
        loader.add(fioles/sprites/kobold/koblold1.png)
    */
   
    let koboldSprite = new Sprite(Resources[resourceName].texture);

    // overwrite if it is the Streamer
    if (data.isStreamer) {
        newKobold.posx = 50;
        newKobold.posy = ((yAxisHigher - yAxisLower) / 2) + yAxisLower;
        koboldSprite = new Sprite(Resources.kealldin.texture);
    }
    
    koboldSprite.scale.x = KOBOLD_SCALE;
    koboldSprite.scale.y = KOBOLD_SCALE;
    koboldSprite.anchor.set(0.5);

    const koboldSpriteFull = new PIXI.Container();

    //if not custom kobold, add masking layers
    if (!data.isCustom) {
        const koboldMask1 = new Sprite(Resources[`${resourceName}_mask_1`].texture);
        const koboldMask2 = new Sprite(Resources[`${resourceName}_mask_2`].texture);

        //hard-coded values for now on what color palletes we want for masks
        koboldMask1.scale.x = KOBOLD_SCALE;
        koboldMask1.scale.y = KOBOLD_SCALE;
        koboldMask1.anchor.set(0.5);
        

        koboldMask2.scale.x = KOBOLD_SCALE;
        koboldMask2.scale.y = KOBOLD_SCALE;
        koboldMask2.anchor.set(0.5);

        koboldSpriteFull.addChild(koboldMask2, koboldMask1, koboldSprite);
    } else {
        koboldSpriteFull.addChild(koboldSprite);    
    }

    // koboldSpriteFull.scale.x = KOBOLD_SCALE;
    // koboldSpriteFull.scale.y = KOBOLD_SCALE;

    const koboldPlate = new PIXI.Container();
    koboldPlate.x = newKobold.posx;
    koboldPlate.y = newKobold.posy;
    koboldPlate.addChild(koboldSpriteFull);
  

    newKobold.koboldPlate = koboldPlate;
    newKobold.koboldSprite = koboldSpriteFull;

    const koboldName = new PIXI.Text(newKobold.name, nameStyle);
    koboldName.position.set(0, koboldSprite.y + (koboldSprite.height / 2));
    koboldSpriteFull.position.set((koboldName.width / 2), 0)
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
        if (!kobold.isStreamer) {
            const { wanderTick, koboldSprite, vSpeed, moveTimer, koboldPlate } = kobold;
            let vel = 0;
            let moveFlag = false;

            kobold.wanderTick--;
            kobold.chatBubble.update(delta, koboldSprite);

            if (wanderTick < 0) {
                //set new point to go to
                let koboldDistance = ((Math.floor(Math.random() * ((WANDER_DISTANCE * 2) + 1)) - WANDER_DISTANCE) * HOP_DISTANCE);
                if (((koboldDistance + koboldPlate.x + HOP_DISTANCE) >= width) || ((koboldDistance + koboldPlate.x - HOP_DISTANCE) <= STREAMER_WIDTH)) {
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
                    koboldSprite.scale.x = 1;
                } else {
                    kobold.vx = vel * -1;
                    koboldSprite.scale.x = -1;
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