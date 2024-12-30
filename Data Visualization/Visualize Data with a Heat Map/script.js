const margin = { top: 20, right: 40, bottom: 60, left: 60 };
const width = 960 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const svg = d3.select("#heatmap")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const tooltip = d3.select("#tooltip");

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then(data => {
        const baseTemperature = data.baseTemperature;
        const monthlyData = data.monthlyVariance;

        const years = [...new Set(monthlyData.map(d => d.year))];
        const months = [...new Set(monthlyData.map(d => d.month))];

        const xScale = d3.scaleBand()
            .domain(years)
            .range([0, width])
            .padding(0.05);

        const yScale = d3.scaleBand()
            .domain(months)
            .range([0, height])
            .padding(0.05);

        const colorScale = d3.scaleSequential(d3.interpolateRdYlBu)
            .domain([
                d3.min(monthlyData, d => baseTemperature + d.variance),
                d3.max(monthlyData, d => baseTemperature + d.variance)
            ]);

        const xAxis = d3.axisBottom(xScale).tickValues(years.filter((d, i) => i % 5 === 0));
        const yAxis = d3.axisLeft(yScale).tickFormat(d => d3.timeFormat("%B")(new Date(0, d - 1)));

        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        svg.append("g")
            .attr("id", "y-axis")
            .call(yAxis);

        svg.selectAll(".cell")
            .data(monthlyData)
            .enter()
            .append("rect")
            .attr("class", "cell")
            .attr("data-month", d => d.month)
            .attr("data-year", d => d.year)
            .attr("data-temp", d => baseTemperature + d.variance)
            .attr("x", d => xScale(d.year))
            .attr("y", d => yScale(d.month))
            .attr("width", xScale.bandwidth())
            .attr("height", yScale.bandwidth())
            .attr("fill", d => colorScale(baseTemperature + d.variance))
            .on("mouseover", function (event, d) {
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(
                    `${d3.timeFormat("%B")(new Date(0, d.month - 1))} ${d.year}<br>
                    ${Math.round((baseTemperature + d.variance) * 10) / 10}°C`
                )
                    .attr("data-year", d.year)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY - 50}px`);
            })
            .on("mouseout", function () {
                tooltip.transition().duration(200).style("opacity", 0);
            });

        const legend = d3.select("#legend-svg");

        const legendScale = d3.scaleLinear()
            .domain([d3.min(monthlyData, d => baseTemperature + d.variance), d3.max(monthlyData, d => baseTemperature + d.variance)])
            .range([0, 200]);

        const legendAxis = d3.axisBottom(legendScale).ticks(4);

        legend.selectAll("rect")
            .data(colorScale.ticks(4))
            .enter()
            .append("rect")
            .attr("x", (d, i) => i * 50)
            .attr("y", 0)
            .attr("width", 50)
            .attr("height", 20)
            .style("fill", d => colorScale(d));

        legend.append("g")
            .attr("transform", "translate(0, 25)")
            .attr("id", "legend")
            .call(legendAxis);
    });
