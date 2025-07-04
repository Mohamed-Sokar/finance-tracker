import { ref, onMounted, onUnmounted } from "vue";

export const useAutoCounter = (maxTime = 100, duration = 100) => {
  const counter = ref(0);
  let intervalId;

  const start = () => {
    intervalId = setInterval(() => {
      if (counter.value < maxTime) {
        counter.value += 3;
      } else {
        clearInterval(intervalId);
      }
    }, duration);
  };

  onMounted(() => {
    start();
  });

  onUnmounted(() => {
    clearInterval(intervalId);
  });

  return {
    counter,
  };
};
