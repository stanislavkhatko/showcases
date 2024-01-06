<template>

  <div class="el-upload" @mouseenter="$emit('mouseenter')" @mouseleave="$emit('mouseleave')"
       :class="[size]">
    <el-input-label :value="label" :tooltip="labelTooltip"/>
    <div class="el-upload-wrapper">

      <div class="el-upload-images">
        <div class="el-upload-img">

          <div class="placeholder" v-if="!value">
            {{ placeholder || $t('general.addPhoto') }}
          </div>

          <div class="el-upload-multiple" v-if="multiple && value">
            <div class="image" v-for="(image, key) in value" :key="key">
              <el-remove class="remove" @click="removeImageIndex(key)"/>
              <img :key="image" :src="image.startsWith('http') ? image : `${prefix || ''}${image}`" alt="image">
            </div>
          </div>

          <el-remove v-if="!multiple && value && !disableRemove" class="remove" @click="removeImage"/>


          <el-photoswipe v-if="!multiple && value" class="photoswipe" :items="[{
                    src: original ? (original.startsWith('http') ? original : `${prefix}${original}`) : value.startsWith('http') ? value : `${prefix}${value}`,
                    thumbnail: value.startsWith('http') ? value : `${prefix}${value}`, w: 0, h: 0, alt: label
                         }]" :options="photoSwipeOptions">
            <img :src="value.startsWith('http') ? value : `${prefix || ''}${value}`" v-if="value" alt="image">

            <div class="photoswipe-inner">
              <el-icon name="search-zoom-in" v-tooltip="{delay: { show: 500, hide: 100 }, content: $t('buttons.show')}"
                       class="icon"/>
            </div>

          </el-photoswipe>
        </div>
        <div class="el-upload--help" v-if="help" v-html="help"></div>
      </div>

      <label class="el-upload-label">
        <input ref="file" type="file" :disabled="customBrowse" :multiple="multiple" @click="clickFile"
               @focus="$emit('focus')" @input="onInput" @change="onChange" name="file" :accept="accept"/>
        <span class="replacement" @click="$emit('browse')">
          <el-icon name="gallery-add" v-tooltip="{delay: { show: 500, hide: 100 }, content: $t('buttons.browse')}"/>
          <!--          {{ // $t('buttons.browse') }}-->
        </span>
      </label>

    </div>
    <el-input-error>{{ error }}</el-input-error>
  </div>

</template>

<script>

import Back from "@/elements/Back.vue";
import heic2any from "heic2any";


export default {
  name: "Upload",
  components: {Back},
  props: ['label', 'value', 'placeholder', 'size', 'customBrowse', 'disableRemove', 'filesLimit', 'withDataType', 'multiple', 'error', 'prefix', 'accept', 'withExif', 'original', 'help', 'labelTooltip'],
  data() {
    return {
      photoSwipeOptions: {
        closeOnScroll: false,
        shareEl: false,
        history: false,
        showHideAnimationType: 'zoom',
        closeOnVerticalDrag: false,
        pinchToClose: false
      }
    }
  },
  methods: {
    clickFile(e) {
      if (this.customBrowse) e.preventDefault();
    },
    onFocus() {
      this.$emit('focus');
      this.$emit('update:error', '');
    },
    async onInput(e) {
      this.$emit('blur')

      if (this.filesLimit && e.target.files.length > this.filesLimit) return alert(this.$tc('general.filesLimit', this.filesLimit, {n: this.filesLimit}))

      let results = [];

      this.$store.commit('mutatePreloader', true)

      for (let counter = 0; counter < e.target.files.length; counter++) {

        let file = e.target.files[counter]

        if (file.type === 'image/heic') {
          file = await heic2any({
            blob: file,
            quality: 0.4, // Default quality for heic images
            toType: 'image/jpeg',
            multiple: false
          })
        }

        let reader = new FileReader()

        reader.readAsDataURL(file)

        reader.onload = () => {
          let input = {};

          input.data = reader.result.split(',')[1]

          if (this.withExif) {
            let image = new Image();

            image.src = reader.result;

            image.onload = () => {
              input.exif = {
                height: image.height,
                width: image.width,
                orientation: image.height > image.width ? 6 : 1
              }

              results.push(input)

              if (e.target.files && counter === e.target.files.length - 1) this.emitResult(results)
            };
          } else if (this.withDataType) {
            results.push(reader.result)

            if (counter === e.target.files.length - 1) this.emitResult(results)
          } else {
            results.push(input)

            if (counter === e.target.files.length - 1) this.emitResult(results)
          }
        };
      }

      this.$store.commit('mutatePreloader', false)

    },
    emitResult(input) {
      this.$emit('input', this.multiple ? input : input[0])
      this.$emit('update:error', '');
    },
    onBlur() {
      this.$emit('update:error', '');
    },
    removeImageIndex(index) {
      this.$emit('delete', index)
    },
    removeImage() {
      this.$emit('input', '')
    },
    onChange(e) {
      this.$emit('change', e)
    },
  }
}
</script>

<style lang="scss" scoped>

.el-upload {
  margin-top: 20px;
  flex: 1;

  &.small {
    .el-upload-wrapper {
      border: none;
      padding: 0;
      height: 38px;
      overflow: hidden;
    }
  }

  &--help {
    font-size: 10px;
  }

  &-images {
    max-width: 50%;
    flex: 1;
    min-width: 50%;
  }

  & .placeholder {
    color: $placeholder-grey;
  }

  &-img {
    margin-right: 20px;
    position: relative;

    & img {
      width: 100%;
    }

    & .photoswipe {
      //position: absolute;
      //top: 5px;
      //right: 35px;

      &:hover .photoswipe-inner {
        opacity: 1;
      }

      &-inner {
        transition: opacity 0.3s ease;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.3);

        & .icon {
          color: white;
          width: 24px;
          height: 24px;
        }
      }
    }
  }

  & .el-upload-multiple .image {
    position: relative;
    margin-bottom: 15px;
  }

  & .remove {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    background: white;
    width: 28px;
    height: 28px;
    padding: 0 0 2px 2px;
    border-bottom-left-radius: 10px;
  }

  &-wrapper {
    width: 100%;
    font-size: 14px;
    background: white;
    border: 1px solid $light-green;
    border-radius: $small-radius;
    padding: 9px 7px;
    display: flex;
  }

  &-label {
    position: relative;
    display: inline-block;
    cursor: pointer;
    height: 38px;
    overflow: hidden;
    flex: 1;

    & input {
      //min-width: 14rem;
      width: 100%;
      margin: 0;
      filter: alpha(opacity=0);
      opacity: 0;
      height: 100%;
    }

    .replacement {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1;
      height: 38px;
      padding: 7px 12px;
      line-height: 1.5;
      color: #555;
      background-color: #eee;
      border: .075rem solid #ddd;
      border-radius: $small-radius;
      box-shadow: inset 0 .2rem .4rem rgba(0, 0, 0, .05);
      user-select: none;
    }

    /* Focus */
    & input:focus ~ .replacement {
      box-shadow: 0 0 0 .075rem #fff, 0 0 0 .2rem #0074d9;
    }
  }
}
</style>
