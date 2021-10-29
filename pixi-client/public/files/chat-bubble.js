class ChatBubble {
	static STYLE = {fontSize: 18, align: 'center', wordWrap: true, wordWrapWidth: 400};
	static PADDING = 30.0;
	static MESSAGE_TIME = 3000;

	constructor(parent) {
		this.text = new PIXI.Text("", ChatBubble.STYLE);

		this.graphics = new PIXI.Graphics();
		this.graphics.alpha = 0.0;
		this.graphics.addChild(this.text);

		this.messages = [];
		this.currentMessage = null;
		this.messageTime = 0.0;

		parent.addChild(this.graphics);
	}

	addMessage(message) {
		if (message === null) {
			return;
		}

		this.messages.push(message);
	}

	nextMessage() {
		if (this.messages.length === 0) {
			return;
		}

		this.currentMessage = this.messages.shift();
		this.messageTime = Date.now() + ChatBubble.MESSAGE_TIME;

		let textStyle = new PIXI.TextStyle(ChatBubble.STYLE);
		let textMetrics = PIXI.TextMetrics.measureText(this.currentMessage.message, textStyle);
		let width = textMetrics.width + ChatBubble.PADDING;
		let height = textMetrics.height + ChatBubble.PADDING;

		this.graphics.clear();
		this.graphics.lineStyle(4, 0x424242);
		this.graphics.beginFill(0xffffff);
		this.graphics.drawRoundedRect(0.0, 0.0, width, height, 8);
		this.graphics.alpha = 1.0;

		this.text.text = this.currentMessage.message;
		this.text.x = ChatBubble.PADDING * 0.5;
		this.text.y = ChatBubble.PADDING * 0.5;
		this.text.updateText();
	}

	update(delta, sprite) {
		if (sprite === null) {
			return;
		}

		if (this.messages.length > 0) {
			if (this.currentMessage == null || this.messageTime < Date.now()) {
				this.nextMessage();
			}
		} else {
			if (this.currentMessage !== null) {
				if (this.messageTime < Date.now()) {
					this.currentMessage = null;
					this.messageTime = Date.now() + ChatBubble.MESSAGE_TIME;
				}
			} else {
				if (this.messageTime < Date.now()) {
					let alpha = this.graphics.alpha;
					this.graphics.alpha = Math.max(alpha - delta * 0.01, 0.0);
				}
			}
		}

		let height = this.graphics.height;
		let textBounds = this.text.getLocalBounds();

		this.graphics.x = sprite.x + sprite.width * 0.5;
		this.graphics.y = sprite.y - sprite.height * 0.75;
		this.graphics.width = textBounds.width;
	}
}

export { ChatBubble };
