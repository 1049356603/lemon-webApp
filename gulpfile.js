var gulp = require("gulp");
var sass = require("gulp-sass");
var webserver = require("gulp-webserver");

gulp.task("sass", function() {
    return gulp.src(["./scss/*.scss", "!./scss/common.scss"])
        .pipe(sass())
        .pipe(gulp.dest("./css/"))
})

gulp.task("webserver", function() {
    return gulp.src("./")
        .pipe(webserver({
            loca: "localhost",
            port: "8080",
            liverelive: true,
            open: true,
            proxies: [
                { source: "/bill/bill", target: "http://localhost:3000/bill/billGet" },
                { source: "/classify/classifyget", target: "http://localhost:3000/classify/classifyGet" },
                { source: "/bill/billAdd", target: "http://localhost:3000/bill/billAdd" },
                { source: "/bill/billDelete", target: "http://localhost:3000/bill/billDelete" }

            ]
        }))
})

gulp.task("watch", function() {
    return gulp.watch(["./scss/*.scss", "!./scss/common.scss"], gulp.series("sass"));

})

gulp.task("default", gulp.series("sass", "webserver", "watch"));