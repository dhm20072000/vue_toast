<script setup lang="ts">
import { type AnimationType, type NotificationType, type Position } from './types';
import { getIcon } from './utils/icons';
import { getBgColor } from './utils/colors';
import { formatConfigToCode, getPosLabel } from './utils/stringUtils';
import { useToastStore } from './stores/toastStore';
import { storeToRefs } from 'pinia';
import { ref, computed, onMounted } from 'vue';
import LivePreview from './components/LivePreview.vue';
import CodeExporter from './components/CodeExporter.vue';
import { useTheme } from './composables/useTheme.ts';

const {isDarkMode, toggleTheme, initTheme} = useTheme();

const store = useToastStore();
const { currentConfig, activeToasts, presets } = storeToRefs(store);
const { updateType, setPersistence, showNotification, removeToast, savePreset, deletePreset, applyPreset } = store;

const isPersistent = ref<boolean>(false);
const presetNameInput = ref<string>('');

const generatedCode = computed<string>(() => formatConfigToCode(currentConfig.value))

const notificationTypes: NotificationType[] = ['success', 'error', 'warning', 'info'];

const positions : Position[] = ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'] as const;

const animations : AnimationType[] = ['fade', 'slide', 'bounce'];

const handleSave = () => {
  if(!presetNameInput.value.trim()) return;

  savePreset(presetNameInput.value);

  presetNameInput.value = '';
};

onMounted(() => {
  initTheme();
});
</script>

<template>
  <div class="builder-container">
    <div class="panel card">
      <h2>Configuration</h2>
      <div class="field">
        <label>Type</label>
        <div class="type-grid">
          <!-- {active: currentConfig.type === t} -->
          <button 
            v-for="t in notificationTypes" 
            :key="t" :class="['type-card', {active: currentConfig.type === t}]" 
            :style="{'--btn-color': getBgColor(t)}"
            @click="updateType(t as NotificationType)"
          >
            <span class="type-icon" v-html="getIcon(t)"></span>
            <span>{{ t.charAt(0).toUpperCase() + t.slice(1) }}</span>
          </button>
        </div>
      </div>

      <!-- Title input -->
      <div class="input-group">
        <label class="input-label">Title</label>
        <input type="text" class="custom-input" placeholder="Enter title..." v-model="currentConfig.title">
      </div>

      <!-- Message textarea -->
      <div class="input-group">
        <label class="input-label">Message</label>
        <textarea class="custom-textarea" placeholder="Enter message..." rows="3" v-model="currentConfig.message"></textarea>
      </div>

      <!-- duration slider -->
      <div class="input-group">
        <div class="duration-header">
          <label class="input-label">Duration</label>
          <span class="duration-value">{{ currentConfig.duration / 1000 }}s</span>
        </div>

        <input 
          v-model="currentConfig.duration" 
          type="range" 
          min="1000" 
          max="10000" 
          step="500" 
          class="custom-slider"
          :disabled="isPersistent"
          :style="{'--slider-color': getBgColor(currentConfig.type)}" 
        />

        <label class="checkbox-container">
          <input type="checkbox" v-model="isPersistent" @change="setPersistence(isPersistent)" />
          <span class="checkbox-label">Persistent (no auto-dismiss)</span>
        </label>
      </div>

      <div class="input-group">
        <label class="input-label">Position</label>
        <div class="position-grid">
          <button 
            v-for="position in positions" 
            :key="position" 
            type="button" 
            @click="currentConfig.position = position"
            :class="['pos-card', {active: currentConfig.position === position}]"
          >
            {{ getPosLabel(position) }}
          </button>
        </div>
      </div>

      <div class="section-title">Style</div>
      <div class="style-grid">
        <div class="color-field">
          <label>Background</label>
          <div class="color-input-wrapper">
            <input type="color" class="color-picker" v-model="currentConfig.backgroundColor" />
            <input type="text" class="color-text" v-model="currentConfig.backgroundColor" />
          </div>
        </div>

        <div class="color-field">
          <label>Text Color</label>
          <div class="color-input-wrapper">
            <input type="color" class="color-picker" v-model="currentConfig.textColor" />
            <input type="text" class="color-text" v-model="currentConfig.textColor" />
          </div>
        </div>
      </div>

      <div class="section-title">Options</div>
      <div class="options-flex">
        <label class="checkbox-wrapper">
          <input type="checkbox" v-model="currentConfig.showIcon" />
          <span>Show Icon</span>
        </label>

        <label class="checkbox-wrapper">
          <input type="checkbox" v-model="currentConfig.showCloseButton" />
          <span>Show Close Button</span>
        </label>
      </div>

      <div class="section-title">Animation</div>
      <div class="animation-grid">
        <button 
          v-for="anim in animations" 
          :key="anim" 
          :class="['anim-btn', {active: currentConfig.animation === anim}]"
          @click="currentConfig.animation = anim"
        >
          {{ anim.charAt(0).toUpperCase() + anim.slice(1) }}
        </button>
      </div>

    </div>
    <!-- {{ currentConfig }} -->
    <div class="management-area">
      <div class="panel">
        <LivePreview 
          :active-toasts="activeToasts" 
          :current-config="currentConfig" 
          @close="removeToast"  
        />
        <button class="main-trigger-button" @click="showNotification">Show Notification</button>

        <div class="card preset-card">
          <h3>Saved Presets</h3>
          
          <div class="presets-list">
            <div 
              v-for="p in presets"
              :key="p.id"
              class="preset-item"  
              @click="applyPreset(p.config)"
            >
              <div class="preset-info" @click="Object.assign(currentConfig, p.config)">
                <span class="preset-dot" :style="{background: p.config.backgroundColor}"></span>
                <span class="preset-name">{{ p.name }}</span>
              </div>

              <button class="btn-delete" @click="deletePreset(p.id)">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>

            <div v-if="presets.length === 0" class="empty-list">No presets yet.</div>
          </div>

          <div class="preset-input-group">
            <input 
              type="text" p
              laceholder="Preset name..." 
              class="preset-field" 
              v-model="presetNameInput" 
              @keyup.enter.prevent="handleSave"
            />
            <button @click.prevent="handleSave" class="btn-save">Save</button>
          </div>
        </div>

        <div class="">
          <CodeExporter :code="generatedCode" />
        </div>
      </div>
    </div>

    <button @click="toggleTheme" class="theme-toggle-btn">
      <span v-if="isDarkMode">☀️ Light Mode</span>
      <span v-else>🌙 Dark Mode</span>
    </button>
  </div>
</template>
