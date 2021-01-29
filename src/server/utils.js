import https from 'https';


//////////////////////////////////////////////
//  UTILS
//////////////////////////////////////////////


export function adjust(url, location) {
    // Absolute link.
    if (/^https?:\/{2}/.test(location))
        return location;

    const host = /^(https?:\/\/.+?)(\/.*)?$/.exec(url)[1];

    // Relative link.
    return host + location;
}

export function querystring(query) {
    return Object.entries(query)
        .map(([k, v]) => (k + '=' + encodeURIComponent(v)))
        .join('&');
}

export function fetch(method, url, extra = {}) {
    return new Promise((resolve, reject) => {
        const options = {
            method,
            timeout: 5000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.104 Safari/537.36',
                ...extra.headers
            }
        };

        if (extra.query)
            url += '?' + querystring(extra.query);

        if (extra.cookies)
            options.headers['cookie'] = extra.cookies.join(' ');

        if (extra.form) {
            options.headers['content-type'] = 'application/x-www-form-urlencoded';
            extra.body = querystring(extra.form);

        } else if (extra.json) {
            options.headers['content-type'] = 'application/json';
            extra.body = JSON.stringify(extra.json);
        }

        let req = https.request(url, options, res => {

            //  COOKIE

            if (extra.cookies && res.headers['set-cookie'])
                for (let cookie of res.headers['set-cookie'])
                    extra.cookies.push(/^(.+?;)/.exec(cookie)[1]);


            //  REDIRECT

            if (res.statusCode == 302 || res.statusCode == 301) {
                res.headers.location = adjust(url, res.headers.location);
                res.destroy();
                return extra.follow
                    ? fetch(method, res.headers.location, extra)
                        .then(resolve)
                        .catch(reject)
                    : resolve(res);
            }


            //  URI

            res.uri = url;


            //  STREAM

            if (extra.stream)
                return resolve(res);


            //  BUFFER

            let body = Buffer.alloc(0);
            res.raw = () => body;
            res.text = () => body.toString('utf8');
            res.json = () => JSON.parse(body.toString('utf8'));


            //  EVENTS

            res.on('data', chunk => {
                body = Buffer.concat([body, chunk])
            });

            res.on('end', () => {
                res.statusCode >= 200 && res.statusCode <= 299
                    ? resolve(res)
                    : reject({
                        code: res.statusCode,
                        error: res.headers['content-type'] == 'application/json'
                            ? res.json()
                            : res.text()
                    });
            });
        });

        req.on('error', ({ code, error }) => reject({ code, error }));
        req.end(extra.body);
    });
}


//////////////////////////////////////////////
//  EXTENDS
//////////////////////////////////////////////


Array.prototype.remove = function (e) {
    this.splice(this.indexOf(e), 1);
};