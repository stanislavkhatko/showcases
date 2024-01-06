<main class="page-map" id="page-map" :class="{'loaded': mapMounted, 'sidebar-hovered': sidebarStateHovered}">

    <header class="header">
        <a href="/" class="header-logo">
            <svg>
                <use xlink:href="<?php echo get_template_directory_uri() . '/img/map-sprite.svg#map-logo' ?>"></use>
            </svg>
        </a>

        <div class="header-title">
            <div>
                Crypto-Friendliness in usa
            </div>

            <div class="header-title-tooltip"
                 @mouseover="hoverToolTip = true"
                 @mouseleave="hoverToolTip = false" @click="hoverToolTip = !hoverToolTip">
                <svg>
                    <use xlink:href="<?php echo get_template_directory_uri() . '/img/map-sprite.svg#icon-info' ?>"></use>
                </svg>
                <transition name="fade-tooltip">
                    <div class="header-title-tooltip--active" v-if="hoverToolTip">
                        <?php the_field('us_map_tooltip', 'option') ?>
                    </div>
                </transition>
            </div>

        </div>

        <a class="header--consultation" :href="mapData.url__booking_button.url" :target="mapData.url__booking_button.target">
            {{ mapData.url__booking_button.title }}
        </a>

    </header>

    <div class="main">
        <simplebar class="main-sidebar" :class="{ 'active' : sidebarActive }" data-simplebar-auto-hide="false">
            <div class="main-sidebar-laptop" @click='setActiveSideBar'>
                <div class="title">
                    states list
                </div>

                <svg>
                    <use xlink:href="<?php echo get_template_directory_uri() . '/img/map-sprite.svg#icon-up-chevron' ?>"></use>
                </svg>
            </div>

            <div class="main-sidebar-states" v-show="!activeState">
                <div class="top-states" v-if="topStates.length">
                    <div class="top-states-title-inner">
                        <div class="top-states--title">Top {{ topStates.length }} states</div>
                        <div class="top-states--close" @click="sidebarActive = !sidebarActive">
                            <svg>
                                <use xlink:href="<?php echo get_template_directory_uri() . '/img/map-sprite.svg#icon-close' ?>"></use>
                            </svg>
                        </div>
                    </div>

                    <div class="top-states-item" :class="{'hovered': hoveredState === state.code.toUpperCase()}"
                         v-for="state in topStates"
                         :key="state.id" @click="setActiveState(state)"
                         @mouseover="setHoverState(state.code)" @mouseleave="setHoverState(null)">
                        <div class="top-states-inner">
                            <div class="item-rate">
                                <svg>
                                    <use xlink:href="<?php echo get_template_directory_uri() . '/img/map-sprite.svg#icon-rate' ?>"></use>
                                </svg>
                            </div>
                            <div class="item-name">
                                {{ state.name }}
                                <div class="item-name--code">
                                    ({{ state.code }})
                                </div>
                            </div>
                            <div class="item-participation">
                                <div class="item-participation--title">
                                    {{ state.fields.mmla_participation.label }}
                                </div>
                                <div class="item-participation--value">
                                    {{ getVariation(state.fields.mmla_participation.value.value) }}
                                </div>
                            </div>
                            <div class="item-ranking">
                                <div class="item-ranking--title">
                                    {{ state.fields.ranking.label }}
                                </div>
                                <div class="item-ranking--value">
                                    {{ state.fields.ranking.value || 0 }}/5
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="other-states">
                    <div class="other-states-item" :class="{'hovered': hoveredState === state.code.toUpperCase()}"
                         v-for="state in nonTopStates" :key="state.id" @click="setActiveState(state)"
                         @mouseover="setHoverState(state.code)" @mouseleave="setHoverState(null)">
                        <div class="other-states-item-inner">
                            <div class="item-name">
                                {{ state.name }}
                                <div class="item-name--code">
                                    ({{ state.code }})
                                </div>
                            </div>

                            <div class="item-participation">
                                <div class="item-participation--title">
                                    {{ state.fields.mmla_participation.label }}
                                </div>
                                <div class="item-participation--value">
                                    {{ getVariation(state.fields.mmla_participation.value.value) }}
                                </div>
                            </div>

                            <div class="item-ranking">
                                <div class="item-ranking--title">
                                    {{ state.fields.ranking.label }}
                                </div>
                                <div class="item-ranking--value">
                                    {{ state.fields.ranking.value || 0 }}/5
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <transition name="fade-sidebar">
                <div class="main-sidebar-state" v-if="activeState">

                    <div class="state-top">
                        <div class="state-top-block">
                            <div class="state-top-title">
                                {{ activeState.name }}

                                <span class="state-top-title--code" v-if="activeState.code">
                                    ({{ activeState.code.toUpperCase() }})
                                </span>
                            </div>

                            <div class="state-top-close" @click="closeActiveState">
                                <svg>
                                    <use xlink:href="<?php echo get_template_directory_uri() . '/img/map-sprite.svg#icon-close' ?>"></use>
                                </svg>
                            </div>
                        </div>

                        <div class="state-top-block--text">
                            Want to learn more about law in {{ activeState.name }}?
                        </div>

                        <a class="state-top-block--link" :href="mapData.url__booking_button.url" :target="mapData.url__booking_button.target">
                            Book free consultation now
                        </a>

                    </div>

                    <div class="state-middle">
                        <template
                                v-if="activeState.fields.state_mtl_license_fees.value.application_fee || activeState.fields.state_mtl_license_fees.value.annual_fee || activeState.fields.state_mtl_license_fees.value.other_fees">
                            <div class="title">
                                <b>{{ activeState.fields.state_mtl_license_fees.label }}</b>
                            </div>

                            <p v-if="activeState.fields.state_mtl_license_fees.value.application_fee"><b>{{ activeState.fields.state_mtl_license_fees.sub_fields.application_fee.label }}</b>
                                {{ activeState.fields.state_mtl_license_fees.value.application_fee }}</p>
                            <p v-if="activeState.fields.state_mtl_license_fees.value.annual_fee"><b>{{ activeState.fields.state_mtl_license_fees.sub_fields.annual_fee.label }}</b> {{
                                activeState.fields.state_mtl_license_fees.value.annual_fee }}</p>
                            <p v-if="activeState.fields.state_mtl_license_fees.value.other_fees"><b>{{ activeState.fields.state_mtl_license_fees.sub_fields.other_fees.label }}</b> {{
                                activeState.fields.state_mtl_license_fees.value.other_fees }}</p>
                        </template>

                        <div class="title" v-if="activeState.fields.population.value">
                            <b>{{ activeState.fields.population.label }}</b>
                            {{ activeState.fields.population.value }}
                        </div>

                        <div class="title" v-if="activeState.fields.mtl_exempt.value.value">
                            <b>{{ activeState.fields.mtl_exempt.label }}</b>
                            {{ getVariation(activeState.fields.mtl_exempt.value.value) }}
                        </div>
                        <p v-if="activeState.fields.mtl_exempt.value.description">{{
                            activeState.fields.mtl_exempt.value.description }}</p>

                        <template v-if="activeState.fields.link_to_msb_application.value">
                            <div class="title"><b>{{ activeState.fields.link_to_msb_application.label }}</b></div>
                            <p><span v-for="link in activeState.fields.link_to_msb_application.value"
                                     v-html="textToHtml(link.url) + '<br>'"></span></p>
                        </template>

                        <template v-if="activeState.fields.ranking.value || activeState.fields.ranking_reasoning.value">
                            <div class="title">
                                <b>{{ activeState.fields.ranking.label }} </b>
                                <span v-if="activeState.fields.ranking.value">{{ activeState.fields.ranking.value || 0 }}/5</span>
                            </div>
                            <p v-html="textToHtml(activeState.fields.ranking_reasoning.value)"></p>
                        </template>

                        <template v-if="activeState.fields.more_onerous_rules.value">
                            <div class="title"><b>{{ activeState.fields.more_onerous_rules.label }}</b></div>
                            <p v-html="textToHtml(activeState.fields.more_onerous_rules.value)"></p>
                        </template>

                        <template v-if="activeState.fields.other_state_action_on_crypto_msb_rules.value">
                            <div class="title"><b>{{ activeState.fields.other_state_action_on_crypto_msb_rules.label
                                    }}</b></div>
                            <p v-html="textToHtml(activeState.fields.other_state_action_on_crypto_msb_rules.value)"></p>
                        </template>

                        <template v-if="activeState.fields['other_pro-crypto_state_actions__laws'].value">
                            <div class="title"><b>{{ activeState.fields['other_pro-crypto_state_actions__laws'].label
                                    }}</b></div>
                            <p v-html="textToHtml(activeState.fields['other_pro-crypto_state_actions__laws'].value)"></p>
                        </template>

                        <template
                                v-if="activeState.fields['more_onerous_aspects'].value || activeState.fields['less_onerous_aspects'].value">
                            <div class="title">Regular MSB Rules</div>
                            <p><b>{{ activeState.fields['less_onerous_aspects'].label }}</b>{{
                                textToHtml(activeState.fields['less_onerous_aspects'].value) }}</p>
                            <p><b>{{ activeState.fields['more_onerous_aspects'].lable }}</b>{{
                                textToHtml(activeState.fields['more_onerous_aspects'].value) }}</p>
                        </template>

                        <template
                                v-if="activeState.fields['state_bonding_or_surety_requirements'].amount || activeState.fields['state_bonding_or_surety_requirements'].other_rules">
                            <div class="title"><b>{{ activeState.fields['state_bonding_or_surety_requirements'].label
                                    }}</b></div>
                            <p v-html="textToHtml(activeState.fields['state_bonding_or_surety_requirements'].amount)"></p>
                            <p v-html="textToHtml(activeState.fields['state_bonding_or_surety_requirements'].other_rules)"></p>
                        </template>

                        <template
                                v-if="activeState.fields['mmla_participation'].value.value || activeState.fields['mmla_participation']['description']">
                            <div class="title"><b>{{ activeState.fields['mmla_participation'].label }}</b> {{
                                getVariation(activeState.fields['mmla_participation'].value.value) }}
                            </div>
                            <p v-text="textToHtml(activeState.fields['mmla_participation']['description'])"></p>
                        </template>

                        <template
                                v-if="activeState.fields['net_worth__capitalization_req'].sub_fields.net_worth_amount.value || activeState.fields['net_worth__capitalization_req'].sub_fields.capitalization_amount.value || activeState.fields['net_worth__capitalization_req'].sub_fields.other_rules_for_nwcap.value">
                            <div class="title"><b>{{ activeState.fields['net_worth__capitalization_req'].label }}</b>
                            </div>
                            <p><b>{{
                                    activeState.fields['net_worth__capitalization_req'].sub_fields.net_worth_amount.label
                                    }}</b>{{
                                activeState.fields['net_worth__capitalization_req'].sub_fields.net_worth_amount.value }}
                            </p>
                            <p><b>{{
                                    activeState.fields['net_worth__capitalization_req'].sub_fields.capitalization_amount.label
                                    }}</b>{{
                                activeState.fields['net_worth__capitalization_req'].sub_fields.capitalization_amount.value
                                }}</p>
                            <p><b>{{
                                    activeState.fields['net_worth__capitalization_req'].sub_fields.other_rules_for_nwcap.label
                                    }}</b>{{
                                activeState.fields['net_worth__capitalization_req'].sub_fields.other_rules_for_nwcap.value
                                }}</p>
                        </template>

                        <div class="title" v-if="activeState.fields.renewal_period.value"><b>{{
                                activeState.fields.renewal_period.label }}</b> {{
                            activeState.fields.renewal_period.value }}
                        </div>

                        <div class="title" v-if="activeState.fields['state_office__state_presence'].value"><b>{{
                                activeState.fields['state_office__state_presence'].label }}</b> {{
                            activeState.fields['state_office__state_presence'].value }}
                        </div>

                        <template v-if="activeState.fields['audited_financials'].value">
                            <div class="title"><b>{{ activeState.fields['audited_financials'].label }}</b></div>
                            <p>{{ activeState.fields['audited_financials'].value }}</p>
                        </template>

                        <template v-if="activeState.fields['other_important_msb_rules'].value">
                            <div class="title"><b>{{ activeState.fields['other_important_msb_rules'].label }}</b></div>
                            <p>{{ activeState.fields['other_important_msb_rules'].value }}</p>
                        </template>

                        <template v-if="activeState.fields['other_crypto_friendly_state_features'].value">
                            <div class="title"><b>{{ activeState.fields['other_crypto_friendly_state_features'].label
                                    }}</b>
                            </div>
                            <p>{{ activeState.fields['other_crypto_friendly_state_features'].value }}</p>
                        </template>
                    </div>

                    <div class="state-bottom">
                        <div class="state-bottom--text">Want to learn more?</div>

                        <div class="state-bottom-block">
                            <a class="state-bottom-block--link" :href="mapData.url__booking_button.url" :target="mapData.url__booking_button.target">
                                Book free consultation now
                            </a>

                            <div class="state-bottom-block-up" @click="scrollToTop">
                                <svg>
                                    <use xlink:href="<?php echo get_template_directory_uri() . '/img/map-sprite.svg#icon-up' ?>"></use>
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>
            </transition>
        </simplebar>

        <simplebar class="main-content" data-simplebar-auto-hide="false">
            <div class="main-content-top">
                <div class="mode-btn" @click="toggleTheme">
                    <svg v-if="activeTheme === 'light'">
                        <use xlink:href="<?php echo get_template_directory_uri() . '/img/map-sprite.svg#icon-mode' ?>"></use>
                    </svg>
                    <svg v-if="activeTheme === 'dark'">
                        <use xlink:href="<?php echo get_template_directory_uri() . '/img/map-sprite.svg#icon-mode-light' ?>"></use>
                    </svg>
                </div>

                <div class="main-content-top-title">
                    <div class="title">
                        Crypto-Friendliness in usa
                        <div class="title-tooltip">
                            <svg @click="toggleMainTooltip" ref="main-tooltip-button">
                                <use xlink:href="<?php echo get_template_directory_uri() . '/img/map-sprite.svg#icon-info' ?>"></use>
                            </svg>

                            <transition name="fade-tooltip">
                                <div class="title-tooltip--active" v-show="hoverToolTip" ref="main-tooltip-content">
                                    <?php the_field('us_map_tooltip', 'option') ?>

                                    <div class="title-tooltip-close" @click="toggleMainTooltip">
                                        <svg>
                                            <use xlink:href="<?php echo get_template_directory_uri() . '/img/map-sprite.svg#icon-close-simple' ?>"></use>
                                        </svg>
                                    </div>
                                </div>
                            </transition>
                        </div>

                    </div>

                </div>

                <div class="main-content-top-filter">
                    <transition-group name="slide-in" :style="{ '--total': items.length }" :class="{ active: filterActive}">
                        <div class="item" v-for="item, index in items"
                             :key="item" :style="{'--i': (items.length - index)}"
                             @click="setFilter(item)"
                             :class="{ active: filter === item }"
                             v-if="filterActive">
                            <div class="item--value" v-if="!item">
                                All
                            </div>

                            <div class="item--value" v-if="item === 'state_office__state_presence'">
                                Office / Presence not required
                            </div>

                            <div class="item--value" v-if="item === 'mmla_participation'">
                                With MMLA
                            </div>

                            <div class="item--value" v-if="item === 'mtl_exempt'">
                                With MTL
                            </div>
                        </div>
                    </transition-group>

                    <svg @click="filterActive = !filterActive" v-if="!filterActive">
                        <use xlink:href="<?php echo get_template_directory_uri() . '/img/map-sprite.svg#icon-filter' ?>"></use>
                    </svg>

                    <svg @click="filterActive = !filterActive" v-else>
                        <use xlink:href="<?php echo get_template_directory_uri() . '/img/map-sprite.svg#icon-close' ?>"></use>
                    </svg>
