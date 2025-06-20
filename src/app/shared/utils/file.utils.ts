export class FileUtils {
  static dataURLtoBlob(dataurl: string): Blob {
    const [meta, b64] = dataurl.split(',');
    const mime = meta.match(/:(.*?);/)![1];
    const binary = atob(b64);
    const len = binary.length;
    const u8arr = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      u8arr[i] = binary.charCodeAt(i);
    }
    return new Blob([u8arr], { type: mime });
  }

  static filteToBlob(file: File): Blob {
    return new Blob([file], { type: file.type });
  }
}
