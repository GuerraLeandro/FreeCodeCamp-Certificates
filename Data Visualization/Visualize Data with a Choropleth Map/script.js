const margin = { top: 20, right: 40, bottom: 60, left: 60 };
const width = 960 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select("#choropleth-map")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const tooltip = d3.select("#tooltip");

d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json')
    .then(educationData => {
        d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json')
            .then(countyData => {
                const counties = topojson.feature(countyData, countyData.objects.counties).features;
                
                const colorScale = d3.scaleQuantize()
                    .domain([0, d3.max(educationData, d => d.bachelorsOrHigher)])
                    .range(d3.schemeBlues[9]);

                const educationByFIPS = new Map();
                educationData.forEach(d => {
                    educationByFIPS.set(d.fips, d.bachelorsOrHigher);
                });

                svg.selectAll(".county")
                    .data(counties)
                    .enter()
                    .append("path")
                    .attr("class", "county")
                    .attr("d", d3.geoPath())
                    .attr("data-fips", d => d.id)
                    .attr("data-education", d => educationByFIPS.get(d.id))
                    .attr("fill", d => colorScale(educationByFIPS.get(d.id)))
                    .on("mouseover", function(event, d) {
                        const countyData = educationByFIPS.get(d.id);
                        tooltip.transition().duration(200).style("opacity", 0.9);
                        tooltip.html(`${d.properties.name}<br>Education Level: ${countyData}%`)
                            .attr("data-education", countyData)
                            .style("left", `${event.pageX + 10}px`)
                            .style("top", `${event.pageY - 50}px`);
                    })
                    .on("mouseout", function() {
                        tooltip.transition().duration(200).style("opacity", 0);
                    });

                const legend = d3.select("#legend-svg");
                const legendScale = d3.scaleQuantize()
                    .domain([0, d3.max(educationData, d => d.bachelorsOrHigher)])
                    .range([0, 300]);

                legend.selectAll("rect")
                    .data(d3.schemeBlues[9])
                    .enter()
                    .append("rect")
                    .attr("x", (d, i) => i * 30)
                    .attr("y", 0)
                    .attr("width", 30)
                    .attr("height", 20)
                    .style("fill", d => d);

                const legendAxis = d3.axisBottom(legendScale)
                    .ticks(5);

                legend.append("g")
                    .attr("transform", "translate(0, 25)")
                    .call(legendAxis);
            });
    });
