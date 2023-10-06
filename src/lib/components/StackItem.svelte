<script lang="ts">
  export let color_small: string | undefined = 'gray';
  export let color_medium: string | undefined = 'gray';
  export let color_large: string | undefined = 'gray';
</script>

<button class="container" on:click>
  <div class="circle circle_inner" style="--color:{color_small ?? 'gray'};" />
  <div class="circle circle_middle" style="--color:{color_medium ?? 'gray'};" />
  <div class="circle" style="--color:{color_large ?? 'gray'};" />
</button>

<style>
  button {
    position: relative;
  }

  button div {
    position: absolute;
  }

  button {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
  }

  button:hover {
    outline: 0.2rem solid blueviolet;
    border-radius: 20px;
    cursor: pointer;
  }

  .container {
    height: 100%;
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .circle {
    margin: 0 auto;
    height: 100%;
    border-radius: 50%;
    margin: 0 auto;

    aspect-ratio: 1 / 1;

    box-shadow: inset 0px 0px 0px 0.5em var(--color);
  }

  .circle_middle {
    height: 65%;
  }

  .circle_inner {
    height: 30%;
  }
</style>
