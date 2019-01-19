function upload(formData: any) {
    const photos = formData.getAll('photos');
    console.info(photos);
    const promises = photos.map((x: any) => getImage(x)
        .then((img: any) => ({
            "data": {
              "id": "08d8780f-76d7-4a24-80ce-c6f1ec3b19a3",
              "project": "9d80a6a1-76fa-4190-bace-a04a69ebef9c",
              "iteration": "314dbc47-fd97-4e1e-8aab-7659afd85d07",
              "created": "2019-01-19T01:33:51.0291283Z",
              "predictions": [
                {
                  "probability": 1,
                  "tagId": "074abf4e-6da9-403b-a832-60013e9c0a38",
                  "tagName": "chick"
                },
                {
                  "probability": 0,
                  "tagId": "f96d0a12-ad3f-41fd-9eeb-0d0e91fda5e6",
                  "tagName": "dog"
                },
                {
                  "probability": 0,
                  "tagId": "7494af51-a4b3-4d3a-aa82-b4a9ab23d89b",
                  "tagName": "penguin"
                },
                {
                  "probability": 0,
                  "tagId": "ab37c37f-4674-4a5b-90b3-5f0f86c69bf4",
                  "tagName": "rat"
                }
              ]
            },
            "status": 200,
            "statusText": "OK",
            "headers": {
              "content-type": "application/json; charset=utf-8"
            },
            "config": {
              "transformRequest": {},
              "transformResponse": {},
              "timeout": 0,
              "xsrfCookieName": "XSRF-TOKEN",
              "xsrfHeaderName": "X-XSRF-TOKEN",
              "maxContentLength": -1,
              "headers": {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "text/octet-stream",
                "Prediction-Key": "8fb21dab1e1845e38613e24e51ed5fe0"
              },
              "method": "post",
              "url": "https://southcentralus.api.cognitive.microsoft.com/customvision/v2.0/Prediction/9d80a6a1-76fa-4190-bace-a04a69ebef9c/image",
              "data": {}
            },
            "request": {}
          })));
    return Promise.all(promises);
}

function getImage(file: Blob) {
    return new Promise((resolve, reject) => {
        const fReader = new FileReader();
        const img = document.createElement('img') as HTMLImageElement;

        fReader.onload = () => {
            if (typeof fReader.result === 'string') {
                img.src = fReader.result;
                resolve(getBase64Image(img));
            } else {
                reject('invalid-image');
            }
        };
        fReader.readAsDataURL(file);
    });
}

function getBase64Image(img: any) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    if (ctx == null) { return; }
    ctx.drawImage(img, 0, 0);
    const dataURL = img.src;
    return dataURL;
}

export { upload };
