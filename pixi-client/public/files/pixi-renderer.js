import { fetcher } from './fetcher.js';
import { fetchstore, FS_EVENTS } from './fetch-store.js';
import { addMessage, addNewKobold, removeKobold, updateKoboldPosition } from './kobolds.js';
import { ChatBubble } from './chat-bubble.js';

//Debug flag for testing.
const TEST_DEBUG = true;

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

            //Check if custom kobold resource exists - Give default Kobold otherwise
            let resourceName = '';
            //console.log(Object.keys(Resources));
            if (data.displayName.toLowerCase() in Resources) {
                console.log('pass');
                resourceName = data.displayName.toLowerCase();
                data.isCustom = true;
            }

            if (resourceName === '') {
                console.log('fail');
                let koboldNumber = Math.floor(Math.random() * 3) + 1;
                resourceName = `kobold_type_${koboldNumber}`;
                data.isCustom = false;
            }

            resourceName = `kobold_type_1`
            data.isCustom = false;

            const newUser = addNewKobold(data, Y_AXIS_LOWER_BOUND, Y_AXIS_UPPER_BOUND, X_AXIS_LOWER_BOUND, X_AXIS_UPPER_BOUND, resourceName);
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

Loader.add('kobold_type_1', 'files/sprites/kobold/Kobold_Type_001.png')
	.add('kobold_type_2', 'files/sprites/kobold/Kobold_002.png')
	.add('kobold_type_3', 'files/sprites/kobold/Kobold_003.png')
    .add('kobold_type_1_mask_1', 'files/sprites/kobold/Kobold_Type_001_Mask_1.png')
    .add('kobold_type_1_mask_2', 'files/sprites/kobold/Kobold_Type_001_Mask_2.png')
    .add('azaleathorns', 'files/sprites/kobold/Kobold_AzaleaThorns.png')
    .add('redflashdrive', 'files/sprites/kobold/Kobold_Red.png')
    .add('mierno', 'files/sprites/kobold/Kobold_Meirno.png')
    .add('malicious_magpie', 'files/sprites/kobold/Kobold_Magpie.png')
    .add('kealldin', 'files/sprites/dragon/dragon_kealldin.png')
    .load(setup);

function setup() {
    app.ticker.add((delta) => gameLoop(delta));
}

function gameLoop(delta) {
    updateKoboldPosition(app.screen.width, Y_AXIS_LOWER_BOUND, Y_AXIS_UPPER_BOUND, delta);    //console.log('gameloop ticked');
}