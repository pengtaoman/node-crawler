// const puppeteer = require(''@percy/puppeteer'')
//const puppeteer = require('puppeteer-core');
const puppeteer = require('puppeteer');
async function main() {
  const username = 'hulitw'

  const url = 'https://medium.com/@' + username
  // const url = 'https://hulitw.medium.com'
  // const url = 'https://www.cuucloud.com'

  const browser = await puppeteer.launch({
    headless: true,
    args: [ '--proxy-server=socks5://127.0.0.1:1086' ]
  })

  // 造訪頁面
  const page = await browser.newPage()
  await page.goto(url, {
    waitUntil: 'domcontentloaded'
  })

  // 執行準備好的 script 並回傳資料 
  console.log('000000000000000000000000000000000000')
  const data = await page.evaluate(mediumParser)
  // const data = await page.evaluate(() => {
  //   return document.querySelector('p').innerText;
  // })
  console.log(data)
  console.log('====================================')
  // console.log(page)
  await page.close()
  await browser.close()
}
var mediumParser = () => {
   console.log('11112222333')
  //  return document.querySelector('p').innerText;
  // selector 是透過觀察而得來的
  // const elements = document.querySelectorAll('section > div:nth-child(2) > div > div')
  const elements = document.querySelectorAll('p[id="e65f"]')[0].innerText
  console.log(elements.length + '>>>>>>>>>>>>>>>>>>>>>')
  const result = []
  /*** 
  for (let i = 0; i < elements.length; i++) {
    const h1 = elements[i].querySelector('h1')
    const a = elements[i].querySelectorAll('a')
    if (h1) {
      result.push({
        title: h1.innerText,
        link: a[3].href
      })
    }
  }
  return result
  */
  return elements
}

main()