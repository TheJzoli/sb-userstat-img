const CATEGORIES_ARR = ["sponsor", "intro", "outro", "interaction", "selfpromo", "music_offtopic", "preview", "poi_highlight", "filler"];
const CATEGORY_COLORS_ARR = ["#00d400", "#00ffff", "#0202ed", "#cc00ff", "#ffff00", "#ff9900", "#008fd6", "#ff1684", "#6600ff"];
const axios = require("axios")
const Canvas = require("canvas")
const BASEURL = "https://sponsor.ajay.app/api"

const categories = async (request, reply) => {
  const userID = request.query.userID;
  const res = await axios.get(`${BASEURL}/userStats?publicUserID=${userID}&fetchCategoryStats=true`)
  const categoryData = Object.values(res.data.categoryCount)
  const total = categoryData.reduce((a, b) => a + b, 0)
  const canvas = Canvas.createCanvas(325, 200);
  const ctx = canvas.getContext("2d");
  const x = canvas.width / 3.25;
  const y = canvas.height / 2;
  let startAngle = -Math.PI / 2;
  ctx.font = "15px Arial";
  for (let i = 0; i < categoryData.length; i++) {
    // create slice of pie chart
    const sliceAngle = 2 * Math.PI * categoryData[i] / total;
    ctx.fillStyle = CATEGORY_COLORS_ARR[i];
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, Math.min(x, y), startAngle, startAngle + sliceAngle);
    ctx.closePath();
    ctx.fill();
    startAngle += sliceAngle;
    // create square label
    const rectX = canvas.width - x * 1.25 + 5;
    const rectY = canvas.height / (categoryData.length + 1) * (i + 1) - 7.5;
    const rectSize = 15;
    ctx.fillRect(rectX, rectY, rectSize, rectSize);
    // create label text
    ctx.fillText(CATEGORIES_ARR[i], rectX + 20, rectY + rectSize * 0.75);
  }
  reply.type("image/png").send(canvas.createPNGStream())
}

module.exports = {
  categories
}