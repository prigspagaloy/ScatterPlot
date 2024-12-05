d3.select("body")
  .append("div")
  .attr("id", "title")
  .append("h1")
  .text("Doping in Professional Bicycle Racing")
  .style("text-align", "center")

d3.select("body")
  .append("div")
  .append("p")
  .text("35 Fastest times up Alpe d'Huez")
  .style("text-align", "center")
  .style("font-size", "25px")


d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then(data => {
    
    const w = 800;
    const h = 450;
    const padding = 40;
    
    const svg = d3.select("body")
                  .append("div")
                  .attr("id", "svg-container")
                  .append("svg")
                  .attr("width", w + 100)
                  .attr("height", h)
                  .style("padding-left", "100px")

    const tooltip = d3.select("#svg-container")
                      .append("div")
                      .attr("id", "tooltip")
                      .style("opacity", "0")

    const x = d3.scaleLinear()
                .domain([d3.min(data, (d) => d.Year - 1), d3.max(data, (d) => d.Year + 1)])
                .range([padding, w - padding])

    const y = d3.scaleTime()
                .domain([d3.min(data, (d) => new Date(d.Seconds * 1000)), d3.max(data, (d) => new Date(d.Seconds * 1000))])
                .range([padding, h - padding])

    const xAxis = d3.axisBottom(x)
                    .tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(y)
                    .tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
       .call(xAxis)
       .attr("id", "x-axis")
       .attr("transform", "translate(0, "+ (h - padding) +")")

    svg.append("g")
       .call(yAxis)
       .attr("id", "y-axis")
       .attr("transform", "translate("+padding+", 0)")

    svg.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("class", "dot")
       .attr("r", "8")
       .attr("data-xvalue", (d) => d.Year)
       .attr("data-yvalue", (d) => new Date(d.Seconds * 1000))
       .attr("cx", (d) => x(d.Year))
       .attr("cy", (d) => y(new Date(d.Seconds * 1000)))
       .attr("fill", (d) => {
        if (d.Doping != "") {
            return "hsl(185 57% 36%)";
        } else {
            return "orange";
        }
       })
       .on("mouseover", (event, d) => {
            tooltip.transition()
                   .style("opacity", "0.9")
                   .style("duration", "0")
                   .style("padding", "10px")
                   .style("position", "absolute")
                   .style("left", event.pageX + "px")
                   .style("top", event.pageY - 80 + "px")
                   .style("background-color", "hsla(197 53% 38% / 0.82)")
                   .style("border-radius", "10px")
                   .style("pointer-events", "none")
    
            tooltip.html(d.Name + ":" + " " + d.Nationality + "<br/>" + " Year: " + d.Year + ", Time: " + d.Time + (d.Doping ? "<br/>" + d.Doping : ""))
                   .attr("data-year", d.Year)
       })
       .on("mouseout", () => {
            tooltip.transition()
                   .style("opacity", "0")
       })

    const legendContainer = svg.append("g")
                               .attr("id", "legend")
          
    const legend = legendContainer.append("g")
                                  .attr("class", "legend-line")
          legend.append("rect")
                .attr("x", w - 70)
                .attr("y", h - 310)
                .attr("width", 12)
                .attr("height", 12)
                .attr("fill", "orange")
          legend.append("text")
                .text("No doping allegations")
                .style("text-anchor", "end")
                .attr("x", w - 80)
                .attr("y", h - 300)

    const legend2 = legendContainer.append("g")
                                   .attr("class", "legend-line")
          legend2.append("rect")
                 .attr("x", w - 70)
                 .attr("y", h - 290)
                 .attr("width", 12)
                 .attr("height", 12)
                 .attr("fill", "hsl(185 57% 36%)")
          legend2.append("text")
                 .text("Riders with doping allegations")
                 .style("text-anchor", "end")
                 .attr("x", w - 80)
                 .attr("y", h - 280)
}).catch(error => console.error(error));