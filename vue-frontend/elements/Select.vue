<template>
  <div class="el-select"
       :class="[{'disabled': disabled}, {inline: typeof inline !== 'undefined'}, size]">
    <el-input-label class="label" :value="label" :tooltip="labelTooltip"/>

    <v-select
        :class="{taggable: taggable}"
        :select-on-key-codes="[188, 13]"
        :disabled="!!disabled"
        :searchable="typeof searchable === 'undefined' || searchable"
        :clearSearchOnBlur="clearSearchOnBlur"
        :value="computedValue"
        :clearable="!!clearable"
        :label="optionLabel"
        :placeholder="placeholder || (multiple ? $t('general.selectOptions') : $t('general.selectOption'))"
        @input="onInput"
        @search="onSearch"
        @search:focus="onFocus"
        @search:blur="onBlur"
        :getOptionLabel="getOptionLabel"
        :taggable="taggable"
        :closeOnSelect="!multiple"
        :multiple="multiple"
        :push-tags="pushTags"
        :reduce="reduce"
        class="select-input"
        :options="options || []"
    >

      <template v-slot:open-indicator="{ attributes }">
        <slot name="open-indicator" v-bind="attributes">
          <el-icon name="arrow-down" style="height: 18px"/>
        </slot>
      </template>

      <template v-slot:list-footer>
        <div class="el-dropdown--list-footer">{{ listFooterText }}</div>
      </template>

      <template v-slot:list-header>
        <div class="el-dropdown--list-header" style="text-align: center">{{ listHeaderText }}</div>
      </template>

      <template v-slot:footer>
        <div class="el-dropdown--footer" v-if="footerText"><span>{{ footerText }}</span></div>
      </template>

      <template v-slot:no-options="{ search, searching }">
        <template v-if="searching"></template>
        <span v-else>Start typing to add new option</span>
      </template>

      <template v-slot:option="option">
        <slot name="option" v-bind="option">
          <div class="option" :class="{disabled: optionDisabled(option)}">
            <div class="option-label">
              {{ getOptionLabel(option) }}
            </div>

            <div class="option-mark"
                 v-show="showOptionMark(option)">
              <el-icon style="width: inherit; height: 10px;" name="check"/>
            </div>
          </div>
        </slot>
      </template>

      <template v-slot:selected-option="option">
        <slot name="selected-option" v-bind="option"></slot>
      </template>

      <template v-slot:no-options>
        <slot name="no-options">{{
            labelNoOptions !== undefined ? labelNoOptions : $t('buttons.optionNotExists')
          }}
        </slot>
      </template>

    </v-select>

    <el-input-error>{{ error }}</el-input-error>
  </div>
</template>

<script>
import vSelect from "vue-select";
import "vue-select/src/scss/vue-select.scss";
import {debounce as _debounce, isEqual as _isEqual} from "lodash"
import ElSelectDeselect from "@/elements/ElSelectDeselect.vue";


