import {
	animate,
	hover,
	stagger,
} from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

export function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const circle = document.getElementById("followCursor");

hover("h1:not(#loading)", () => {
	animate(
		circle,
		{
			height: "50px",
			width: "50px",
			borderRadius: "50%",
			opacity: "85%",
		},
		{ duration: 0.25, ease: "ease-out" }
	);

	return () =>
		animate(
			circle,
			{
				height: "10px",
				width: "10px",
				borderRadius: "50%",
				opacity: "100%",
			},
			{ duration: 0.25, ease: "ease-out" }
		);
});

// Loader
const loaderSequence = [
	[
		"#loading > span",
		{ filter: "blur(0px)", opacity: 1 },
		{
			delay: stagger(0.5),
			ease: "ease-in",
			duration: 0.5,
		},
	],
	[
		"#followCursor",
		{ height: "10px", width: "10px" },
		{ delay: 0.5, ease: "cubic-bezier(.31,-0.01,.07,1.02)", duration: 1 },
	],
];

sleep(1000).then(async () => {
	await animate(loaderSequence).then(() =>
		document.querySelector("#loading").classList.add("hidden")
	);
});

// Background text messages
let messages = [
	"Why do I even try?",
	"Javascript.",
	"React.",
	"I fail, you fail, we all fail",
	"Just give up",
	"Maybe next time",
	"Is this even worth it"
];

let currentMessageIndex = 0;
let activeTextElements = [];
function createBackgroundTextElement() {
	const textElement = document.createElement('div');
	textElement.className = 'backgroundText';
	textElement.style.cssText = `
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		font-size: 2rem;
		color: var(--text);
		opacity: 0;
		z-index: -1;
		text-align: center;
		max-width: 40%;
		pointer-events: none;
		white-space: nowrap;
	`;
	textElement.classList.add("fonted");
	
	const heroSection = document.getElementById('hero');
	heroSection.appendChild(textElement);
	return textElement;
}

function getRandomPosition() {
	const minX = 15;
	const maxX = 85;
	const minY = 20;
	const maxY = 80;
	
	const randomX = Math.random() * (maxX - minX) + minX;
	const randomY = Math.random() * (maxY - minY) + minY;
	
	return {
		x: randomX,
		y: randomY
	};
}

async function showBackgroundMessage() {
	const messageIndex = currentMessageIndex;
	currentMessageIndex = (currentMessageIndex + 1) % messages.length;
	
	const textElement = createBackgroundTextElement();
	activeTextElements.push(textElement);
	const position = getRandomPosition();
	
	textElement.textContent = messages[messageIndex];
	textElement.style.left = `${position.x}%`;
	textElement.style.top = `${position.y}%`;
	
	await animate(
		textElement,
		{ opacity: 0.5 },
		{ duration: 4, ease: "ease-in-out" }
	);
	
	await animate(
		textElement,
		{ opacity: 0 },
		{ duration: 4, ease: "ease-in-out" }
	);
	
	textElement.remove();
	const index = activeTextElements.indexOf(textElement);
	if (index > -1) {
		activeTextElements.splice(index, 1);
	}
}

let isHeroVisible = true;
let messageInterval;

const heroObserver = new IntersectionObserver((entries) => {
	entries.forEach(entry => {
		isHeroVisible = entry.isIntersecting;
		if (!isHeroVisible && messageInterval) {
			clearInterval(messageInterval);
			messageInterval = null;
			activeTextElements.forEach(element => {
				animate(element, { opacity: 0 }, { duration: 1, ease: "ease-out" })
					.then(() => element.remove());
			});
			activeTextElements = [];
		} else if (isHeroVisible && !messageInterval) {
			showBackgroundMessage();
			messageInterval = setInterval(showBackgroundMessage, 2500);
		}
	});
}, {
	threshold: 0.3
});

const heroSection = document.getElementById('hero');
heroObserver.observe(heroSection);

sleep(4000).then(() => {
	if (isHeroVisible) {
		showBackgroundMessage();
		messageInterval = setInterval(showBackgroundMessage, 2500);
	}
});