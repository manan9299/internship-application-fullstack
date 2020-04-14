addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})
/**
 * Respond with hello worker text
 * @param {Request} request
 */
async function handleRequest(request) {

  const URL = "https://cfw-takehome.developers.workers.dev/api/variants"

  let urlListResp = await fetch(URL)
  let urlListData = await urlListResp.json();

  urlListData = urlListData["variants"]
  console.log(urlListData["variants"])

  let selectedVariantIdx = getRandom(2);
  console.log(urlListData[selectedVariantIdx])

  let selectedVariantResp = await fetch(urlListData[selectedVariantIdx].toString())
  let selectedVariantHtml = await selectedVariantResp.text();

  return new Response(selectedVariantHtml, {
    headers : {"content-type" : "text/html"}
  })
}

function getRandom(maxNum){
  return Math.floor(Math.random() * maxNum)
}