<!--                    :key="item" :style="{'--i': (items.length - index)}"-->

<!--                    <transition name="fade-filter">-->
<!--                        <div class="filter" v-if="filterActive">-->
<!--                            <div class="filter--item" @click="setFilter(null)"-->
<!--                                 :class="{ active: filter === null }">-->
<!--                                <span>-->
<!--                                    All-->
<!--                                </span>-->
<!--                            </div>-->
<!---->
<!--                            <div class="filter--item" @click="setFilter('mmla_participation')"-->
<!--                                 :class="{ active: filter === 'mmla_participation' }">-->
<!--                            <span>-->
<!--                                Office / Presence not required -->
<!--                            </span>-->
<!--                            </div>-->
<!---->
<!--                            <div class="filter--item" @click="setFilter('mtl_exempt')"-->
<!--                                 :class="{ active: filter === 'mtl_exempt' }">-->
<!--                            <span>-->
<!--                                With MMLA-->
<!--                            </span>-->
<!--                            </div>-->
<!---->
<!--                            <div class="filter--item" @click="setFilter('state_office__state_presence')"-->
<!--                                 :class="{ active: filter === 'state_office__state_presence' }">-->
<!--                                <span>-->
<!--                                    With MTL-->
<!--                                </span>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                    </transition>-->

                </div>
            </div>

            <div class="main-content-middle">
                <div id="map"></div>
            </div>

            <div class="main-content-bottom">
                <div class="main-content-bottom-info">
                    <div class="update">
                        <svg>
                            <use xlink:href="<?php echo get_template_directory_uri() . '/img/map-sprite.svg#icon-update' ?>"></use>
                        </svg>
                        Latest updated: {{ mapData.latest_updated }}
                    </div>

                    <div class="scale">
                        <div class="scale--color">5<span
                                    :style="{'background': htmlStyles[`--states-color-${activeTheme}-${5}`]}"></span>
                        </div>
                        <div class="scale--color">4<span
                                    :style="{'background': htmlStyles[`--states-color-${activeTheme}-${4}`]}"></span>
                        </div>
                        <div class="scale--color">3<span
                                    :style="{'background': htmlStyles[`--states-color-${activeTheme}-${3}`]}"></span>
                        </div>
                        <div class="scale--color">2<span
                                    :style="{'background': htmlStyles[`--states-color-${activeTheme}-${2}`]}"></span>
                        </div>
                        <div class="scale--color">1<span
                                    :style="{'background': htmlStyles[`--states-color-${activeTheme}-${1}`]}"></span>
                        </div>
                        <div class="scale--color">0<span
                                    :style="{'background': htmlStyles[`--states-color-${activeTheme}-${0}`]}"></span>
                        </div>
                    </div>
                </div>

                <div class="main-content-bottom-designed">Made by
                    <a href="https://stanislavkhatko.github.io/" target="_blank">
                        Stanislav Khatko
                    </a>
                </div>
            </div>
        </simplebar>
    </div>

</main>
