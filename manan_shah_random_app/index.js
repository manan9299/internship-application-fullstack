const variantsUrl = "https://cfw-takehome.developers.workers.dev/api/variants"
const githubUrl = "https://github.com/manan9299"
const linkedinUrl = "https://www.linkedin.com/in/manan9199"
const cookieName = "RandomPagesCookie"

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond random HTML web page from a list of pages
 * @param {Request} request
 */
async function handleRequest(request) {
  let cookie = request.headers.get("cookie")
  
  let urlListResp = await fetch(variantsUrl)
  let urlListData = await urlListResp.json();

  urlListData = urlListData["variants"]

  let selectedVariantIdx = 0

  // Check if user has already been served a page
  if(cookie && cookie.includes(`${cookieName}=variant0`)){
    selectedVariantIdx = 0
  } else if(cookie && cookie.includes(`${cookieName}=variant1`)){
    selectedVariantIdx = 1
  } else {
    // Get 0 or 1 with 50/50 chance
    selectedVariantIdx = Math.random() < 0.5 ? 0 : 1;
  }
  
  let variantResp = await fetch(urlListData[selectedVariantIdx])
  let variantHtml = await variantResp.text()
  let response = new Response(variantHtml)
  response.headers.set("Set-Cookie", `${cookieName}=variant${selectedVariantIdx}`)
  response.headers.set("content-type", "text/html")

  // update the response
  return new HTMLRewriter()
  .on("*", new VariantRewriter("variant" + selectedVariantIdx)).transform(response)
}

class VariantRewriter{

  constructor(variantName){
    this.variantName = variantName
  }

  element(element){
    let elementTag = element.tagName;

    // personalize title of page
    if(elementTag === "title"){
      element.setInnerContent("Manan's " + this.variantName)
    }

    // personalize popup title
    if(elementTag === "h1" && element.getAttribute("id") === "title"){
      element.setInnerContent("Manan's custom popup")
    }

    // Change popup description based on variant
    if(elementTag === "p" && element.getAttribute("id") === "description"){
      if(this.variantName === "variant0"){
        element.setInnerContent("Click below to checkout my GitHub")
      } else {
        element.setInnerContent("Click below to checkout my LinkedIn profile")
      }
    }

    // Update link inside popup to redirect to LinkedIn or GitHub based on variant
    if(elementTag === "a" && element.getAttribute("id") === "url"){
      if(this.variantName === "variant0"){
        element.setInnerContent("Manan Shah's GitHub")
        element.setAttribute("href", githubUrl)
      } else {
        element.setInnerContent("Manan Shah's LinkedIn")
        element.setAttribute("href", linkedinUrl)
      }
    }
  }
}
