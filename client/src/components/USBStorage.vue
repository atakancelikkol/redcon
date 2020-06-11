<template>
  <div class="usb-storage-container">
    <b-card
      title="USB Storage"
      style="flex:1; display:flex"
    >
      <div style="display:flex; flex-direction: row; margin-top:10px">
        <b-button
          ref="buttonOpen"
          variant="outline-primary"
          @click="onDetectButtonClicked"
        >
          Detect USB Devices
        </b-button>

        <b-button
          :variant="ecuLedState ? 'success': 'light'"
          style="margin-left: 40px;"
        >
          {{ ecuLedState ? 'Plugged to ECU' : 'Not plugged to ECU' }}
        </b-button>
        <b-button
          ref="buttonToggle"
          variant="primary"
          style="margin-left: 10px;"
          @click="onToggleButtonClicked"
        >
          Toggle USB Device
        </b-button>
        <b-button
          :variant="rpiLedState ? 'success': 'light'"
          style="margin-left: 10px;"
        >
          {{ rpiLedState ? 'Plugged to RPI' : 'Not plugged to RPI' }}
        </b-button>
      </div>
      <div class="usb-storage-container__info">
        <b>
          <u>Availability:</u>
          {{ usbStatus.availability }}
        </b>
      </div>
      <div class="usb-storage-container__info">
        <b>
          <u>Mounted Path:</u>
          {{ usbStatus.mountedpath }}
        </b>
        <b>
          <u>USB Name:</u>
          {{ usbStatus.usbName }}
        </b>
      </div>
      <b-card
        title="Browser"
        style="flex:1"
      >
        <div
          class="mt-3"
          style="display: flex;"
        >
          <b-form-file
            id="browse"
            ref="file-input"
            v-model="selectedFiles"
            :state="Boolean(selectedFiles)"
            :disabled="!isUsbDeviceAvailable"
            multiple
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
          />
          <b-button
            ref="buttonUpload"
            variant="outline-primary"
            style="margin-left: 10px"
            @click="onUploadClicked"
          >
            Upload
          </b-button>
        </div>
        <b-progress
          v-if="progressValue != -1"
          :value="progressValue"
          :max="100"
          show-progress
          animated
          style="margin-top: 10px"
        />
        <b-alert
          v-model="showUploadError"
          variant="danger"
          dismissible
          style="margin-top: 10px"
        >
          {{ errorString == '' ? 'Error occurred during upload!' : errorString }}
        </b-alert>
        <b-alert
          :show="usbError !=undefined && usbError!=''"
          variant="danger"
          style="margin-top: 10px"
        >
          {{ usbError }}
        </b-alert>
        <div
          class="mt-3"
          style="display:flex"
        >
          <b-breadcrumb
            class="mt-3"
            style="flex:1"
          >
            <b-breadcrumb-item active>
              {{ getDirectory }}
            </b-breadcrumb-item>
          </b-breadcrumb>
          <b-button
            ref="buttonCreateFolder"
            variant="outline-primary"
            style="margin-left: 10px; max-height:50px;margin-top: 15px"
            @click="onCreateFolderClicked"
          >
            Create a Folder
          </b-button>
        </div>
        <div class="mt-3">
          <b-table
            striped
            hover
            :items="itemList"
            :fields="['name', 'operations']"
          >
            <template v-slot:cell(name)="data">
              <b-link
                v-if="data.item.isDirectory"
                ref="linkDir"
                @click="selectDirectory(data.item.name, data.item.fullPath)"
              >
                {{ getVisibleItemName(data.item) }}
              </b-link>
              <span v-else>{{ data.item.name }}</span>
            </template>
            <template v-slot:cell(operations)="data">
              <b-button
                v-if="!(data.item.fullPath)"
                ref="buttonInfo"
                variant="outline-primary"
                style="margin-right: 20px;"
                @click="onInfoButtonClicked(data.item)"
              >
                Info
              </b-button>
              <b-button
                v-if="!data.item.isDirectory"
                ref="buttonDownload"
                variant="primary"
                style="margin-right: 20px;"
                @click="onDownloadFileClicked(data.item)"
              >
                Download
              </b-button>
              <b-button
                v-if="!(data.item.fullPath)"
                ref="buttonDelete"
                variant="outline-danger"
                @click="onDeleteItemClicked(data.item)"
              >
                Delete
              </b-button>
            </template>
          </b-table>
        </div>
      </b-card>
    </b-card>

    <b-modal
      id="item-info-modal"
      title="Item Info"
      :ok-only="true"
    >
      <div
        v-if="itemInfo == undefined"
        style="text-align: center"
      >
        <b-spinner
          variant="primary"
          label="Spinning"
        />
        <br>
        <br>Loading...
      </div>
      <div v-else>
        <div
          v-for="(item, index) in Object.keys(itemInfo)"
          :key="index"
        >
          <b>{{ item }}:</b>
          {{ itemInfo[item] }}
        </div>
      </div>
    </b-modal>
    <b-modal
      id="create-folder-modal"
      ref="modal"
      title="Folder Name"
      @ok="onCreateFolderModalOKClicked"
    >
      <b-form-input
        id="name-input"
        v-model="createdFolderName"
      />
    </b-modal>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import logger from '../helpers/Logger';

