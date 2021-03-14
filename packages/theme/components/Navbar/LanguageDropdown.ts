import Vue from "vue";
import DropdownLink from "@theme/components/Navbar/DropdownLink.vue";
import NavLink from "@theme/components/Navbar/NavLink.vue";
import { getNavLinkItem } from "@theme/util/navbar";

import type { VNode } from "vue";
import type VueRouter from "vue-router";
import type { RouterOptions } from "vue-router";
import type { NavBarConfigItem as ResovledNavbarConfigItem } from "@theme/util/navbar";

export default Vue.extend({
  name: "LanguageDropdown",

  components: { NavLink, DropdownLink },

  computed: {
    dropdown(): ResovledNavbarConfigItem | false {
      const { locales } = this.$site;

      if (locales && Object.keys(locales).length > 1) {
        const currentLink = this.$page.path;
        const { routes } = ((this.$router as unknown) as VueRouter & {
          options: RouterOptions;
        }).options;
        const themeLocales = this.$themeConfig.locales || {};
        const languageDropdown = {
          text: this.$themeLocaleConfig.selectText || "Languages",
          ariaLabel: this.$themeLocaleConfig.ariaLabel || "Select language",
          items: Object.keys(locales).map((path) => {
            const locale = locales[path];
            const text =
              (themeLocales[path] && themeLocales[path].label) ||
              locale.lang ||
              "Unknown Language";
            let link: string;

            // Stay on the current page
            if (locale.lang === this.$lang) link = currentLink;
            else {
              // Try to stay on the same page
              link = currentLink.replace(this.$localeConfig.path, path);
              // Fallback to homepage
              if (!(routes || []).some((route) => route.path === link))
                link = path;
            }

            return { text, link };
          }),
        };

        return getNavLinkItem(languageDropdown);
      }

      return false;
    },
  },

  render(h): VNode {
    return this.dropdown
      ? h("div", { class: "nav-item" }, [
          h(DropdownLink, { props: { item: this.dropdown } }),
        ])
      : ((null as unknown) as VNode);
  },
});
