import Vue from 'vue'
import Button from "@/elements/Button.vue";
import ButtonGroup from "@/elements/ButtonGroup.vue";
import Radio from "@/elements/Radio.vue";
import Location from "@/elements/Location.vue";
import Remove from "@/elements/Remove.vue";
import InfiniteLoader from "@/elements/InfiniteLoader.vue";
import Input from "@/elements/Input.vue";
import Address from "@/elements/Address.vue";
import TablePagination from "@/elements/TablePagination.vue";
import Icon from "@/elements/Icon.vue";
import Json from "@/elements/Json.vue";
import Checkbox from "@/elements/Checkbox.vue";
import Popup from "@/elements/Popup.vue";
import Switcher from "@/elements/Switcher.vue";
import Datetime from "@/elements/Datetime.vue";
import Upload from "@/elements/Upload.vue";
import Select from "@/elements/Select.vue";
import Textarea from "@/elements/Textarea.vue";
import InputError from "@/elements/InputError.vue";
import InputLabel from "@/elements/InputLabel.vue";
import PhotoSwipe from "@/elements/PhotoSwipe.vue";
import Accordion from "@/elements/Accordion.vue";
import Table from "@/elements/Table.vue";
import InfoBox from "@/elements/InfoBox.vue";
import Slider from "@/elements/Slider.vue";
import Back from "@/elements/Back.vue";
import Search from "@/elements/Search.vue";

Vue.config.productionTip = false

Vue.component('el-button', Button)
Vue.component('el-button-group', ButtonGroup)
Vue.component('el-radio', Radio)
Vue.component('el-location', Location)
Vue.component('el-remove', Remove)
Vue.component('el-infinite-loader', InfiniteLoader)
Vue.component('el-input', Input)
Vue.component('el-address', Address)
Vue.component('el-table-pagination', TablePagination)
Vue.component('el-icon', Icon)
Vue.component('el-json', Json)
Vue.component('el-checkbox', Checkbox)
Vue.component('el-popup', Popup)
Vue.component('el-switcher', Switcher)
Vue.component('el-datetime', Datetime)
Vue.component('el-upload', Upload)
Vue.component('el-select', Select)
Vue.component('el-textarea', Textarea)
Vue.component('el-input-error', InputError)
Vue.component('el-input-label', InputLabel)
Vue.component('el-photoswipe', PhotoSwipe)
Vue.component('el-accordion', Accordion)
Vue.component('el-table', Table)
Vue.component('el-info-box', InfoBox)
Vue.component('el-slider', Slider)
Vue.component('el-back', Back)
Vue.component('el-search', Search)


Vue.filter('textarea', function (value) {
    if (!value) return ''
    value = value.toString()
    return value.replace(/\n\r?/g, '<br />')
})

Vue.filter('crop', function (value, symbols = 50) {
    return value && value.length && value.length > symbols ? value.substring(0, symbols).concat('...') : value
})


Vue.mixin({
    created: function () {
        const {title} = this.$options
        let pageTitle;

        if (title) pageTitle = typeof title === 'function' ? title.call(this) : title

        if (pageTitle) document.title = pageTitle
    }
})
