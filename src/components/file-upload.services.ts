import * as client from "axios";

// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:quotemark
// tslint:disable-next-line:max-line-length
const BASE_URL =
  "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/9d80a6a1-76fa-4190-bace-a04a69ebef9c";

async function upload(formData: any): Promise<client.AxiosResponse> {
  const url = `${BASE_URL}/image`;
  let photos: File[] = formData.getAll("photos");
  const fReader = new FileReader();
  return new Promise((resolve, reject) => {
    fReader.onerror = () => {
      reject(new DOMException('Problem parsing file'));
    };
    fReader.onload = async () => {
      const result: any = await client.default.post(url, fReader.result, {
        headers: {
          "Prediction-Key": "8fb21dab1e1845e38613e24e51ed5fe0",
          "Content-Type": "text/octet-stream"
        }
      });
      resolve(result);
    };
    photos.map((p) => {
      fReader.readAsArrayBuffer(p);
    });
  });
}

export { upload };
