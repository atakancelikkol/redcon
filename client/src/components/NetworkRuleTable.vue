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
          :items="itemsContents"
          :fields="fieldContents"
          class="rules-container__table"
          foot-clone
        >
          <template v-slot:cell(operations)="row">
            <b-button
              ref="addRule"
              variant="danger"
              @click="removeRule(row.item)"
            >
              Remove
            </b-button>
          </template>
          <template v-slot:foot(ruleName)="row">
            <b-form-input
              v-model="currentRuleName"
              :place-holder="row.label"
            />
          </template>
          <template v-slot:foot(option1)="row">
            <b-form-input
              v-model="currentOption1"
              :place-holder="row.label"
            />
          </template>
          <template v-slot:foot(option2)="row">
            <b-form-input
              v-model="currentOption2"
              :place-holder="row.label"
            />
          </template>
          <template v-slot:foot(option3)="row">
            <b-form-input
              v-model="currentOption3"
              :place-holder="row.label"
            />
          </template>
          <template v-slot:foot(operations)>
            <b-button
              ref="addRule"
              variant="success"
              @click="addRule"
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
    ruleKeys: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentRuleName: '',
      currentOption1: '',
      currentOption2: '',
      currentOption3: '',
    };
  },
  computed: {
    fieldContents() {
      const tableFields = this.fields;
      tableFields.push({ key: 'operations', label: 'Operations' });
      return tableFields;
    },
    itemsContents() {
      const items = [...this.rules];
      const rule = items.map((item) => ({
        ruleName: item[this.ruleKeys.ruleName], option1: item[this.ruleKeys.option1], option2: item[this.ruleKeys.option2], option3: item[this.ruleKeys.option3],
      }));
      return rule;
    },
  },
  methods: {
    addRule() {
      this.$emit('addRule', this.currentRuleName, this.currentOption1, this.currentOption2, this.currentOption3);
    },
    removeRule(rule) {
      this.$emit('removeRule', rule.ruleName, rule.option1, rule.option2, rule.option3);
    },
  },
};
</script>
