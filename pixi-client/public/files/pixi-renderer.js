import { fetcher } from './fetcher.js';
import { fetchstore, FS_EVENTS } from './fetch-store.js';
import { addMessage, addNewKobold, removeKobold, updateKoboldPosition } from './kobolds.js';
import { ChatBubble } from './chat-bubble.js';

const TextureCache = PIXI.utils.TextureCache,
    Loader = PIXI.Loader.shared,
    Resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite;

const app = new PIXI.Application({ width: 360, height: 480 });
document.body.appendChild(app.view);

app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoDensity = true;
app.resizeTo = window;

const USER_REFRESH_RATE = 60;
const Y_AXIS_LOWER_BOUND = app.stage.height - 110;
const Y_AXIS_UPPER_BOUND = app.stage.height - 10;

fetcher((data) => {
	fetchstore(data, (event, data) => {
		if (event == FS_EVENTS.ADD_USER) {
            const newUser = addNewKobold(data);
            app.stage.addChild(newUser.koboldSprite);
            newUser.chatBubble = new ChatBubble(app.stage);
		} else if (event == FS_EVENTS.REMOVE_USER) {
			const userToRemove = removeKobold(data)
            app.stage.removeChild(userToRemove.koboldSprite);
            userToRemove.chatBubble.remove(app.stage);
		}
	});

    data.messages.forEach(message => {
        addMessage(message);
    });
});

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

    koboldList.forEach(user => {
        const newUser = addNewKobold(user);
        app.stage.addChild(newUser.koboldSprite);
    })

    app.ticker.add((delta) => gameLoop(delta));
}

function gameLoop(delta) {
    updateKoboldPosition(app.screen.width, app.screen.height, delta);
    //console.log('gameloop ticked');
}