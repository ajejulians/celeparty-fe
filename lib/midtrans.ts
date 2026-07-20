function loadMidtransSnap(): Promise<void> {
	return new Promise((resolve, reject) => {
		if (document.getElementById("midtrans-snap")) {
			resolve();
			return;
		}
		const script = document.createElement("script");
		script.id = "midtrans-snap";
		script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
		script.setAttribute(
			"data-client-key",
			process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "",
		);
		script.onload = () => resolve();
		script.onerror = () => reject(new Error("Failed to load Midtrans Snap"));
		document.head.appendChild(script);
	});
}

export async function payWithMidtrans(
	token: string,
	callbacks: {
		onSuccess?: () => void;
		onPending?: () => void;
		onError?: () => void;
		onClose?: () => void;
	},
): Promise<void> {
	await loadMidtransSnap();
	const snap = (window as unknown as Record<string, unknown>).snap as {
		pay: (t: string, cbs: Record<string, () => void>) => void;
	} | undefined;
	if (!snap) throw new Error("Snap not available");
	snap.pay(token, {
		onSuccess: () => callbacks.onSuccess?.(),
		onPending: () => callbacks.onPending?.(),
		onError: () => callbacks.onError?.(),
		onClose: () => callbacks.onClose?.(),
	});
}
