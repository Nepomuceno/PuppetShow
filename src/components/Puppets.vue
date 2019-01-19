<template>
  <div class="section section--main">
    <div class="container">
      <div class="row">
        <div class="medium-8 column">
          <div class="card card--component">
            <div class="row">
              <!--UPLOAD-->
              <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
                <h1>Upload images</h1>
                <div class="dropbox">
                  <input
                    type="file"
                    multiple
                    :name="uploadFieldName"
                    :disabled="isSaving"
                    @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                    accept="image/*"
                    class="input-file"
                    capture="camera"
                  >
                  <p v-if="isInitial">Drag your file(s) here to begin
                    <br>or click to browse
                  </p>
                  <p v-if="isSaving">Uploading {{ fileCount }} files...</p>
                </div>
                <div style="align-items: center; justify-content: center; padding-top:5px;">
                  <button class="button button--ghost" id="capture">Identify</button>
                </div>
                <div id="testcam">
                  <video id="player" style="width:500px; height:500px" ref="player" autoplay></video>
                </div>
              </form>
              <!--SUCCESS-->
              <div v-if="isSuccess">
                <h2>Uploaded {{ uploadedFiles.length }} file(s) successfully.</h2>
                <p>
                  <a href="javascript:void(0)" @click="reset()">Try again</a>
                </p>
                <img :src="`/images/${tagName}${Math.floor(Math.random() * Math.floor(3) + 1)}.jpeg`" :alt="tagName"/>
              </div>
              <!--FAILED-->
              <div v-if="isFailed">
                <h2>Uploaded failed.</h2>
                <p>
                  <a href="javascript:void(0)" @click="reset()">Try again</a>
                </p>
                <pre>{{ uploadError }}</pre>
              </div>
            </div>
            <canvas ref="v-canvas" id="canvas" style="display:none"></canvas>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { upload } from "./file-upload.services";
import { wait } from "./util";
import * as isMobile from "ismobilejs";
import * as client from "axios";

const constraints = {
  video: true
};
const STATUS_INITIAL = 0,
  STATUS_SAVING = 1,
  STATUS_SUCCESS = 2,
  STATUS_FAILED = 3;

@Component
export default class Puppets extends Vue {
  @Prop() private msg!: string;

  canvas: HTMLCanvasElement | null = null;
  videoPlayer: HTMLVideoElement | null = null;
  uploadedFiles: Array<File> = [];
  uploadError: any | null = null;
  currentStatus: any | null = null;
  uploadFieldName: String = "photos";
  fileCount: number = 0;
  mobile: boolean = false;
  probability: number = 0;
  tagName: string = 'dog';

  mounted() {
    console.log("Starting to detect ppuppets");
    this.mobile = isMobile.any;
    this.canvas = <HTMLCanvasElement>this.$refs["v-canvas"];
    this.currentStatus = STATUS_INITIAL;
    this.videoPlayer = <HTMLVideoElement>this.$refs["player"];
    if (!this.mobile) {
      console.info("getting-media");
      navigator.mediaDevices.getUserMedia(constraints).then(stream => {
        if (this.videoPlayer) this.videoPlayer.srcObject = stream;
      });
    }
  }
  get isInitial() {
    return this.currentStatus == STATUS_INITIAL;
  }
  get isSaving() {
    return this.currentStatus === STATUS_SAVING;
  }
  get isSuccess() {
    return this.currentStatus === STATUS_SUCCESS;
  }
  get isFailed() {
    return this.currentStatus === STATUS_FAILED;
  }
  reset() {
    // reset form to initial state
    this.currentStatus = STATUS_INITIAL;
    this.uploadedFiles = [];
    this.uploadError = null;
  }
  save(formData: any) {
    // upload data to the server
    this.currentStatus = STATUS_SAVING;
    upload(formData)
      //.then(wait(1500)) // DEV ONLY: wait for 1.5s
      .then(x => {
        let prediction = x.data.predictions[0];
        if(prediction.probability > 0.7)
        {
          this.probability = prediction.probability;
          this.tagName = prediction.tagName;
        }
        this.uploadedFiles = [];
        this.currentStatus = STATUS_SUCCESS;
      })
      .catch(err => {
        this.uploadError = err.response;
        this.currentStatus = STATUS_FAILED;
      });
  }
  filesChange(fieldName: any, fileList: any) {
    // handle file changes
    const formData = new FormData();
    if (!fileList.length) return;
    // append the files to FormData
    Array.from(Array(fileList.length).keys()).map(x => {
      formData.append(fieldName, fileList[x], fileList[x].name);
    });
    // save it
    this.save(formData);
  }
  saveImage() {
    if (this.canvas != null) {
      var canvasData = this.canvas.toDataURL("image/png");
      var blobBin = atob(canvasData.split(",")[1]);
      var array = [];
      for (var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
      }
      var file = new Blob([new Uint8Array(array)], { type: "image/png" });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.dropbox {
  outline: 2px dashed grey; /* the dash box */
  outline-offset: -10px;
  background: lightcyan;
  color: dimgray;
  padding: 10px 10px;
  min-height: 200px; /* minimum height */
  position: relative;
  cursor: pointer;
}

.input-file {
  opacity: 0; /* invisible but it's there! */
  width: 100%;
  height: 200px;
  position: absolute;
  cursor: pointer;
}

.dropbox:hover {
  background: lightblue; /* when mouse over to the drop zone, change color */
}

.dropbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 50px 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
