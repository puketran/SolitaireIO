self.addEventListener("fetch", event => {
    // This is a dummy event listener
    // just to pass the PWA installation criteria on 
    // some browsers
});

self.addEventListener("install", function (e) {
    console.log("install", e);
});