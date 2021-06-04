function open_side_window(data) {
  document.getElementById("side_window").style.width = `${width / 3}px`;
  document.getElementById("side-title").textContent = `${toTitles(data.source.id)} x ${toTitles(data.target.id)}`;

  const relationshipStats = data.title.map(function (title, i) {
    return [title, new Date(data.year[i], 0, 1), data.budget[i], data.revenue[i], data.imdb_rating[i]];
  });

  relationshipStats.sort(function(a, b) { return a[1] - b[1] })
  const groups = d3.map(relationshipStats, function(d) { return (d[0]) }).keys()
  const subgroups = [2, 3]

  // Add X axis
  const x = d3.scaleBand()
    .domain(groups)
    .range([0, side_width])
    .padding(.2);
  side_x.attr("transform", "translate(0," + side_height + ")")
    .call(d3.axisBottom(x).tickFormat(toTitles))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  const y = d3.scaleLinear()
    .domain([0, d3.max(relationshipStats, function(d) { return Math.max(d[2], d[3]); })])
    .range([side_height, 0]);
  side_y.call(d3.axisLeft(y).tickFormat(d3.format("($.2s")));

   // Add Y axis
  const rating = d3.scaleLinear()
    .domain([0, 10])
    .range([side_height, 0]);

  const xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])

  const color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(['lightpink','lightskyblue'])

  side_data.selectAll(".bar-group").data(relationshipStats).exit().remove();
  side_data.selectAll(".bar-group").selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .exit().remove()
  
  side_data.selectAll(".bar-group")
    .data(relationshipStats)
      .enter()
        .append("g").attr("class", "bar-group")
      .selectAll("rect")
        .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
        .enter().append("rect")
        .on("mouseover", function(d) {		
          tooltip.transition()		
              .duration(200)		
              .style("opacity", .9);		
              tooltip	.html(d3.format("($.2s")(d.value))	
              .style("left", (d3.event.pageX) + "px")		
              .style("top", (d3.event.pageY - 28) + "px");	
          })					
      .on("mouseout", function(d) {		
        tooltip.transition()		
              .duration(500)		
              .style("opacity", 0);	
      });

  side_data.selectAll(".bar-group")
    .transition().duration(500)
      .attr("transform", function(d) { return "translate(" + x(d[0]) + ",0)"; })
      .selectAll("rect")
        .attr("x", function(d) { return xSubgroup(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function(d) { return side_height - y(d.value); })
        .attr("fill", function(d) { return color(d.key); })
        .attr("opacity", '0.8');


  labels = side_data.selectAll("text").data(relationshipStats);
  labels.exit().remove();
  labels.enter().append("text")
      
  side_data.selectAll("text")
    .attr('class', 'place-label')
    .attr("x", function(d) {return x(d[0]) + (x.bandwidth() / 2) + 10})
    .attr("y", function(d) {return rating(d[4]) > side_height/2  ? rating(d[4]) - 10 : rating(d[4]) + 15 })
    .text(function(d) {return d[4]})
    .attr("fill", "darkgoldenrod")
    .attr("font", "bold")
    .attr("font-size", "12px")
    .style("text-anchor", function(d) { return x(d[1]) < side_width/2 ? "start" : "end"});

  circles = side_data.selectAll("circle").data(relationshipStats);
  circles.exit().remove();
  circles.enter()
    .append("circle")
    .attr("r", 0);

  circles = side_data.selectAll("circle").data(relationshipStats);
  circles.transition()
    .duration(500)
    .attr("fill", "darkgoldenrod")
    .attr("cx", function (d) { return x(d[0]) + (x.bandwidth() / 2) })
    .attr("cy", function (d) { return rating(d[4]) })
    .attr("r", 4);

  side_data.selectAll("path").data([relationshipStats], function(d) { return d[4] }).exit().remove();
  line = side_data.selectAll("path").data([relationshipStats], function(d) { return d[4] });
  line
    .enter()
    .append("path")
    .merge(line)
    .transition()
    .duration(500)
    .attr("fill", "none")
    .attr("stroke", "darkgoldenrod")
    .attr("stroke-width", 2)
    .attr("d", d3.line()
      .x(function(d) { return x(d[0]) + (x.bandwidth() / 2) })
      .y(function(d) { return rating(d[4]) })
      )

  let max_height = 0;
  side_x.selectAll('.tick').each(function() {
    if (this.getBBox().height > max_height) 
      max_height = this.getBBox().height;
  })
  d3.select("div#side_chart").select('svg')
    .attr("height", side_height + side_margin.top + side_margin.bottom + max_height)
  
  document.getElementById("side_window").style.height = `${side_height + side_margin.top + side_margin.bottom + max_height + 40}px`;

  const legspacing = 70;
  const legendLabels = ['budget', 'revenue']

  const legend = side_chart.selectAll(".legend")
      .data(subgroups)
      .enter()
      .append("g")

  legend.append("rect")
      .attr("fill", function(d) { return color(d); })
      .attr("width", 15)
      .attr("height", 15)
      .attr("x", function (d, i) {
          return i * legspacing - 30;
      })
      .attr("y", -30);

  legend.append("circle")
      .attr("fill", "darkgoldenrod")
      .attr("r", 4)
      .attr("cx", 2 * legspacing - 20)
      .attr("cy", -22);

  legend.append("text")
      .attr("class", "label")
      .attr("x", function (d, i) {
          return i * legspacing - 10;
      })
      .attr("y", -18)
      .attr("text-anchor", "start")
      .text(function (d, i) {
          return legendLabels[i];
      });

  legend.append("text")
      .attr("class", "label")
      .attr("x", 2 * legspacing - 10)
      .attr("y", -18)
      .attr("text-anchor", "start")
      .text('IMDb Rating');

  side_data.selectAll(".bar-group, .place-label, circle, path").sort(function(d1, d2) {
    if (d1.type === d2.type)
        return 0;
    return d1.type === ".bar-group" ? -1 : 1;
  });
}

/* Set the width of the sidebar to 0 (hide it) */
function close_side_window() {
  document.getElementById("side_window").style.width = "0";
}
