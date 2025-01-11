<template>
	<amap-select v-model="address" />

	<p
		:style="{
			marginTop: '10px'
		}"
	>
		{{ address }}
	</p>
</template>

<script setup lang="ts">
import { ref } from "vue";

const address = ref();
</script>
