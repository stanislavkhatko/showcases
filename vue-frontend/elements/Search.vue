<template>
    <div class="el-search">
        <el-input :autofocus="autofocus" class="input" :label="label" :value="searchValue" @input="search" :placeholder="placeholder || label">
            <template v-slot:before class="before">
                <el-icon name="search-normal" class="icon"/>
            </template>
            <template v-slot:after class="after">
                <div @click="clear" :class="['cross', {active: searchValue}]">&#10005;</div>
            </template>

        </el-input>
    </div>
</template>

<script>
import {debounce as _debounce} from "lodash"
import Back from "@/elements/Back.vue";


export default {
    name: "Search",
    components: {Back},
    props: ['label', 'placeholder', 'value', 'autofocus'],
    data() {
        return {
            searchValue: '',
        }
    },
    methods: {
        clear() {
            this.searchValue = '';
            this.$emit('search', '')
        },
        search: _debounce(function (e) {
            this.searchValue = e;
            this.$emit('search', e)
        }, 500)
    }

}
</script>

<style lang="scss" scoped>
.el-search {
  min-width: 220px;

  & .input {
    max-width: 400px;

    &::v-deep input {
      padding: 8.5px 0 8.5px 30px;
      border-width: 2px;
    }
  }

  & .search {
    position: absolute;
  }

  & .icon {
    width: 15px;
    height: 15px;
    transition: transform 0.3s ease;

    &.loading {
      animation: spin 10s infinite linear;
    }
  }

  &::v-deep .before {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    padding: 0 8px;
  }

  &::v-deep .after {
    font-size: 14px;
    padding: 0 8px;
    background: white;

    & .cross {
      width: 11px;
      cursor: pointer;
      user-select: none;
      opacity: 0;
      transition: opacity 0.3s;

      &.active {
        opacity: 1;
      }
    }
  }
}

</style>
