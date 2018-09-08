const isLocal = window.location.href.indexOf('local') || false

export default {
    server: (process.env.NODE_ENV === 'development' || isLocal )?  'http://127.0.0.1:9090/' : 'http://www.qiufengh.com:9090/',
}