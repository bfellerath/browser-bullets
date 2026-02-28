import { KokoroTTS } from 'kokoro-js';

type InMsg = { type: 'generate'; text: string; id: number };

type OutMsg =
	| { type: 'loading_model'; id: number }
	| { type: 'generating'; id: number }
	| { type: 'audio'; id: number; buffer: ArrayBuffer }
	| { type: 'error'; id: number; message: string };

let tts: KokoroTTS | null = null;

async function getModel(): Promise<KokoroTTS> {
	if (!tts) {
		tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
			dtype: 'q8',
			device: 'wasm'
		});
	}
	return tts;
}

self.addEventListener('message', async (e: MessageEvent<InMsg>) => {
	if (e.data.type !== 'generate') return;
	const { text, id } = e.data;

	self.postMessage({ type: 'loading_model', id } satisfies OutMsg);
	try {
		const model = await getModel();
		self.postMessage({ type: 'generating', id } satisfies OutMsg);
		const audio = await model.generate(text, { voice: 'af_heart' });
		const wav = audio.toWav() as ArrayBuffer;
		self.postMessage(
			{ type: 'audio', id, buffer: wav } satisfies OutMsg,
			{ transfer: [wav] }
		);
	} catch (err) {
		self.postMessage({ type: 'error', id, message: String(err) } satisfies OutMsg);
	}
});
