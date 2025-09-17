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
		{ height: "50px", width: "5px", borderRadius: "5px" },
		{ duration: 0.25, ease: "ease-out" }
	);

	return () =>
		animate(
			circle,
			{ height: "10px", width: "10px", borderRadius: "50%" },
			{ duration: 0.25, ease: "ease-out" }
		);
});

// Loader
const loaderSequence = [
	[
		"#loading > span",
		{ filter: "blur(0px)", opacity: 1 },
		{
			delay: stagger(.5),
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