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
          :items="rule"
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
    rules: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      rule: [{
        ruleName: 'Device', option1: '0.0.0.0', option2: '0.0.0.0', option3: '0.0.0.0', operations: 'qwes',
      }],
    };
  },
  computed: {
    fieldContents() {
      const tableFields = this.fields;
      // tableFields = tableFields.push({ key: 'operations', label: 'operations' });
      return tableFields;
    },
  },
  methods: {
    addRule() {
      this.$emit('addRule', this.rule);
    },
    removeRule() {
      this.$emit('removeRule', this.rule);
    },
  },
};
</script>
