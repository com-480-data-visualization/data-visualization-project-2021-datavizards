// Responsible for showing which nodes have been searched for
// 
// transitionTime is the time (in ms) the transition from a regular node to a searched node will take.
function highlightSearchedNodes(nodes, transitionTime = 500) {
  // Note: We do not rely on this.value here,
  // because we will call that function when we have no event binding to do,
  // so "this" in that case will not point to the input.
  // 
  // The tradeoff here is to explicitly search for the search input in here.
  const searchValue = d3.select("input#search").node().value.toLowerCase();

    // If we didn't enter any filter or a filter that is too short: reset all nodes borders.
  if (!searchValue || searchValue.length < 2) {
    nodes
      .attr("stroke", "white")
      .style('opacity', 1)
      .attr("stroke-width", 1);
  } else { // Otherwise, change the border of the nodes matching the filter
    const regularCircles  = nodes.filter(node => !node.id.includes(searchValue));
    const filteredCircles = nodes.filter(node => node.id.includes(searchValue));

    filteredCircles
    .attr("stroke", "red")
    .transition().duration(transitionTime)
    .style('opacity', 1)
    .attr("stroke-width", 3);

    regularCircles
    .attr("stroke", "white")
    .transition() // We want the same transition for those, no matter what transitionTime is set to
    .style('opacity', 0.5)
    .attr("stroke-width", 1);
  }
}
