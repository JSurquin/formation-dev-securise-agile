<template>
  <div class="slidev-layout intro grid print:block">
    <LayoutHeader />
    <CornerCurves class="absolute left-0 top-0 transform rotate-90" />
    <div class="flex flex-col justify-center text-center">
      <slot></slot>
    </div>
    <AsGraphic type="zigzag" class="absolute top-20 -right-30" />

    <!-- Logos en bas à gauche avec style adapté pour l'intro -->
    <div class="absolute bottom-8 left-8 flex gap-x-10 items-center gap-6">
      <div class="w-6 h-6">
        <img
          src="/ascent.png"
          alt="Logo Ascent"
          class="rounded-full w-full h-full object-cover"
        />
        <h1 class="!text-base font-bold">Ascent</h1>
      </div>
      <div class="w-24 h-24">
        <img
          src="/minarm.png"
          alt="Logo Ministère des Armées"
          class="rounded-full w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</template>

<style>
.slidev-layout.intro {
  h1 {
    @apply text-6xl leading-20 font-display font-extrabold text-primary;
  }

  h1 + p {
    @apply opacity-60 -mt-4 text-2xl;
  }

  a {
    @apply text-secondary-400 hover:text-secondary-500 dark:(text-white hover:text-gray-200);
  }
}
</style>
