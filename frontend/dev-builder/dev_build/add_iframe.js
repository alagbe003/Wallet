const iframe = document.createElement('iframe')
iframe.allow = 'hid'
iframe.src = '/index.html' + window.location.search
document.body.appendChild(iframe)
