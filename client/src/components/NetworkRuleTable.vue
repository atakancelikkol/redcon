<template>
  <div class="port-mapping-container">
    <b-card
      :title="tableTitle"
      style="flex:1"
    >
      <div class="row">
        <div class="table-responsive col-md-6">
          <b-table
            striped
            hover
            :items="items"
            :fields="fieldsIntToExt"
            class="rules-container__table"
          >
            <template v-slot:cell(optionip1)="row">
              <b-form-input v-model="row.item.optionip1" />
            </template>
            <template v-slot:cell(optionip2)="row">
              <b-form-input v-model="row.item.optionip2" />
            </template>
            <template v-slot:cell(optionip3)="row">
              <b-form-input v-model="row.item.optionip3" />
            </template>
            <template v-slot:cell(optionip4)="row">
              <b-form-input v-model="row.item.optionip4" />
            </template>
          </b-table>
          <div class="input-group">
            <b-button
              ref="addRule"
              variant="success"
              style="margin-left: 5px"
              @click="addInternalToExternal()"
            >
              Add Rule
            </b-button>
          </div>
        </div>
        <div class="table-responsive col-md-6">
          <b-table
            striped
            hover
            :items="items"
            :fields="fieldsIntToExt"
            class="rules-container__table"
          >
            <template v-slot:cell(optionip1)="row">
              <b-form-input v-model="row.item.optionip1" />
            </template>
            <template v-slot:cell(optionip2)="row">
              <b-form-input v-model="row.item.optionip2" />
            </template>
            <template v-slot:cell(optionip3)="row">
              <b-form-input v-model="row.item.optionip3" />
            </template>
            <template v-slot:cell(optionip4)="row">
              <b-form-input v-model="row.item.optionip4" />
            </template>
          </b-table>
          <div class="input-group">
            <b-button
              ref="addRule"
              variant="success"
              style="margin-left: 5px"
              @click="addExternalToInternal()"
            >
              Add Rule
            </b-button>
          </div>
        </div>
      </div>
    </b-card>
  </div>
</template>

<script>


export default {
  name: 'NetworkConfigTable',
  props: {
    fieldsIntToExt: {
      type: Array,
      default: () => [],
    },
    fieldsExtToInt: {
      type: Array,
      default: () => [],
    },
    tableTitle: {
      type: String,
      default: () => 'Rules',
    },
    itemExtToInt: {
      type: Array,
      default: () => [],
    },
    itemIntToExt: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      items: [{
        optionip1: 'Joe', optionip2: 33, optionip3: 'qwe', optionip4: 'qwes',
      }],
    };
  },
  methods: {
    addInternalToExternal() {
      this.$emit('addInternalToExternal', this.items);
    },
    addExternalToInternal() {
      this.$emit('addExternalToInternal', this.items);
    },
    removeInternalToExternal() {
      this.$emit('removeInternalToExternal');
    },
    removeExternalToInternal() {
      this.$emit('removeExternalToInternal');
    },
  },
};
</script>
