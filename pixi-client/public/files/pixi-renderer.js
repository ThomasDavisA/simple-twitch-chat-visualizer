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
const Y_AXIS_LOWER_BOUND = app.screen.height - 200;
const Y_AXIS_UPPER_BOUND = app.screen.height - 80;
const X_AXIS_UPPER_BOUND = app.screen.width - 100;
const X_AXIS_LOWER_BOUND = 100;

console.log(app.screen.width)

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
    .add('files/sprites/kobold/Kobold_004.png')
	.add('files/sprites/kobold/Kobold_005.png')
    .add('files/sprites/kobold/Kobold_006.png')
	.add('files/sprites/kobold/Kobold_007.png')
    .add('files/sprites/kobold/Kobold_008.png')
	.add('files/sprites/kobold/Kobold_009.png')
    .load(setup);

function setup() {
    const koboldList = [
        {
			userId: 80,
            displayName: 'test1',
        },
        {
			userId: 81,
            displayName: 'test2',
        },
        {
			userId: 82,
            displayName: 'test3',
        }
    ]

    koboldList.forEach(data => {
        const newUser = addNewKobold(data, Y_AXIS_LOWER_BOUND, Y_AXIS_UPPER_BOUND, X_AXIS_LOWER_BOUND, X_AXIS_UPPER_BOUND);
        app.stage.addChild(newUser.koboldPlate);
    })

    app.ticker.add((delta) => gameLoop(delta));
}

function gameLoop(delta) {
    updateKoboldPosition(app.screen.width, Y_AXIS_LOWER_BOUND, Y_AXIS_UPPER_BOUND, delta);
    //console.log('gameloop ticked');
}