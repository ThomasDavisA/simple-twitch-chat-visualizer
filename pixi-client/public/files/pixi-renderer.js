import { fetcher } from './fetcher.js';
import { fetchstore, FS_EVENTS } from './fetch-store.js';

fetcher((data) => {
	fetchstore(data, (event, data) => {
		if (event == FS_EVENTS.ADD_USER) {
		} else if (event == FS_EVENTS.REMOVE_USER) {
		}
	});
});

const TextureCache = PIXI.utils.TextureCache,
    Loader = PIXI.Loader.shared,
    Resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite;

let kobolds = [];
const wanderDistance = 100;

const app = new PIXI.Application({ width: 360, height: 480 });
document.body.appendChild(app.view);

app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoDensity = true;
app.resizeTo = window;

const koboldTexture = TextureCache['files/sprites/kobold/Kobold_001.png'];

Loader.add('files/sprites/kobold/Kobold_001.png')
    .load(setup);

function setup() {
    const koboldList = [
        {
            name: 'test1',
            posx: 100,
            posy: 100,
            vSpeed: 1
        },
        {
            name: 'test2',
            posx: 200,
            posy: 100,
            vSpeed: 2
        },
        {
            name: 'test3',
            posx: 500,
            posy: 100,
            vSpeed: 3
        }
    ]

    koboldList.forEach(kobold => {
        const koboldSprite = new Sprite(Resources['files/sprites/kobold/Kobold_001.png'].texture);
        koboldSprite.x = kobold.posx;
        kobold.destinationX = kobold.posx;
        koboldSprite.y = kobold.posy;
        kobold.destinationY = kobold.posy;
        koboldSprite.scale.x = .25;
        koboldSprite.scale.y = .25;
        kobold.wanderTick = 0;
        kobold.koboldSprite = koboldSprite;

        koboldSprite.anchor.set(0.5);

        kobolds.push(kobold);
    
        app.stage.addChild(koboldSprite);
        console.log('app stage added for ', kobold.name);
    })

    console.log(kobolds)
    app.ticker.add((delta) => gameLoop(delta));
}

function gameLoop(delta) {
    kobolds.forEach(kobold => {
        const { wanderTick, koboldSprite, vSpeed } = kobold;
        kobold.wanderTick--;
        if (wanderTick < 0) {
            //set new point to go to
            kobold.destinationX = koboldSprite.x + Math.floor((Math.random() * (wanderDistance * 2) + 1) - wanderDistance);
            if (kobold.destinationX - wanderDistance <= 0) kobold.destinationX = Math.abs(koboldSprite.width * koboldSprite.scale.x * 2);
            if (kobold.destinationX + wanderDistance >= app.screen.width) kobold.destinationX = app.screen.width - (koboldSprite.width * koboldSprite.scale.x * 2) - 1;

            kobold.wanderTick = 60;
        }

        if (koboldSprite.x != kobold.destinationX) {
            let vel = kobold.vSpeed;
            let dist = Math.abs(koboldSprite.x - kobold.destinationX)
            
            if (kobold.vSpeed > dist) 
                vel = dist;

            if (kobold.destinationX >= koboldSprite.x) {
                kobold.vx = vel;
                koboldSprite.scale.x = .25;
            } else {
                kobold.vx = vel * -1;
                koboldSprite.scale.x = -.25;
            }
            koboldSprite.x += kobold.vx;
        }
    })
    //console.log('gameloop ticked');
}