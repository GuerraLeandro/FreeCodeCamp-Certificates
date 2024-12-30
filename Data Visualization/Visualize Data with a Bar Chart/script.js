const width = 900;
const height = 500;
const margin = { top: 20, right: 40, bottom: 40, left: 40 };

const svg = d3.select("#chart")
    .attr("width", width)
    .attr("height", height);

const tooltip = d3.select("#tooltip");

d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
    .then(data => {
        const dataset = data.data;

        const xScale = d3.scaleTime()
            .domain(d3.extent(dataset, d => new Date(d[0])))
            .range([margin.left, width - margin.right]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d[1])])
            .nice()
            .range([height - margin.bottom, margin.top]);

        const xAxis = d3.axisBottom(xScale)
            .ticks(d3.timeYear.every(5))
            .tickFormat(d3.timeFormat("%Y"));

        const yAxis = d3.axisLeft(yScale)
            .ticks(10);

        svg.append("g")
            .attr("id", "x-axis")
            .attr("transform", `translate(0, ${height - margin.bottom})`)
            .call(xAxis);

        svg.append("g")
            .attr("id", "y-axis")
            .attr("transform", `translate(${margin.left}, 0)`)
            .call(yAxis);

        svg.selectAll(".bar")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("data-date", d => d[0])
            .attr("data-gdp", d => d[1])
            .attr("x", (d, i) => xScale(new Date(d[0])))
            .attr("y", d => yScale(d[1]))
            .attr("width", (width - margin.left - margin.right) / dataset.length - 1)
            .attr("height", d => height - margin.bottom - yScale(d[1]))
            .attr("index", (d, i) => i)
            .on("mouseover", function(event, d) {
                const i = d3.select(this).attr("index");
                tooltip.transition().duration(200).style("opacity", 0.9);
                tooltip.html(`${dataset[i][0]}<br>GDP: $${dataset[i][1].toFixed(1)} Billion`)
                    .attr("data-date", dataset[i][0])
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