export default {
  name: 'USBStorage',
  data() {
    return {
      selectedFiles: null,
      currentDirectory: '.',
      progressValue: -1,
      showUploadError: false,
      errorString: '',
      createdFolderName: '',
    };
  },

  computed: {
    ...mapState(['receivedData']),
    usbStatus() {
      const status = {};
      if (this.receivedData.usb && this.receivedData.usb.isAvailable === true) {
        status.usbName = this.receivedData.usb.usbName;
        status.availability = `${status.usbName} is ready to be used`;
        status.mountedpath = this.receivedData.usb.mountedPath;

        return status;
      }
      status.usbName = '----------------';
      status.availability = 'USB is not ready';
      status.mountedpath = '----------------';
      return status;
    },
    isUsbDeviceAvailable() {
      if (!this.receivedData.usb) {
        return false;
      }
      return this.receivedData.usb.isAvailable;
    },
    ecuLedState() {
      return this.receivedData.usb && this.receivedData.usb.kvmLedStateECU;
    },
    rpiLedState() {
      return this.receivedData.usb && this.receivedData.usb.kvmLedStateRPI;
    },
    itemList() {
      if (!this.receivedData.usb) {
        return [];
      }
      return this.receivedData.usb.currentItems;
    },
    getDirectory() {
      if (!this.receivedData.usb) {
        return '';
      }
      return this.receivedData.usb.currentDirectory;
    },
    itemInfo() {
      return this.receivedData.usb
        ? this.receivedData.usb.currentItemInfo
        : undefined;
    },
    usbError() {
      if (!this.receivedData.usb) {
        return '';
      }
      return this.receivedData.usb.usbErrorString;
    },
  },
  watch: {
    isUsbDeviceAvailable() {
      this.listItemsUSBDevice({ path: this.currentDirectory });
    },
  },
  mounted() {
    this.listItemsUSBDevice({ path: this.currentDirectory });
  },
  methods: {
    ...mapActions([
      'toggleUSBPort',
      'detectUSBDevice',
      'listItemsUSBDevice',
      'deleteItemUSBDevice',
      'getItemInfoUSBDevice',
      'createFolderUSBDevice',
    ]),
    onToggleButtonClicked() {
      this.toggleUSBPort();
    },
    onDetectButtonClicked() {
      this.detectUSBDevice();
    },
    clearFiles() {
      this.$refs['file-input'].reset();
    },
    selectDirectory(dir, fullPath) {
      if (fullPath) {
        this.currentDirectory = dir;
      } else {
        this.currentDirectory += `/${dir}`;
      }

      this.listItemsUSBDevice({ path: this.currentDirectory });
    },
    getVisibleItemName(item) {
      if (item.name === '.') {
        return '[ROOT]';
      }
      if (item.fullPath) {
        return `[PARENT DIR] ${item.name}`;
      }
      return item.name;
    },
    onCreateFolderClicked() {
      this.$bvModal.show('create-folder-modal');
      this.createdFolderName = '';
    },
    onCreateFolderModalOKClicked() {
      this.createFolderUSBDevice({
        path: this.currentDirectory,
        folderName: this.createdFolderName,
      });
    },
    onDeleteItemClicked(item) {
      this.$bvModal
        .msgBoxConfirm(
          `Please confirm that you want to delete "${item.name}".`,
          {
            id: 'deleteItemModalConfirmation',
            title: 'Please Confirm',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'danger',
            okTitle: 'YES',
            cancelTitle: 'NO',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true,
          },
        )
        .then((value) => {
          if (value === true) {
            this.deleteItemUSBDevice({
              path: this.currentDirectory,
              itemName: item.name,
            });
          }
        })
        .catch((err) => {
          logger.error(err);
        });
    },
    onInfoButtonClicked(item) {
      this.getItemInfoUSBDevice({
        path: this.currentDirectory,
        itemName: item.name,
      });

      this.$bvModal.show('item-info-modal');
    },
    onUploadClicked() {
      if (this.isUsbDeviceAvailable === false) {
        return;
      }
      if (this.selectedFiles.length === 0) {
        return;
      }
      this.showUploadError = false;
      this.errorString = '';

      const formData = new FormData();
      this.selectedFiles.forEach((file) => {
        formData.append('uploads', file, file.name);
      });
      formData.append('currentDirectory', this.currentDirectory);

      // create xhr request
      const oReq = new XMLHttpRequest();
      oReq.addEventListener('load', this.eventListenerLoad.bind(this, oReq));
      oReq.upload.addEventListener(
        'progress',
        this.uploadEventListenerProgress.bind(this),
      );
      oReq.upload.addEventListener(
        'load',
        this.uploadEventListenerLoad.bind(this),
      );
      oReq.upload.addEventListener(
        'error',
        this.uploadEventListenerError.bind(this, oReq),
      );
      oReq.upload.addEventListener(
        'abort',
        this.uploadEventListenerAbort.bind(this, oReq),
      );

      const uri = `${this.getEndPoint()}/uploadFileToUsbDevice`;
      oReq.open('POST', uri);
      oReq.send(formData);
      this.clearFiles();
    },
    eventListenerLoad(oReq) {
      if (oReq.status !== 200) {
        this.showUploadError = true;
        this.errorString = oReq.responseText;
      } else {
        this.showUploadError = false;
        this.errorString = '';
      }
    },
    uploadEventListenerProgress(evt) {
      if (evt.lengthComputable) {
        let percentComplete = evt.loaded / evt.total;
        percentComplete = parseInt(percentComplete * 100, 10);
        this.progressValue = percentComplete;
      } else {
        this.progressValue = 50;
      }
    },
    uploadEventListenerLoad() {
      this.progressValue = -1;
    },
    uploadEventListenerError(err) {
      console.log(err);
      this.showUploadError = true;
      this.progressValue = -1;
    },
    uploadEventListenerAbort(err) {
      console.log(err);
      this.showUploadError = true;
      this.progressValue = -1;
    },
    getEndPoint() {
      const loc = window.location;
      let uri = `${loc.protocol}//`;
      if (process.env.NODE_ENV === 'production') {
        uri += `//${loc.host}`;
      } else {
        uri += '//localhost:3000';
      }

      return uri;
    },
    onDownloadFileClicked(item) {
      const path = this.currentDirectory;
      const fileName = item.name;
      const filePath = `${this.getEndPoint()}/getFileFromUsbDevice?path=${encodeURIComponent(
        path,
      )}&fileName=${encodeURIComponent(fileName)}`;
      window.open(filePath, '_blank');
    },
  },
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
