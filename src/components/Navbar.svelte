<script lang="ts">
  import { onMount } from "svelte";
  let scrolled = false;

  onMount(() => {
    const handleScroll = () => {
      scrolled = window.pageYOffset > 0;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  });
</script>

<div
  class={`fixed top-0 w-full flex justify-center z-30 transition-all ${
    scrolled
      ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
      : "bg-white/0"
  }`}
>
  <div
    class="mx-5 flex h-24 max-w-screen-xl items-center justify-center w-full"
  >
    <a href="/" class="flex items-center font-display text-2xl">
      <img
        src="/glebscards_logo.svg"
        alt="Gleb's cards"
        width="80"
        height="80"
        class="mr-2 rounded-sm"
      />
    </a>
  </div>
</div>
