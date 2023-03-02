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

const TEST_KOBOLDS = false;
let test_counter = 0;

const TextureCache = PIXI.utils.TextureCache,
    Loader = PIXI.Loader.shared,
    Resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite;

function addNewKobold(data, yAxisLower, yAxisHigher, xAxisLower, xAxisHigher, resourceName) {
    let koboldPosX, koboldPosY = 0;
    if (!TEST_KOBOLDS) {
        koboldPosY = Math.floor(Math.random() * (yAxisHigher - yAxisLower + 1) + yAxisLower);
        koboldPosX = Math.floor(Math.random() * (xAxisHigher - xAxisLower + 1) + xAxisLower)
    } else {
        koboldPosY = yAxisLower + (yAxisHigher - yAxisLower);
        koboldPosX = xAxisLower + (test_counter * 100);
        test_counter += 1;
    }

    console.log('create kobold')

    const newKobold = {
        userId: data.userId,
        name: data.displayName,
        posy: koboldPosY,
        posx: koboldPosX,
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

    //Check for Halloween (and eventually other holidays), will improve this later
    const date = new Date();

    console.log(date)
    const [day, month] = [date.getDate(date), date.getMonth(date)];

    if (!data.isStreamer) {
        if (day == 31 && month == 9) {
            const koboldHoliday = new Sprite(Resources[`kobold_halloween`].texture);
            koboldHoliday.scale.x = KOBOLD_SCALE;
            koboldHoliday.scale.y = KOBOLD_SCALE;
            koboldHoliday.anchor.set(0.5);

            koboldSpriteFull.addChild(koboldHoliday);
        }
    

        //if not custom kobold, add masking layers
        //We are using tint as it is most accessable and easy to understand
        //NOTE: All tinted layers should be as light as possible, as tinting only -darkens-.
        if (!data.isCustom) {
            const koboldMask1 = new Sprite(Resources[`${resourceName}_mask_1`].texture);
            const koboldMask2 = new Sprite(Resources[`${resourceName}_mask_2`].texture);

            //hard coded values for each kobold color
            //color guide for each kobold
            // 0- Grey/White   1- Green/White  2- Blue/White   3- Dark Red/Red 4- Pink/Light Pink
            // 5- Yellow       6- Purple       7- Cyan/Green   8- Red/Yellow   9- Grey/Light Grey
            // 10- Green/LtGrn 11-Kealldin

            const mask1Colors = [0xFFFFFF, 0x34c25a, 0x226df0, 0x9c3627, 0xf5a2ed,
                                0xf0ff24, 0xeb23da, 0x20e3f5, 0xf72048, 0xa8a8a8,
                                0x12c73c, 0x52a8f2];
            const mask2Colors = [0xFFFFFF, 0xFFFFFF, 0xFFFFFF, 0xfa6a55, 0xffd4fb,
                                0xeef2b6, 0xf75eea, 0xa8f587, 0xffff54, 0xd9d9d9,
                                0xafdbba, 0xe5f5e4];
            let maskColors = [0xFFFFFF, 0xFFFFFF];
            let x = Math.floor(Math.random() * mask1Colors.length)

            koboldMask1.scale.x = KOBOLD_SCALE;
            koboldMask1.scale.y = KOBOLD_SCALE;
            koboldMask1.anchor.set(0.5);

            koboldMask2.scale.x = KOBOLD_SCALE;
            koboldMask2.scale.y = KOBOLD_SCALE;
            koboldMask2.anchor.set(0.5);

            koboldMask1.tint = 1 * mask1Colors[x];
            koboldMask2.tint = 1 * mask2Colors[x];

            //Add Pirate Hat, and Crown
            const koboldHat = new Sprite(Resources[`${resourceName}_pirate_hat`].texture);
            koboldHat.scale.x = KOBOLD_SCALE;
            koboldHat.scale.y = KOBOLD_SCALE;
            koboldHat.anchor.set(0.5);

            const koboldSub = new Sprite(Resources[`${resourceName}_sub`].texture);
            koboldSub.scale.x = KOBOLD_SCALE;
            koboldSub.scale.y = KOBOLD_SCALE;
            koboldSub.anchor.set(0.5);

            koboldSpriteFull.addChild(koboldMask2, koboldMask1, koboldSprite);

            //koboldSpriteFull.addChild(koboldHat);

            if (data.isSubbed) {
                koboldSpriteFull.addChild(koboldSub);
            }
        } else {
             
        }
    }

    koboldSpriteFull.addChild(koboldSprite);   

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
    if (!TEST_KOBOLDS) {
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
}

function addMessage(message) {
    koboldList.forEach(kobold => {
        if (kobold.userId === message.userId) {
            kobold.chatBubble.addMessage(message);
        }
    });
}

export {addNewKobold, removeKobold, updateKoboldPosition, addMessage};