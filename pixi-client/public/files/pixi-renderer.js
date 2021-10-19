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
            posy: 100
        },
        {
            name: 'test2',
            posx: 50,
            posy: 100
        },
        {
            name: 'test3',
            posx: 25,
            posy: 100
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
        const { wanderTick, koboldSprite } = kobold;
        kobold.wanderTick--;
        if (wanderTick < 0) {
            //set new point to go to
            kobold.destinationX = koboldSprite.x + Math.floor((Math.random() * 61) - 30);
            kobold.wanderTick = 60;
        }

        if (koboldSprite.x != kobold.destinationX) {
            if (kobold.destinationX >= koboldSprite.x) {
                kobold.vx = 1;
                koboldSprite.scale.x = .25;
            } else {
                kobold.vx = -1;
                koboldSprite.scale.x = -.25;
            }
            koboldSprite.x += kobold.vx;
        }
    })

    //console.log('gameloop ticked');
}