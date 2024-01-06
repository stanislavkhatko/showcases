export default {
    methods: {
        loadScript: function (apiUrl) {
            return new Promise((resolve) => {
                let script = document.createElement('script');
                script.src = apiUrl;
                script.onreadystatechange = script.onload = function () {
                    if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                        setTimeout(function () {
                            resolve();
                        }, 500);
                    }
                };
                document.getElementsByTagName('head')[0].appendChild(script);
            });
        }
    }
}