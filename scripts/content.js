import {
	animate,
	hover,
} from "https://cdn.jsdelivr.net/npm/motion@latest/+esm";

const circle = document.querySelector("#followCursor");

hover("a, .bubble", () => {
	animate(
		circle,
		{ height: "20px", width: "20px" },
		{ duration: 0.75, type: "spring", bounce: 0.7 }
	);

	return () =>
		animate(
			circle,
			{ height: "10px", width: "10px" },
			{ duration: 0.75, type: "spring", bounce: 0.7 }
		);
});