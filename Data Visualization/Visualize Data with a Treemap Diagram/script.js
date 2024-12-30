d3.json("https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json").then(function(data) {
    const width = 800, height = 600;
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const treemap = d3.treemap()
        .size([width, height])
        .padding(1)
        .round(true);
    const root = d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);

    treemap(root);

    const svg = d3.select("#treemap");

    svg.selectAll("rect")
        .data(root.leaves())
        .enter().append("rect")
        .attr("class", "tile")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr("width", d => d.x1 - d.x0)
        .attr("height", d => d.y1 - d.y0)
        .attr("fill", d => color(d.data.category))
        .attr("data-name", d => d.data.name)
        .attr("data-category", d => d.data.category)
        .attr("data-value", d => d.data.value)
        .on("mouseover", function(event, d) {
            const tooltip = d3.select("#tooltip");
            tooltip.transition().duration(200).style("opacity", 1);
            tooltip.html(`${d.data.name}<br>Category: ${d.data.category}<br>Value: $${d.data.value}`)
                .attr("data-value", d.data.value)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", function() {
            d3.select("#tooltip").transition().duration(200).style("opacity", 0);
        });


    const legend = d3.select("#legend-svg");
    const categories = root.children.map(d => d.data.name);
    

    const legendWidth = 300;
    const legendSpacing = 40;
    const numberOfItems = categories.length;


    legend.attr("width", legendWidth);
    
    legend.selectAll("rect")
        .data(categories)
        .enter().append("rect")
        .attr("class", "legend-item")
        .attr("x", (d, i) => i * legendSpacing)  
        .attr("y", 10)
        .attr("width", 30)
        .attr("height", 20)
        .attr("fill", (d, i) => color(d));


    legend.selectAll("text")
        .data(categories)
        .enter().append("text")
        .attr("x", (d, i) => i * legendSpacing + 35)  
        .attr("y", 25)
        .text(d => d)
        .style("font-size", "12px")
        .style("text-anchor", "start");
});
