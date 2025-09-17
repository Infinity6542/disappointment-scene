import {
	animate,
	hover,
} from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

document.body.style.overflow = "hidden";

let circle = document.querySelector("#followCursor");
hover("a, .bubble", () => {
	bubbleCursor();

	return () =>
		nobubbleCursor();
});

console.log("sads")

function bubbleCursor() {
	animate(
		circle,
		{ height: "20px", width: "20px" },
		{ duration: 0.75, type: "spring", bounce: 0.7 }
	);
}

function nobubbleCursor() {
	animate(
		circle,
		{ height: "10px", width: "10px" },
		{ duration: 0.75, type: "spring", bounce: 0.7 }
	);
}