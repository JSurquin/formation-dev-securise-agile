<!-- global-top.vue -->

<template>
  <!-- SharpLongCode retiré car addon manquant -->
  <footer
    v-if="$slidev.themeConfigs.eventLogo || $slidev.themeConfigs.twitter"
    class="absolute bottom-0 p-4 w-full justify-between mt-auto flex items-center w-full text-primary dark:text-white z-10"
  >
    <div>
      <a
        v-if="$slidev.themeConfigs.twitter"
        :href="$slidev.themeConfigs.twitterUrl"
        target="_blank"
      >
        <logos-linkedin />{{ $slidev.themeConfigs.twitter }}
      </a>
    </div>
  </footer>
</template>
