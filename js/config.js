require.config({
    paths: {
        "mui": "./libs/mui.min",
        "bscroll": "./libs/better-scroll",
        "removeItem": "./removeItem",
        "muipicker": "./libs/mui.picker.min"


    },
    shim: {
        "muipicker": { deps: ["mui"] }

    }
})