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
              ref="removeRule"
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
              :state="validParamPort"
            />
          </template>
          <template v-slot:foot(option2)="row">
            <b-form-input
              v-model="currentOption2"
              :place-holder="row.label"
              :state="validParamIp"
            />
          </template>
          <template v-slot:foot(option3)="row">
            <b-form-input
              v-model="currentOption3"
              :place-holder="row.label"
              :state="validParamPort"
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
      validParamPort: null,
      validParamIp: null,
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
      if (this.parameterCheckPort(this.currentOption1) && this.parameterCheckIp(this.currentOption2) && this.parameterCheckPort(this.currentOption3)) {
        this.$emit('addRule', this.currentRuleName, this.currentOption1, this.currentOption2, this.currentOption3);
      }
    },
    removeRule(rule) {
      this.$bvModal
        .msgBoxConfirm('Please confirm to remove rule.', {
          id: 'removeRuleConfirmation',
          title: 'Please Confirm',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value === true) {
            this.$emit('removeRule', this.normalizeString(rule.ruleName), rule.option1, rule.option2, rule.option3);
          }
        })
        .catch(() => {

        });
    },
    parameterCheckPort(port) {
      const portInt = Number.parseInt(port, 10);
      if (!Number.isNaN(portInt) && portInt >= 0 && portInt <= 65535) {
        this.validParamPort = null;
        return true;
      }
      this.validParamPort = false;
      return false;
    },
    parameterCheckIp(ip) {
      const arrIp = ip.split('.');
      let isValid = true;
      this.validParamIp = null;
      if (arrIp.length !== 4) {
        this.validParamIp = false;
        return false;
      }
      arrIp.forEach((num) => {
        if ((Number.isNaN(Number(num))) || Number(num) < 0 || Number(num) > 255) {
          isValid = false;
          this.validParamIp = false;
        }
      });
      return isValid;
    },
    normalizeString(str) {
      if (typeof str !== 'string') {
        return '';
      }
      let normalizedString = str.replace(/[\W_]+/g, ' ');
      if (normalizedString.length > 30) {
        normalizedString = normalizedString.substr(0, 30);
      }
      return normalizedString;
    },
  },
};
</script>
