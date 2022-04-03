import React from 'react';
import _ from 'lodash';
import useD3 from './d3.hook';
import * as d3 from 'd3';

function MultiLineChart({
    data,
    height = 400,
    width = 600,
    xTicks = 6,
    yTicks = 6,
    frameHeight = window.innerWidth < 576 ? 300 : 400
}) {
    const ref = useD3(
        (svg) => {
            if (data) {
                const margin = { top: 20, right: 30, bottom: 30, left: 40 };
                const maxX = d3.max(data, f => d3.max(f.map(m => m.x)));
                const minX = d3.min(data, g => d3.min(g.map(m => m.x)));
                const lineColors = ["#4f135e", "#f97f50"];

                // Create a x-Scale
                const x = d3
                    .scaleTime()
                    .domain([minX, maxX])
                    .range([margin.left, width - margin.right]);


                // Create a y-Scale
                const y1 = d3
                    .scaleLinear()
                    .domain([0, d3.max([6, d3.max(data, p => d3.max(p.map(m => m.y)))])])
                    .rangeRound([height - margin.bottom, margin.top]);

                // Function to draw x-axis
                const xAxis = (g) =>
                    g
                        .attr("transform", `translate(0,${height - margin.bottom})`)
                        .call(
                            d3
                                .axisBottom(x)
                                .ticks(xTicks)
                                .tickSizeOuter(0)
                        );

                // Function to draw y-axis
                const y1Axis = (g) =>
                    g
                        .style("color", "steelblue")
                        .call(d3
                            .axisLeft(y1)
                            .ticks(yTicks)
                        )
                        .call((m) => m.select(".domain").remove())

                svg.select(".x-axis").call(xAxis);
                svg.select(".y-axis").call(y1Axis);

                // Function to draw the lines of the line chart
                const line = d3
                    .line()
                    .x(d => x(d.x))
                    .y(d => y1(d.y))

                // Draw Lines
                svg
                    .select(".plot-area")
                    .selectAll("path")
                    .data(data)
                    .join("path")
                    .attr("d", d => line(d))
                    .attr("stroke", (d, i) => lineColors[i])
                    .attr("fill", "none")
                    .attr("stroke-width", 2)

                // Function to Register event listener to Dots
                const registerHoverEvent = (dots, svg1) => {
                    function entered(e) {
                        const xPos = this.transform.baseVal[0].matrix.e;
                        const yPos = this.transform.baseVal[0].matrix.f;
                        const realWorldValue = Math.round(y1.invert(yPos));

                        // Show Rectangular box to show points
                        svg1
                            .append("g")
                            .attr("class", "hint_tooltip")
                            .attr("transform", `translate(${xPos + 7}, ${yPos - 18})`)
                            .append("path")
                            .attr("cs", "100,100")
                            .attr("d", "M0.5,0.5 L0.5,11.5 L-5.5,17.5 L0.5,23.5 L0.5,34.5 L91.5,34.5 L91.5,0.5 L0.5,0.5 Z")
                            .attr("fill", "rgba(36,28,21,0.90)")
                            .attr("stroke", "#FFFFFF")
                            .attr("fill-opacity", "1")
                            .attr("stroke-width", "0")
                            .attr("stroke-opacity", "1")

                        // Increasing Dot Radius
                        const currentDot = d3.select(this);
                        currentDot.attr("r", 3);

                        // Add the value text
                        svg1
                            .select('.hint_tooltip')
                            .append("text")
                            .text(`Y: ${realWorldValue}`)
                            .attr("fill", "white")
                            .attr("font-size", "13")
                            .attr("x", 12)
                            .attr("y", 23);
                    }

                    function left() {
                        svg1.select(".hint_tooltip").remove();
                        const currentDot = d3.select(this);
                        currentDot.attr("r", 2);
                    }

                    dots.on("mouseenter", entered);
                    dots.on("mouseleave", left);
                }

                // Function to create Dots on the points
                const createLineDots = g =>
                    g
                        .selectAll("g")
                        .data(data)
                        .join("g")
                        .selectAll("circle")
                        .data((d, i) => d.map(e => ({ ...e, row: i })))
                        .join("circle")
                        .attr("r", 2)
                        .attr("fill", d => lineColors[d.row])
                        .attr("stroke", d => lineColors[d.row])
                        .attr("fill-opacity", "1")
                        .attr("stroke-width", "2")
                        .attr("stroke-opacity", "0")
                        .attr("transform", d => `translate(${x(d.x)},${y1(d.y)}) scale(1)`)
                        .call(registerHoverEvent, svg)

                // Create dots by calling createLineDots
                svg
                    .select(".plot-area")
                    .call(createLineDots)

                // Change Y-Axis Label
                svg
                    .select(".y-axis")
                    .selectAll("g")
                    .select("text")
                    .attr("fill", "#241C15")
                    .attr("font-family", "'Graphik Web',' Helvetica Neue', Arial, Helvetica, Verdana, sans-serif")
                    .attr("font-size", "14")
                    .attr("opacity", "1")
                    .attr("text-anchor", "end")
                    .attr("x", margin.left - (width * 0.01))

                // Change Y-Axis Line
                svg
                    .select(".y-axis")
                    .selectAll("g")
                    .select("line")
                    .attr("x1", x(minX))
                    .attr("x2", x(maxX))
                    .attr("fill", "none")
                    .attr("stroke", "#000000")
                    .attr("stroke-width", "1")
                    .attr("stroke-opacity", "0.15")

                // Change X-Axis Line
                svg
                    .select(".x-axis")
                    .select("path")
                    .attr("fill", "none")
                    .attr("stroke-width", "2")
                    .attr("stroke-opacity", "1")
                    .attr("stroke", "#241C15")

                // Change X-Axis Label
                svg
                    .select(".x-axis")
                    .selectAll("g")
                    .select("text")
                    .attr("y", height * 0.035)
                    .attr("font-size", 14)
                    .attr("text-anchor", "middle")
                    .attr("fill", "#241C15")
                    .attr("stroke", "none")
                    .attr("font-family", "'Graphik Web',' Helvetica Neue', Arial, Helvetica, Verdana, sans-serif");

            }
        },
        [data]
    );

    return (
        <svg
            ref={ref}
            viewBox={`0 0 ${width} ${height}`}
            style={{
                height: frameHeight,
                width: "100%",
                marginRight: "0px",
                marginLeft: "0px",
            }}
            viewBox={`0 0 ${width} ${height}`}
            data-testid='multiline-chart-svg'
        >
            <g className="plot-area" />
            <g className="x-axis" />
            <g className="y-axis" />
        </svg>
    );
}

export default MultiLineChart;
