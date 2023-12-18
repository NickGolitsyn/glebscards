<script lang="ts">
  let accordions = [
    { title: 'Question 1', content: 'Accordion Content 1', isOpen: false },
    { title: 'Question 2', content: 'Accordion Content 2', isOpen: false },
    { title: 'Question 3', content: 'Accordion Content 3', isOpen: false },
  ];

  function toggleAccordion(index: number) {
    accordions = accordions.map((accordion, i) => ({
      ...accordion,
      isOpen: i === index ? !accordion.isOpen : accordion.isOpen
    }));
  }
</script>

<div class="max-w-lg w-[90vw] m-auto flex flex-col gap-5 mb-10 mt-36">
	<h1 class="font-bold text-black select-none text-2xl">Frequently asked questions</h1>
	{#each accordions as accordion, index (accordion.title)}
		<div class="w-full">
			<div class="border-b border-gray-300">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div class="flex justify-between items-center py-3 cursor-pointer select-none" on:click={() => toggleAccordion(index)}>
					<div class="font-bold text-black select-none text-lg">{accordion.title}</div>
					{#if accordion.isOpen}
						<div class="text-2xl">&#8722;</div> <!-- Minus sign -->
					{:else}
						<div class="text-2xl">&#43;</div> <!-- Plus sign -->
					{/if}
				</div>
				<div class="{`overflow-hidden transition-all max-h-${accordion.isOpen ? 'full' : '0'} duration-300`}">
					<div class="py-3 text-gray-500">
						{accordion.content}
					</div>
				</div>
			</div>
		</div>
	{/each}
	<div class="h-[1000px]"></div>
</div>