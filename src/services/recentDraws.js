const recentDrawsKey = 'recentDraws';
const maxLength = 20;
const buildData = (draw, url, scheduleDate) => ({
  id: draw.id,
  title: draw.title,
  url,
  scheduleDate,
});
const getAll = () => JSON.parse(localStorage.getItem(recentDrawsKey) || '[]');

const add = (draw, url, scheduleDate) => {
  const recentDraws = getAll();
  const newDraw = buildData(draw, url, scheduleDate);
  const data = [newDraw].concat(recentDraws);
  if (data.length > maxLength) {
    data.pop();
  }
  localStorage.setItem(recentDrawsKey, JSON.stringify(data));
};

const removeDraw = drawId => {
  const recentDraws = getAll();
  const data = recentDraws.filter(draw => draw.id !== drawId);
  localStorage.setItem(recentDrawsKey, JSON.stringify(data));
};

const clear = () => {
  localStorage.clear();
};

export default { getAll, add, removeDraw, clear };
