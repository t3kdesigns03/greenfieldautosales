/**
 * Browser-side photo prep for /admin: decode → scale so the long edge is at
 * most 1600px → WebP. Phones' 12–48 MP photos become ~200–400 KB before they
 * ever leave the device.
 *
 * Most browsers encode WebP from a canvas natively. Safari doesn't, so it
 * falls back to a WebAssembly encoder (@jsquash/webp), loaded only then.
 */
export const MAX_EDGE = 1600;
const QUALITY = 0.8;

export type PreparedImage = { blob: Blob; width: number; height: number; blur: string };

async function decode(file: File): Promise<CanvasImageSource & { width: number; height: number }> {
  try {
    return await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    // Older browsers: go through an <img>.
    const url = URL.createObjectURL(file);
    try {
      const img = new Image();
      img.decoding = "async";
      img.src = url;
      await img.decode();
      return Object.assign(img, { width: img.naturalWidth, height: img.naturalHeight });
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

const toBlob = (c: HTMLCanvasElement, type: string, q: number) =>
  new Promise<Blob | null>((res) => c.toBlob(res, type, q));

export async function prepareImage(file: File, opts: { forceWasm?: boolean } = {}): Promise<PreparedImage> {
  if (!file.type.startsWith("image/") && !/\.(jpe?g|png|webp|heic|heif|avif|gif)$/i.test(file.name)) {
    throw new Error(`${file.name} isn't an image.`);
  }
  let src: Awaited<ReturnType<typeof decode>>;
  try {
    src = await decode(file);
  } catch {
    throw new Error(`Couldn't read ${file.name}. If it's an iPhone HEIC photo, export it as JPEG first.`);
  }

  const scale = Math.min(1, MAX_EDGE / Math.max(src.width, src.height));
  const width = Math.max(1, Math.round(src.width * scale));
  const height = Math.max(1, Math.round(src.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("This browser can't process photos.");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, 0, 0, width, height);
  if ("close" in src && typeof src.close === "function") src.close();

  let blob = opts.forceWasm ? null : await toBlob(canvas, "image/webp", QUALITY);
  if (!blob || blob.type !== "image/webp") {
    const { default: encode } = await import("@jsquash/webp/encode");
    const data = ctx.getImageData(0, 0, width, height);
    blob = new Blob([await encode(data, { quality: QUALITY * 100 })], { type: "image/webp" });
  }

  // Tiny preview for the public site's blur-up effect.
  const tiny = document.createElement("canvas");
  tiny.width = 16;
  tiny.height = Math.max(1, Math.round((16 * height) / width));
  tiny.getContext("2d")!.drawImage(canvas, 0, 0, tiny.width, tiny.height);
  const blur = tiny.toDataURL("image/jpeg", 0.5);

  return { blob, width, height, blur };
}
