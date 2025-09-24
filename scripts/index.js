import {
	animate,
	hover,
	stagger,
} from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

export function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

const circle = document.getElementById("followCursor");
let quadrant = 0;

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
	"Is this even worth it",
];

let currentMessageIndex = 0;
let activeTextElements = [];
function createBackgroundTextElement() {
	const textElement = document.createElement("div");
	textElement.className = "backgroundText";
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

	const heroSection = document.getElementById("hero");
	heroSection.appendChild(textElement);
	return textElement;
}

function getRandomPosition() {
	if (quadrant === 4) {
		quadrant = 1;
	} else {
		quadrant++;
	}

	let text = document.querySelector("#hero p")?.getBoundingClientRect();
	let heading = document.querySelector("#hero h1")?.getBoundingClientRect();
	let heroRect = document.getElementById("hero").getBoundingClientRect();

	// Function to check if a position intersects with existing elements
	function isPositionClear(x, y, elementWidth = 300, elementHeight = 40) {
		const elementRect = {
			left: x,
			right: x + elementWidth,
			top: y,
			bottom: y + elementHeight
		};

		// Check collision with heading
		if (heading && !(elementRect.right < heading.left || 
			elementRect.left > heading.right || 
			elementRect.bottom < heading.top || 
			elementRect.top > heading.bottom)) {
			return false;
		}

		// Check collision with paragraph text
		if (text && !(elementRect.right < text.left || 
			elementRect.left > text.right || 
			elementRect.bottom < text.top || 
			elementRect.top > text.bottom)) {
			return false;
		}

		return true;
	}

	let minX, maxX, minY, maxY;
	let attempts = 0;
	const maxAttempts = 20;

	if (quadrant === 1) {
		// Top-left quadrant
		minX = 10;
		maxX = 50;
		minY = 10;
		maxY = 50;
	} else if (quadrant === 2) {
		// Top-right quadrant
		minX = 50;
		maxX = 90;
		minY = 10;
		maxY = 50;
	} else if (quadrant === 3) {
		// Bottom-left quadrant
		minX = 10;
		maxX = 50;
		minY = 50;
		maxY = 90;
	} else if (quadrant === 4) {
		// Bottom-right quadrant
		minX = 50;
		maxX = 90;
		minY = 50;
		maxY = 90;
	}

	let randomX, randomY, actualX, actualY;
	do {
		randomX = Math.random() * (maxX - minX) + minX;
		randomY = Math.random() * (maxY - minY) + minY;
		
		actualX = (randomX / 100) * heroRect.width;
		actualY = (randomY / 100) * heroRect.height;
		
		attempts++;
	} while (!isPositionClear(actualX, actualY) && attempts < maxAttempts);

	return {
		x: randomX,
		y: randomY,
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

const heroObserver = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			isHeroVisible = entry.isIntersecting;
			if (!isHeroVisible && messageInterval) {
				clearInterval(messageInterval);
				messageInterval = null;
				activeTextElements.forEach((element) => {
					animate(
						element,
						{ opacity: 0 },
						{ duration: 1, ease: "ease-out" }
					).then(() => element.remove());
				});
				activeTextElements = [];
			} else if (isHeroVisible && !messageInterval) {
				showBackgroundMessage();
				messageInterval = setInterval(showBackgroundMessage, 2500);
			}
		});
	},
	{
		threshold: 0.3,
	}
);

const heroSection = document.getElementById("hero");
heroObserver.observe(heroSection);

sleep(5000).then(() => {
	if (isHeroVisible) {
		showBackgroundMessage();
		messageInterval = setInterval(showBackgroundMessage, 2500);
	}
});
