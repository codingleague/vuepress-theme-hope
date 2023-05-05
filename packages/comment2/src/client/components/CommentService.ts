import { usePageFrontmatter } from "@vuepress/client";
import { type VNode, computed, defineComponent, h } from "vue";
import CommentProvider from "vuepress-plugin-comment2/provider";

import { type CommentPluginFrontmatter } from "../../shared/index.js";
import { useCommentOptions } from "../composables/index.js";

export default defineComponent({
  name: "CommentService",

  props: {
    /**
     * Whether the component is in darkmode
     *
     * 组件是否处于夜间模式
     */
    darkmode: Boolean,
  },

  setup(props) {
    const commentOptions = useCommentOptions();
    const frontmatter = usePageFrontmatter<CommentPluginFrontmatter>();

    const enableComment = commentOptions.comment !== false;

    const enabled = computed(() => {
      return (
        frontmatter.value.comment ||
        (enableComment && frontmatter.value.comment !== false)
      );
    });

    return (): VNode | null =>
      h(CommentProvider, {
        darkmode: props.darkmode,
        style: { display: enabled.value ? "block" : "none" },
      });
  },
});
