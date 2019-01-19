import * as client from "axios";

// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:quotemark
// tslint:disable-next-line:max-line-length
const BASE_URL =
  "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/9d80a6a1-76fa-4190-bace-a04a69ebef9c";

async function upload(formData: any) {
  const url = `${BASE_URL}/image`;
  let photos: File[] = formData.getAll("photos");
  const fReader = new FileReader();
  fReader.onload = async (e) => {
    console.info(e);
    var result:any = await client.default.post(url, fReader.result, {
      headers: {
        "Prediction-Key": "8fb21dab1e1845e38613e24e51ed5fe0",
        "Content-Type": "text/octet-stream",
    }});
    console.info(result.data);
    return result;
  };
  photos.forEach((p) => {
    fReader.readAsArrayBuffer(p);
  });
}

export { upload };
