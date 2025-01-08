const width = 900;
const height = 500;
const margin = { top: 20, right: 40, bottom: 60, left: 60 };

const svg = d3.select("#chart")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("#tooltip");

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
    .then(data => {
        data.forEach(d => {
            d["Year"] = new Date(d["Year"], 0, 1); 
            d["Time"] = parseTime(d["Time"]);
        });

        const xScale = d3.scaleTime()
            .domain(d3.extent(data, d => d["Year"]))
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleTime()
            .domain([d3.min(data, d => d["Time"]), d3.max(data, d => d["Time"])])
            .range([height - margin.bottom, margin.top]);

        const xAxis = d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%Y"));

        const yAxis = d3.axisLeft(yScale)
            .tickFormat(d3.timeFormat("%M:%S"));

        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis);

        svg.selectAll(".dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("data-xvalue", d => d["Year"].toISOString())
            .attr("data-yvalue", d => d["Time"].toISOString())
            .attr("cx", d => xScale(d["Year"]))
            .attr("cy", d => yScale(d["Time"]))
            .attr("r", 5)
            .on("mouseover", function(event, d) {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`${d["Name"]}: ${d["Nationalité"]}<br>Year: ${d["Year"].getFullYear()}<br>Time: ${d3.timeFormat("%M:%S")(d["Time"])}`)
                    .attr("data-year", d["Year"].getFullYear())
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 50}px`);
            })
            .on("mouseout", function() {
                tooltip.transition().duration(200).style("opacity", 0);
            });

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", margin.top - 10)
            .attr("text-anchor", "middle")
            .attr("id", "title")
    });

function parseTime(time) {
    const [minutes, seconds] = time.split(":").map(Number);
    return new Date(0, 0, 0, 0, minutes, seconds);
}
