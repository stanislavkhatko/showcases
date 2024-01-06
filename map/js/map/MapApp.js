import MapData from "./MapData";

export default class MapApp {
    constructor() {
        this.$html = $('html');

        this.activeState = mapData.queried_object_id

        this.initSimplemapsListeners();
        this.initListeners();
    }

    initSimplemapsListeners() {
        simplemaps_usmap.hooks.ready = () => {
            simplemaps_usmap.mapdata = new MapData();
            simplemaps_usmap.load();
        }

        simplemaps_usmap.hooks.click_state = (id) => {
            this.setActiveState(id);
        };

        simplemaps_usmap.hooks.over_state = function (id) {
        }

        simplemaps_usmap.hooks.out_state = function (id) {
        }

    }

    setActiveState(code) {
    }

    closeActiveState(code) {
    }

    initListeners() {
        $('.change-theme--js').click(() => this.changeThemeListener())
    }

    changeThemeListener() {
        if (this.$html.hasClass('theme-light')) {
            this.$html.removeClass('theme-light').addClass('theme-dark')
        } else {
            this.$html.removeClass('theme-dark').addClass('theme-light')
        }

        simplemaps_usmap.mapdata = new MapData();
    }
}
