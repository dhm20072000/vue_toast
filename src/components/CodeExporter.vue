<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  code: string
}>();

const copied = ref<boolean>(false);

const handleCopy = () => {
  navigator.clipboard.writeText(props.code).then(() => {
    copied.value = true;

    setTimeout(() => copied.value = false, 2000);
  });
};
</script>

<template>
  <div class="card code-export">
    <h3>Code Export</h3>
    <pre><code>{{ props.code }}</code></pre>
    <button @click="handleCopy" class="copy-btn-v2">
      <span class="icon-clipboard">&#128203;</span>
      {{ copied ? 'Copied!' : 'Copy to Clipboard' }}
    </button>
  </div>
</template>