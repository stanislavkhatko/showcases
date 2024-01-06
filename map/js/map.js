import Vue from "vue";
import Simplebar from 'simplebar-vue';
import "scroll-behavior-polyfill";

Vue.config.productionTip = false;

export default new Vue({
    el: '#page-map',
    components: {
        'simplebar': Simplebar,
    },
    data: {
        $html: null,
        htmlStyles: null,
        activeState: null,
        hoveredState: null,
        activeTheme: '',
        states: null,
        mapData: null,
        hoverToolTip: false,
        sidebarActive: false,
        filterActive: false,
        filter: null,
        windowWidth: window.innerWidth,
        mapMounted: false,
        sidebarStateHovered: false,
        items: ['', 'mmla_participation', 'mtl_exempt', 'state_office__state_presence'],
        origin: {},
    },

    beforeMount() {
        this.$html = document.querySelector('html');
        this.mapData = window.mapData
        this.states = this.mapData.us_states;
        this.activeState = this.states.find((state) => state.id === Number(this.mapData.queried_object_id))

        this.setTheme()
        this.setMap()
        this.origin = window.location.origin;
    },

    computed: {
        topStates() {
            return this.states.filter((state) => state.featured).sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            })
        },

        nonTopStates() {
            return this.states.filter((state) => !state.featured).sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            })
        }
    },
    methods: {

        toggleMainTooltip() {

            let tooltipButton = this.$refs['main-tooltip-button'];
            let tooltipContent = this.$refs['main-tooltip-content'];

            tooltipContent.style.right = this.windowWidth < 400 ? 16 : (this.windowWidth < 678 ? 34 : (this.windowWidth < 1024 ? 112 : '-69px'));

            this.hoverToolTip = !this.hoverToolTip
        },

        setActiveState(state) {
            this.activeState = state;

            this.refreshMap();
        },

        setFilter(data) {
            this.filter = data;
            this.activeState = null;
            this.filterActive = false;
            this.refreshMap()
        },

        setMap() {

            simplemaps_usmap.hooks.ready = () => {
                simplemaps_usmap.mapinfo.initial_view.x = 0;
                simplemaps_usmap.mapinfo.initial_view.y = 0;
                simplemaps_usmap.mapinfo.initial_view.y2 = 650;

                simplemaps_usmap.mapdata = this.setMapData();
                simplemaps_usmap.load();
            }

            simplemaps_usmap.hooks.complete = () => {
                this.mapMounted = true;
            }

            simplemaps_usmap.hooks.click_state = (code) => {
                this.activeState = this.states.find((state) => code === state['code']);
                this.sidebarActive = true;
                this.refreshMap();
            }

            simplemaps_usmap.hooks.over_state = (code) => {
                this.hoveredState = code
            }

            simplemaps_usmap.hooks.out_state = () => {
                this.hoveredState = null;
            }

            simplemaps_usmap.hooks.zoomable_click_state = (code) => {
                this.activeState = this.states.find((state) => code === state['code'])
            }

            simplemaps_usmap.hooks.back = () => {
                this.activeState = null;
            }
        },

        closeActiveState() {
            this.activeState = null;

            this.refreshMap();
        },

        setMapData() {

            for (let [code, mapState] of Object.entries(simplemaps_usmap.mapdata.state_specific)) {
                let state = this.states.find(state => state.code === code);

                simplemaps_usmap.mapdata.state_specific[code] = {
                    description: this.getStatePopupDescription(state, code),
                    color: this.getStateColor(state),
                    name: mapState.name,
                }

                simplemaps_usmap.mapdata.labels[code].color = this.getStateLabelColor(state);


                if (state && state.featured) {
                    simplemaps_usmap.mapdata.labels[code].name = simplemaps_usmap.mapdata.labels[code].pill === 'yes' ? code : code + ' ★';
                }

                if (this.windowWidth < 500) {

                    switch (code) {
                        case 'VT':
                            simplemaps_usmap.mapdata.labels[code].x = 50;
                            simplemaps_usmap.mapdata.labels[code].y = 625;
                            simplemaps_usmap.mapdata.labels[code].size = 26;
                            simplemaps_usmap.mapdata.labels[code].width = 80;
                            break;
                        case 'NH':
                            simplemaps_usmap.mapdata.labels[code].x = 150;
                            simplemaps_usmap.mapdata.labels[code].y = 625;
                            simplemaps_usmap.mapdata.labels[code].size = 26;
                            simplemaps_usmap.mapdata.labels[code].width = 80;
                            break;
                        case 'MA':
                            simplemaps_usmap.mapdata.labels[code].x = 250;
                            simplemaps_usmap.mapdata.labels[code].y = 625;
                            simplemaps_usmap.mapdata.labels[code].size = 26;
                            simplemaps_usmap.mapdata.labels[code].width = 80;
                            break;
                        case 'CT':
                            simplemaps_usmap.mapdata.labels[code].x = 350;
                            simplemaps_usmap.mapdata.labels[code].y = 625;
                            simplemaps_usmap.mapdata.labels[code].size = 26;
                            simplemaps_usmap.mapdata.labels[code].width = 80;
                            break;
                        case 'RI':
                            simplemaps_usmap.mapdata.labels[code].x = 450;
                            simplemaps_usmap.mapdata.labels[code].y = 625;
                            simplemaps_usmap.mapdata.labels[code].size = 26;
                            simplemaps_usmap.mapdata.labels[code].width = 80;
                            break;
                        case 'NJ':
                            simplemaps_usmap.mapdata.labels[code].x = 550;
                            simplemaps_usmap.mapdata.labels[code].y = 625;
                            simplemaps_usmap.mapdata.labels[code].size = 26;
                            simplemaps_usmap.mapdata.labels[code].width = 80;
                            break;
                        case 'DE':
                            simplemaps_usmap.mapdata.labels[code].x = 650;
                            simplemaps_usmap.mapdata.labels[code].y = 625;
                            simplemaps_usmap.mapdata.labels[code].size = 26;
                            simplemaps_usmap.mapdata.labels[code].width = 80;
                            break;
                        case 'MD':
                            simplemaps_usmap.mapdata.labels[code].x = 750;
                            simplemaps_usmap.mapdata.labels[code].y = 625;
                            simplemaps_usmap.mapdata.labels[code].size = 26;
                            simplemaps_usmap.mapdata.labels[code].width = 80;
                            break;
                        case 'DC':
                            simplemaps_usmap.mapdata.labels[code].x = 850;
                            simplemaps_usmap.mapdata.labels[code].y = 625;
                            simplemaps_usmap.mapdata.labels[code].size = 26;
                            simplemaps_usmap.mapdata.labels[code].width = 80;
                            break;
                    }
                }
            }

            simplemaps_usmap.mapdata.main_settings.all_states_zoomable = this.windowWidth < 500 ? 'yes' : 'no';
            simplemaps_usmap.mapdata.main_settings.label_hover_color = this.activeTheme === 'dark' ? '#EEF1F2' : '#134683';
            simplemaps_usmap.mapdata.main_settings.state_hover_color = this.activeTheme === 'dark' ? '#2C76CD' : '#4186D7';
            simplemaps_usmap.mapdata.main_settings.popups = this.windowWidth < 678 ? 'off' : 'hover';
            simplemaps_usmap.mapdata.main_settings.border_color = this.activeTheme === 'dark' ? (this.activeState || this.filter ? '#375170' : '#4A6B9D') : (this.activeState || this.filter ? '#B3CAE7' : '#6794C7');

            return simplemaps_usmap_mapdata;
        },

        setHoverState(code) {
            if (code) {
                this.sidebarStateHovered = true;
                simplemaps_usmap.popup('state', code);
            } else {
                simplemaps_usmap.popup_hide();
                this.sidebarStateHovered = false;
            }

            this.hoveredState = code;
        },

        getStateLabelColor(state) {

            let stateActiveColor = this.activeTheme === 'dark' ? '#A9C1DE' : '#134683';
            let stateDisabledColor = this.activeTheme === 'dark' ? '#375170' : '#B3CAE7';

            if (this.activeState) return (state && state.code === this.activeState.code ? stateActiveColor : stateDisabledColor);

            if (this.filter && this.filter === 'mmla_participation' && state && state.fields.mmla_participation.value.value === 'y') return stateActiveColor

            if (this.filter && this.filter === 'mtl_exempt' && state && state.fields.mtl_exempt.value.value === 'y') return stateActiveColor

            if (this.filter && this.filter === 'state_office__state_presence' && state && state.fields.state_office__state_presence.value) return stateActiveColor

            if (this.filter) return stateDisabledColor;

            if (state && state.featured) return this.activeState ? (this.activeState.code === state.code ? (this.activeTheme === 'dark' ? '#E98B7D' : '#134683') : (this.activeTheme === 'dark' ? '#375170' : '#B3CAE7')) : (this.activeTheme === 'dark' ? '#E98B7D' : '#134683');

            return stateActiveColor;
        },

        getStatePopupDescription(state = null, code) {

            let ranking = state && state.fields.ranking.value ? state.fields.ranking.value : 0;
            let participation = state && state.fields.mmla_participation.value.value === 'y' ? 'Yes' : (state && state.fields.mmla_participation.value.value === 'n' ? 'No' : 'N/a');
            let name = state && state.name ? state.name : simplemaps_usmap.mapdata.state_specific[code].name;
            let featured = state && state.featured ? 'featured' : '';

            return `<div class="popup">
                        <div class="popup-top">
                            <div class="popup-title">${name}<div class="popup-title--code">(${code})</div></div>
                            <div class="popup-star ${featured}">
                                 <svg>
                                    <use xlink:href="${this.mapData.template_url}/img/map-sprite.svg#icon-rate"></use>
                                 </svg>
                            </div>
                        </div>
                        <div class="popup-bottom">
                            <div class="popup-bottom-left">
                                <div class="title">MMLA Participation</div>
                                <div class="text">${participation}</div>
                            </div>
                            
                            <div class="popup-bottom-right">
                                <div class="title">Ranking</div>
                                <div class="text ${featured}">${ranking}/5</div>
                            </div>
                        </div>
                    </div>`;
        },

        textToHtml(text, blank = true) {
            return text && text.replace(/(https?:\/\/[^\s]+)/g, function (url) {
                return '<a href="' + url + '" target="' + (blank ? '_blank' : '_self') + '">' + url + '</a>';
            })
        },

        getStateColor(state = null) {

            let ranking = state && state.fields.ranking.value ? state.fields.ranking.value : 0;
            let color = this.htmlStyles[`--states-color-${this.activeTheme}-${ranking}`];

            if (this.activeState) {
                return this.activeState.code === (state && state.code) ? color : (this.activeTheme === 'dark' ? '#0A1F39' : '#DBE9F7');
            }

            if (this.filter && this.filter === 'mmla_participation' && state && state.fields.mmla_participation.value.value === 'y') return this.htmlStyles[`--states-color-${this.activeTheme}-hover`]

            if (this.filter && this.filter === 'mtl_exempt' && state && state.fields.mtl_exempt.value.value === 'y') return this.htmlStyles[`--states-color-${this.activeTheme}-hover`]

            if (this.filter && this.filter === 'state_office__state_presence' && state && state.fields.state_office__state_presence.value) return this.htmlStyles[`--states-color-${this.activeTheme}-hover`]

            if (this.filter) return this.activeTheme === 'dark' ? '#0A1F39' : '#DBE9F7';

            return color;
        },

        getVariation(value) {
            if (value === 'm') return 'Maybe'
            if (value === 'n') return 'No'
            if (value === 'y') return 'Yes'

            return 'N/a';
        },

        hexToRgba(hex, opacity = 1) {

            let newHex = hex.replace('#', '');
            let r = parseInt(newHex.substring(0, 2), 16);
            let g = parseInt(newHex.substring(2, 4), 16);
            let b = parseInt(newHex.substring(4, 6), 16);

            return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
        },

        setTheme() {
            if (!localStorage.getItem('theme')) {
                this.$html.classList.add('theme-dark')
                this.activeTheme = 'dark';
            } else {
                this.$html.classList.add(localStorage.getItem('theme'))
                this.activeTheme = localStorage.getItem('theme').split('-')[1];
            }

            let styles = getComputedStyle(this.$html);


            this.htmlStyles = {
                '--states-color-dark-hover': styles.getPropertyValue('--states-color-dark-hover'),
                '--states-color-dark-active': styles.getPropertyValue('--states-color-dark-active'),
                '--states-color-dark-disabled': styles.getPropertyValue('--states-color-dark-disabled'),
                '--states-color-dark-disabled-font': styles.getPropertyValue('--states-color-dark-disabled-font'),

                '--states-color-light-hover': styles.getPropertyValue('--states-color-light-hover'),
                '--states-color-light-active': styles.getPropertyValue('--states-color-light-active'),
                '--states-color-light-disabled': styles.getPropertyValue('--states-color-light-disabled'),
                '--states-color-light-disabled-font': styles.getPropertyValue('--states-color-light-disabled-font'),

                '--states-color-dark-0': styles.getPropertyValue('--states-color-dark-0'),
                '--states-color-dark-1': styles.getPropertyValue('--states-color-dark-1'),
                '--states-color-dark-2': styles.getPropertyValue('--states-color-dark-2'),
                '--states-color-dark-3': styles.getPropertyValue('--states-color-dark-3'),
                '--states-color-dark-4': styles.getPropertyValue('--states-color-dark-4'),
                '--states-color-dark-5': styles.getPropertyValue('--states-color-dark-5'),

                '--states-color-light-0': styles.getPropertyValue('--states-color-light-0'),
                '--states-color-light-1': styles.getPropertyValue('--states-color-light-1'),
                '--states-color-light-2': styles.getPropertyValue('--states-color-light-2'),
                '--states-color-light-3': styles.getPropertyValue('--states-color-light-3'),
                '--states-color-light-4': styles.getPropertyValue('--states-color-light-4'),
                '--states-color-light-5': styles.getPropertyValue('--states-color-light-5'),

            }

            window.addEventListener('resize', () => {
                this.windowWidth = window.innerWidth;
            })
        },

        toggleTheme() {
            if (this.$html.classList.contains('theme-light')) {
                this.$html.classList.remove('theme-light')
                this.$html.classList.add('theme-dark')
                this.activeTheme = 'dark';
                localStorage.setItem('theme', 'theme-dark');
            } else {
                this.$html.classList.remove('theme-dark')
                this.$html.classList.add('theme-light')
                this.activeTheme = 'light';
                localStorage.setItem('theme', 'theme-light');
            }

            this.refreshMap()
        },

        refreshMap() {
            simplemaps_usmap.mapdata = this.setMapData();
            simplemaps_usmap.refresh();
        },

        scrollToTop() {
            let el = document.querySelector('.state-top-title');
            if (el) {
                el.scrollIntoView({block: "center", behavior: "smooth"});
            }
        },

        setActiveSideBar() {
            this.sidebarActive = !this.sidebarActive;
        }
    }
})

