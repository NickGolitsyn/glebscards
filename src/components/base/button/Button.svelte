<script lang="ts">
  // Define a type for the variant keys
  type ButtonVariant = keyof typeof buttonVariants;
  let className: string | undefined | null = undefined;
  let href: string | undefined = undefined;
  export { className as class, href };
  export let type: "button" | "submit" | "reset" = "button";
  // Ensure that variant is of type ButtonVariant
  export let variant: ButtonVariant = "default";

  const buttonVariants = {
    google:
      "disabled:opacity-50 disabled:pointer-events-none group relative w-full flex justify-center items-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
    outlined:
      "py-2 px-4 rounded-md border border-gray-300 text-black bg-white hover:bg-gray-50 transition duration-200 ease-in-out",
    ghost:
      "relative flex w-full items-center justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100",
    rounded:
      "rounded-full border border-black bg-black p-1.5 px-4 text-sm text-white hover:bg-black/80 transition duration-200 ease-in-out ",
    default:
      "flex justify-center items-center disabled:opacity-30 disabled:pointer-events-none py-2 px-4 rounded-md text-white bg-black hover:bg-black/80 focus:outline-none focus:ring-2 transition duration-200 ease-in-out",
  };

  // This function returns true if 'href' is a non-empty string
  const isLink = (): boolean => typeof href === "string" && href.length > 0;
</script>

{#if isLink()}
  <a
    {...$$restProps}
    {href}
    class="text-center {buttonVariants[variant]} {className}"
    on:click
    {type}
    role="button"
    tabindex="0"
  >
    <slot />
  </a>
{:else}
  <button
    on:click
    {...$$restProps}
    {type}
    class="{buttonVariants[variant]} {className}"
  >
    <slot />
  </button>
{/if}
