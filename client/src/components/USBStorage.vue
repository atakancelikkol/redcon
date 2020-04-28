<template>
  <div class="usb-storage-container">
    <b-card title="USB Storage" style="flex:1; display:flex">
      <div style="display:flex; flex-direction: row; margin-top:10px">
        <b-button
          variant="outline-primary"
          @click="onButtonClicked"
        >Detect USB Devices</b-button>

        <b-button
          :variant="ecuLedState ? 'success': 'light'"
          style="margin-left: 40px;"
        >
          {{ ecuLedState ? 'Plugged to ECU' : 'Not plugged to ECU' }}
        </b-button>
        <b-button
          variant="primary"
          @click="onToggleButtonClicked"
          style="margin-left: 10px;"
        >Toggle USB Device</b-button>
        <b-button
          :variant="rpiLedState ? 'success': 'light'"
          style="margin-left: 10px;"
        >
          {{ rpiLedState ? 'Plugged to ECU' : 'Not plugged to ECU' }}
        </b-button>
        
      </div>
      <div class="usb-storage-container__info">
        <b>
          <u>Availability:</u>
          {{usbStatus.availability}}
        </b>
      </div>
      <div class="usb-storage-container__info">
        <b>
          <u>Mounted Path:</u>
          {{usbStatus.mountedpath}}
        </b>
        <b>
          <u>USB Name:</u>
          {{usbStatus.usbname}}
        </b>
      </div>
      <b-card title="Browser" style="flex:1">
        <div class="mt-3" style="display: flex;">
          <b-form-file
            id="browse"
            v-model="selectedFiles"
            :state="Boolean(selectedFiles)"
            :disabled="!isUsbDeviceAvailable"
            ref="file-input"
            multiple
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
          ></b-form-file>
          <b-button variant="outline-primary" style="margin-left: 10px" @click="onUploadClicked" >Upload</b-button>
        </div>
        <b-progress v-if="progressValue != -1" :value="progressValue" :max="100" show-progress animated style="margin-top: 10px"></b-progress>
        <b-alert v-model="showUploadError" variant="danger" dismissible style="margin-top: 10px">{{errorString == '' ? 'Error occurred during upload!' : errorString}}</b-alert>
        <b-breadcrumb style="margin-top: 10px">
          <b-breadcrumb-item active>{{fileDirectory}}</b-breadcrumb-item>
        </b-breadcrumb>
        <div>
          <b-table striped hover :items="fileList" :fields="['name', 'operations']">
            <template v-slot:cell(name)="data">
              <b-link
                v-if="data.item.isDirectory"
                @click="selectDirectory(data.item.name, data.item.fullPath)"
              >{{ getVisibleFileName(data.item) }}</b-link>
              <span v-else>{{ data.item.name }}</span>
            </template>
            <template v-slot:cell(operations)="data">
              <b-button
                v-if="!data.item.isDirectory"
                variant="outline-primary"
                @click="onDownloadFileClicked(data.item)"
                style="margin-right: 10px;"
              >Download</b-button>
              <b-button
                v-if="!data.item.isDirectory"
                variant="outline-danger"
                @click="onDeleteFileClicked(data.item)"
              >Delete</b-button>
            </template>
          </b-table>
        </div>
      </b-card>
    </b-card>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "USBStorage",
  data() {
    return {
      selectedFiles: null,
      currentDirectory: ".",
      progressValue: -1,
      showUploadError: false,
      errorString: '',
    };
  },
  mounted() {
    this.listFilesUSBDevice({ path: this.currentDirectory });
  },
  computed: {
    ...mapState(["receivedData"]),
    usbStatus() {
      let status = {};
      if (this.receivedData.usb && this.receivedData.usb.isAvailable == true) {
        status.usbname = this.receivedData.usb.usbName;
        status.availability = status.usbname + " is ready to be used";
        status.mountedpath = this.receivedData.usb.mountedPath;

        return status;
      } else {
        status.usbname = "----------------";
        status.availability = "USB is not ready";
        status.mountedpath = "----------------";
        return status;
      }
    },
    isUsbDeviceAvailable() {
      if (!this.receivedData.usb) {
        return false;
      }

      return this.receivedData.usb.isAvailable;
    },
    ecuLedState() {
      return this.receivedData.usb.kvmLedStateECU;
    },
    rpiLedState() {
      return this.receivedData.usb.kvmLedStateRPI;
    },
    fileList() {
      if (!this.receivedData.usb) {
        return [];
      }

      return this.receivedData.usb.currentFiles;
    },
    fileDirectory() {
      if (!this.receivedData.usb) {
        return "";
      }

      return this.receivedData.usb.currentDirectory;
    }
  },
  methods: {
    ...mapActions([
      "toggleUSBPort",
      "detectUSBDevice",
      "listFilesUSBDevice",
      "deleteFileUSBDevice"
    ]),
    onToggleButtonClicked() {
      this.toggleUSBPort();
    },
    onButtonClicked() {
      this.detectUSBDevice();
    },
    uploadFile() {
      // Upload method
    },
    clearFiles() {
      this.$refs["file-input"].reset();
    },
    selectDirectory(dir, fullPath) {
      if (fullPath) {
        this.currentDirectory = dir;
      } else {
        this.currentDirectory += "/" + dir;
      }

      this.listFilesUSBDevice({ path: this.currentDirectory });
    },
    getVisibleFileName(item) {
      if (item.name == ".") {
        return "[ROOT]";
      } else if (item.fullPath) {
        return "[PARENT DIR] " + item.name;
      } else {
        return item.name;
      }
    },
    onDeleteFileClicked(item) {
      this.$bvModal
        .msgBoxConfirm(`Please confirm that you want to delete "${item.name}".`, {
          title: "Please Confirm",
          size: "sm",
          buttonSize: "sm",
          okVariant: "danger",
          okTitle: "YES",
          cancelTitle: "NO",
          footerClass: "p-2",
          hideHeaderClose: false,
          centered: true
        })
        .then(value => {
          if (value == true) {
            this.deleteFileUSBDevice({
              path: this.currentDirectory,
              fileName: item.name
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    onUploadClicked() {
      if(this.isUsbDeviceAvailable == false) {
        return;
      }

      if(this.selectedFiles.length == 0) {
        return;
      }

      this.showUploadError = false;
      this.errorString = '';

      let formData = new FormData();
      this.selectedFiles.forEach(file => {
        formData.append('uploads', file, file.name);
      });
      formData.append('currentDirectory', this.currentDirectory);

      // create xhr request
      const oReq = new XMLHttpRequest();
      oReq.addEventListener("load", () => {
        if(oReq.status != 200) {
          this.showUploadError = true;
          this.errorString = oReq.responseText;
        } else {
          this.showUploadError = false;
          this.errorString = '';
        }
      });
      oReq.upload.addEventListener("progress", (evt) => {
        if (evt.lengthComputable) {
          let percentComplete = evt.loaded / evt.total;
          percentComplete = parseInt(percentComplete * 100);
          this.progressValue = percentComplete;
        } else {
          this.progressValue = 50;
        }
      });
      oReq.upload.addEventListener("load", () => {
        this.progressValue = -1;
      });
      oReq.upload.addEventListener("error", (err) => {
        console.log(err)
        this.showUploadError = true;
        this.progressValue = -1;
      });
      oReq.upload.addEventListener("abort", (err) => {
        console.log(err)
        this.showUploadError = true;
        this.progressValue = -1;
      });

      
      let uri = this.getEndPoint() + "/uploadFileToUsbDevice";
      oReq.open("POST", uri);
      oReq.send(formData);
    },
    getEndPoint() {
      let loc = window.location;
      let uri = loc.protocol + '//';
      if (process.env.NODE_ENV == 'production') {
        uri += "//" + loc.host;
      } else {
        uri += "//localhost:3000";
      }

      return uri;
    },
    onDownloadFileClicked(item) {
      let path = this.currentDirectory;
      let fileName = item.name;
      window.location = this.getEndPoint() + '/getFileFromUsbDevice?path=' + encodeURIComponent(path) + '&fileName=' + encodeURIComponent(fileName);
    }
  },
  watch: {
    isUsbDeviceAvailable() {
      this.listFilesUSBDevice({ path: this.currentDirectory });
    }
  }
};
</script>

<style>
.usb-storage-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.usb-storage-container > .card > .card-body {
  display: flex;
  flex-direction: column;
}
.usb-storage-container__info {
  margin-top: 18px;
}
</style>