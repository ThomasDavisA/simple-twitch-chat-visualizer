import { fetcher } from './fetcher.js';
import { fetchstore, FS_EVENTS } from './fetch-store.js';

const TextureCache = PIXI.utils.TextureCache,
    Loader = PIXI.Loader.shared,
    Resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite;

let kobolds = [];
const USER_REFRESH_RATE = 60;
let userRefreshTick = 0;
const wanderDistance = 100;

fetcher((data) => {
	fetchstore(data, (event, data) => {
		if (event == FS_EVENTS.ADD_USER) {
			const newKobold = {
				userId: data.userId,
				name: data.displayName,
				posx: 500,
				posy: 100,
				vSpeed: 2
				
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

			kobolds.push(newKobold);
			app.stage.addChild(kobolds[kobolds.length - 1].koboldSprite);
		} else if (event == FS_EVENTS.REMOVE_USER) {
			const koboldToRemove = kobolds.find(kobold => kobold.userId === data.userId)
			const index = kobolds.indexOf(koboldToRemove)

			if (index !== -1) {
				app.stage.removeChild(kobolds[index].koboldSprite);
				kobolds.splice(index, 1);
			} else {
				console.log('index not found! Missing userId.')
			}
			
		}
	});
});

const app = new PIXI.Application({ width: 360, height: 480 });
document.body.appendChild(app.view);

app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoDensity = true;
app.resizeTo = window;

const koboldTexture = TextureCache['files/sprites/kobold/Kobold_001.png'];

Loader.add('files/sprites/kobold/Kobold_001.png')
	.add('files/sprites/kobold/Kobold_002.png')
	.add('files/sprites/kobold/Kobold_003.png')
    .load(setup);

function setup() {
    const koboldList = [
        {
			userId: 80,
            name: 'test1',
            posx: 100,
            posy: 100,
            vSpeed: 1
        },
        {
			userId: 81,
            name: 'test2',
            posx: 200,
            posy: 100,
            vSpeed: 2
        },
        {
			userId: 82,
            name: 'test3',
            posx: 500,
            posy: 100,
            vSpeed: 3
        }
    ]

    koboldList.forEach(kobold => {
		let koboldNumber = Math.floor(Math.random() * 3) + 1;
        const koboldSprite = new Sprite(Resources[`files/sprites/kobold/Kobold_00${koboldNumber}.png`].texture);
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
        }
    })
    //console.log('gameloop ticked');
}