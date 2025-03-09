# Monk Mode

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup(If you plan on running it on the web/localhost)

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Project Setup(If you plan on running it on an android device emulated or physical)

```sh
npm install
```

### Compile and Minify for Production

```sh
npm run build
```

### Compile and Hot-Reload for Development

```sh
npx cap run android
N/B: You need adb, an android emulator installed, gradle and JDK. You can also use your phone. Enable USB debugging in developer options
You cannot hot reload so after you make any changes, run 'npm run build' then re-run 'npx cap run android'
```

