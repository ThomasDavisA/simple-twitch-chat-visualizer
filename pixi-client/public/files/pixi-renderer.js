import { fetcher } from './fetcher.js';
import { fetchstore, FS_EVENTS } from './fetch-store.js';
import { addMessage, addNewKobold, removeKobold, updateKoboldPosition } from './kobolds.js';
import { ChatBubble } from './chat-bubble.js';

//Debug flag for testing.
const TEST_DEBUG = false;

const TextureCache = PIXI.utils.TextureCache,
    Loader = PIXI.Loader.shared,
    Resources = PIXI.Loader.shared.resources,
    Sprite = PIXI.Sprite;

const app = new PIXI.Application({ width: 360, height: 480, transparent: !TEST_DEBUG });
document.body.appendChild(app.view);

app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoDensity = true;
app.resizeTo = window;

const Y_AXIS_LOWER_BOUND = app.screen.height - 200;
const Y_AXIS_UPPER_BOUND = app.screen.height - 80;
const X_AXIS_UPPER_BOUND = app.screen.width - 100;
const X_AXIS_LOWER_BOUND = 200;

fetcher((data) => {
	fetchstore(data, (event, data) => {
		if (event == FS_EVENTS.ADD_USER) {
            const newUser = addNewKobold(data, Y_AXIS_LOWER_BOUND, Y_AXIS_UPPER_BOUND, X_AXIS_LOWER_BOUND, X_AXIS_UPPER_BOUND);
            app.stage.addChild(newUser.koboldPlate);
            newUser.chatBubble = new ChatBubble(newUser.koboldPlate);
		} else if (event == FS_EVENTS.REMOVE_USER) {
			const userToRemove = removeKobold(data)
            app.stage.removeChild(userToRemove.koboldPlate);
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
    .add('files/sprites/kobold/Kobold_AzaleaThorns.png')
    .add('files/sprites/kobold/Kobold_Red.png')
    .add('files/sprites/dragon/dragon_kealldin.png')
    .load(setup);

function setup() {
    app.ticker.add((delta) => gameLoop(delta));
}

function gameLoop(delta) {
    updateKoboldPosition(app.screen.width, Y_AXIS_LOWER_BOUND, Y_AXIS_UPPER_BOUND, delta);    //console.log('gameloop ticked');
}