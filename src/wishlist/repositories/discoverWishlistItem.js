const requestModule = require('request');

const getValueByRegex = (content, regex, group) => {
    let value = '';
    const matches = content.matchAll(new RegExp(regex, 'sg'));

    for (let match of matches) {
        if (match[group]) {
            value = match[group];
        }
    }

    return value;
};

const AMAZON_IMAGE = /colorImages'.*?\"hiRes\".*?\"(.*?)\"/;
const LINK_URL = /<link.*?rel=\"canonical\".*?href=\"(.*?)\"/;
const META_DESCRIPTION = /<meta.*?(n|N)ame=\"description\".*?(c|C)ontent=\"(.*?)\"/;
const META_TITLE = /<meta.*?(n|N)ame=\"title\".*?(c|C)ontent=\"(.*?)\"/;
const OG_DESCRIPTION = /<meta.*?(p|P)roperty=\"og:description\".*?(c|C)ontent=\"(.*?)\"/;
const OG_IMAGE = /<meta.*?(p|P)roperty=\"og:image\".*?(c|C)ontent=\"(.*?)\"/;
const OG_IMAGE_SECURE = /<meta.*?(p|P)roperty=\"og:image:secure\".*?(c|C)ontent=\"(.*?)\"/;
const OG_TITLE = /<meta.*?(p|P)roperty=\"og:title\".*?(c|C)ontent=\"(.*?)\"/;
const OG_URL = /<meta.*?(p|P)roperty=\"og:url\".*?(c|C)ontent=\"(.*?)\"/;
const TAG_TITLE = /<title.*?>(.*?)<\/title>/;

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:97.0) Gecko/20100101 Firefox/97.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:98.0) Gecko/20100101 Firefox/98.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:97.0) Gecko/20100101 Firefox/97.0',
    'Mozilla/5.0 (X11; Linux x86_64; rv:98.0) Gecko/20100101 Firefox/98.0',
    'Mozilla/5.0 (X11; Linux x86_64; rv:97.0) Gecko/20100101 Firefox/97.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.2 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.1 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.50',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.76',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.50',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.76',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 Edg/98.0.1108.50',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 Edg/97.0.1072.76',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 OPR/98.0.1108.51',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 OPR/97.0.1074.69',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 OPR/98.0.1108.51',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 OPR/97.0.1074.69',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.80 Safari/537.36 OPR/98.0.1108.51',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36 OPR/97.0.1074.69',
];

module.exports = ({ url }) => new Promise((resolve, reject) => {
    let message = '';
    if (!url) {
        message = 'required url is missing';
        console.log(message);
        reject(message);
        return;
    }

    const options = {
        url,
        method: 'GET',
        headers: {
            'Accept': 'text/html',
            'Accept-Charset': 'utf-8',
            'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)]
        }
    };

    requestModule.get(options, (error, response, body) => {
        if (error) {
            reject(error);
            return;
        }

        body = body.toString('utf-8');

        const title = getValueByRegex(body, OG_TITLE, 3) || getValueByRegex(body, META_TITLE, 3) || getValueByRegex(body, TAG_TITLE, 1);
        const titleImage = getValueByRegex(body, OG_IMAGE_SECURE, 3) || getValueByRegex(body, OG_IMAGE, 3) || getValueByRegex(body, AMAZON_IMAGE, 1);
        const description = getValueByRegex(body, OG_DESCRIPTION, 3) || getValueByRegex(body, META_DESCRIPTION, 3);
        const urlForResponse = getValueByRegex(body, OG_URL, 3) || getValueByRegex(body, LINK_URL, 1) || url;

        if (title === 'Just a moment...') {
            return {};
        }

        resolve({
            title,
            titleImage,
            description,
            url: urlForResponse
        });
    });
});
