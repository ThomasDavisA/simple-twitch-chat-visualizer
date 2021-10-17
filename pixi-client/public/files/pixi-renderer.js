import { fetcher } from './fetcher.js';
import { fetchstore, FS_EVENTS } from './fetch-store.js';

fetcher((data) => {
	fetchstore(data, (event, data) => {
		if (event == FS_EVENTS.ADD_USER) {
		} else if (event == FS_EVENTS.REMOVE_USER) {
		}
	});
});

const app = new PIXI.Application({ width: 360, height: 480 });
document.body.appendChild(app.view);

app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoDensity = true;
app.resizeTo = window;

const koboldContainer = new PIXI.Container();

app.stage.addChild(koboldContainer);

const koboldTexture = PIXI.Texture.from('files/sprites/kobold/Kobold_001.png');

const kobold = new PIXI.Sprite(koboldTexture);
koboldContainer.addChild(kobold);

koboldContainer.x = app.screen.width / 2;
koboldContainer.y = app.screen.height / 2;