<template>
  <div class="auth-wrapper">
    <SignedOut>
      <div class="auth-container">
        <h1>Formation Docker</h1>
        <p>Veuillez vous connecter pour accéder à la formation</p>
        <SignInButton mode="modal" />
      </div>
    </SignedOut>
    <SignedIn>
      <slot />
    </SignedIn>
  </div>
</template>

<script setup lang="ts">
import { SignedIn, SignedOut, SignInButton } from "@clerk/vue";
</script>

<style>
.auth-wrapper {
  height: 100vh;
  width: 100vw;
}

.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
  text-align: center;
  padding: 2rem;
}
</style>
