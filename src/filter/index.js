export default (text) => {
  return text.replace(/(style|class|id)\=\"[^\"]+\"/g, "")
            .replace(/\href\=\"[^\"]+\"/, 'href="javascript:;"')
}
