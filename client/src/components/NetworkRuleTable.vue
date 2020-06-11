<template>
  <div class="port-mapping-container">
    <b-card
      :title="tableTitle"
      style="flex:1"
    >
      <div class="row">
        <b-table
          striped
          hover
          :items="rules"
          :fields="fieldContents"
          class="rules-container__table"
        >
          <template v-slot:cell(ruleName)="row">
            <b-form-input v-model="row.item.ruleName" />
          </template>
          <template v-slot:cell(option1)="row">
            <b-form-input v-model="row.item.option1" />
          </template>
          <template v-slot:cell(option2)="row">
            <b-form-input v-model="row.item.option2" />
          </template>
          <template v-slot:cell(option3)="row">
            <b-form-input v-model="row.item.option3" />
          </template>
          <template v-slot:cell(operations)>
            <b-button
              ref="addRule"
              variant="success"
              @click="addRule()"
            >
              Add
            </b-button>
          </template>
        </b-table>
      </div>
    </b-card>
  </div>
</template>

<script>


export default {
  name: 'NetworkConfigTable',
  props: {
    fields: {
      type: Array,
      default: () => [],
    },
    tableTitle: {
      type: String,
      default: () => 'Rules',
    },
    rule: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      rules: [{
        ruleName: 'Device', option1: '0.0.0.0', option2: '0.0.0.0', option3: '0.0.0.0', operations: 'qwes',
      }],
    };
  },
  computed: {
    fieldContents() {
      let tableFields = this.fields;
      tableFields = tableFields.push('operations');
      return tableFields;
    },
  },
  methods: {
    addRule() {
      this.$emit('addRule', this.rules);
    },
    removeRule() {
      this.$emit('removeRule', this.rules);
    },
  },
};
</script>
