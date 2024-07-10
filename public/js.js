const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get('video');

const getVidSrc = document.getElementById('vid-src');
getVidSrc.src += myParam;

async function getData() {
  const url = "http://127.0.0.1:3000/videos";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    Object.keys(json).forEach(function(key) {
        const videoName = json[key].filename;
        const div = document.getElementById('links');
        const p = document.createElement('a');
        const textNode = document.createTextNode(videoName);
        p.href = `http://127.0.0.1:3000/?video=${videoName}`;
        p.appendChild(textNode)
        div.appendChild(p)
    });
}


getData();