export default {
  name: "Select",
  components: {
    vSelect
  },
  props: ['label', 'pushTags', 'trackBy', 'value', 'inline', 'error', 'size', 'searchable', 'footerText', 'listHeaderText', 'listFooterText', 'labelNoOptions', 'options', 'reduce', 'taggable', 'multiple', 'clearable', 'optionLabel', 'placeholder', 'disabled', 'labelTooltip'],
  data: () => {
    return {
      Deselect: {
        render: h => h(ElSelectDeselect)
      },
      attributes: {
        'ref': 'openIndicator',
        'role': 'presentation',
        'class': 'vs__open-indicator',
      },
    }
  },
  computed: {
    computedValue() {

      try {
        if (this.value.startsWith('[')) {
          return JSON.parse(this.value)
        }
      } catch (e) {
        return this.value;
      }

      return this.value;
    }
  },
  methods: {
    showOptionMark(option) {
      return this.multiple ? this.computedValue && this.computedValue.includes(this.reduce ? this.reduce(option) : option) : (this.reduce ? this.reduce(option) === this.computedValue : this.isEqual(this.computedValue, option))
    },
    optionDisabled(option) {
      return option.disabled
    },
    isEqual(obj1, obj2) {
      return _isEqual(obj1, obj2)
    },
    getOptionLabel(option) {
      if (typeof option === 'object') {
        return option[this.optionLabel || 'label']
      }
      return option;
    },
    onFocus() {
      this.$emit('focus');
      this.$emit('update:error', '');
    },
    onInput(e) {
      this.$emit('input', e || '');
      this.$emit('update:error', '');
    },
    onBlur() {
      this.$emit('blur');
      this.$emit('update:error', '');
    },
    clearSearchOnBlur() {
      return true;
    },
    search: _debounce(function (search, loading) {
      this.$emit('search', {search, loading})
    }, 500),
    onSearch(search, loading) {
      if (search && search.length) {
        this.search(search, loading)
      } else {
        loading(false)
      }
    },
  }
}
</script>

<!--<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>-->


<style lang="scss" scoped>

.el-select {
  margin-top: 20px;
  display: block;

  &.inline {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    flex-wrap: wrap;
  }

  &.disabled {
    &::v-deep {
      & .vs--disabled {
        & .vs__open-indicator {
          background: transparent;

          & img {
            opacity: 0.3;
          }
        }
      }
    }
  }

  & .select-input {
    width: 100%;
    font-size: 16px;
    display: block;

    & .option {
      display: flex;
      justify-content: space-between;

      &.disabled {
        font-weight: 500;
        color: #8f8f8f;
        font-size: 12px;
      }

      &-label {
        flex: 1;
        overflow: hidden;
      }

      &-mark {
        width: 10px;
        margin-left: 5px;

        & img {
          width: 100%;
        }
      }
    }

  }

  &::v-deep {

    & .vs__spinner {
      width: 20px;
      height: 20px;
    }

    &.small {

      & .vs__dropdown-toggle {
        padding: 3px 6px 3px 11px;
      }
    }

    & .vs--unsearchable {
      & input {
        display: none;
      }
    }

    & .vs--searchable.vs--open .vs__selected-options {
      flex-direction: row-reverse;
    }

    & .vs--searchable.taggable .vs__selected-options {
      flex-direction: row-reverse;
    }

    & .vs__dropdown-option--highlight {
      background: $dark-green;
      color: $white;
    }

    & .vs__selected-options {
      padding: 0;
      overflow: hidden;
      align-items: center;
      position: relative;
      background: inherit;
      min-height: 20px;
    }

    & .vs__selected {
      line-height: initial;
      margin: 0 3px 0 0;
      white-space: nowrap;
      border: none;
      background: inherit;
      padding: 0;
      user-select: none;
      z-index: 2;
      min-height: 20px;
      font-size: $base-font;
      max-width: 400px;

      & + input {
        position: absolute;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        height: 100%;
        width: 100%;
      }
    }

    & .vs__search {
      padding: 0;
      margin: 0;
      line-height: 16px;
      font-size: $base-font;
    }

    & .vs__dropdown-option {
      padding: 5px 11px;
      line-height: inherit;
    }

    & input::placeholder {
      color: $placeholder-grey;
    }

    & .vs__dropdown-toggle {
      border: 1px solid $light-green;
      border-radius: $small-radius;
      //padding: 9px 6px 9px 11px;
      padding: 8px 6px 8px 11px;
      background: white;
    }

    & .vs__actions {
      padding: 0 1px;
    }

    & .vs__open-indicator {
      width: 18px;
      display: flex;
      align-items: center;

      & img {
        width: 100%;
      }
    }

    & .vs__dropdown-menu {
      border-radius: 0 0 10px 10px;
      top: calc(100% - 7px);
      //box-shadow: $default-box-shadow;
      box-shadow: none;
    }
  }

}


</style>
